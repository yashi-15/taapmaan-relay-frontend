import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";
import { API_ENDPOINTS } from "./endpoints";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api/v1";

// In-memory access token storage (XSS protection).
let inMemoryAccessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
    inMemoryAccessToken = token;
};

export const getAccessToken = (): string | null => {
    return inMemoryAccessToken;
};

/**
 * The refresh-token endpoint expects the refresh token in the request BODY,
 * so it has to live somewhere the client can read it back from — hence
 * localStorage rather than an httpOnly cookie.
 *
 * OPEN QUESTION FOR BACKEND: the login response (POST /auth/vendor/login)
 * currently only returns `data.token`, with no `data.refreshToken`. That
 * means nothing ever gets written here after a normal login — only after a
 * successful call to POST /auth/vendor/refresh-token, which *does* return
 * one. Until login also returns a refreshToken (or the refresh token is
 * delivered via httpOnly cookie instead), sessions can't survive a page
 * reload. Confirm which of those two the backend intends.
 */
const REFRESH_TOKEN_KEY = "vendor_refresh_token";

export const setRefreshToken = (token: string | null) => {
    if (token) {
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } else {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
};

export const getRefreshToken = (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
};

type TokenRefreshCallback = (token: string | null) => void;
type AuthFailureCallback = () => void;

let onTokenRefreshedCallback: TokenRefreshCallback | null = null;
let onAuthFailureCallback: AuthFailureCallback | null = null;

export const setAuthCallbacks = (
    onRefreshed: TokenRefreshCallback | null,
    onFailed: AuthFailureCallback | null
) => {
    onTokenRefreshedCallback = onRefreshed;
    onAuthFailureCallback = onFailed;
};

export const authClient = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAccessToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

interface FailedRequestQueueItem {
    resolve: (token: string | null) => void;
    reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequestQueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    _retry?: boolean;
}

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as CustomAxiosRequestConfig & InternalAxiosRequestConfig;

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            const storedRefreshToken = getRefreshToken();

            // No refresh token on hand (e.g. fresh login never returned one) —
            // don't bother queuing/retrying, just fail straight to auth-failure.
            if (!storedRefreshToken) {
                setAccessToken(null);
                onAuthFailureCallback?.();
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise<string | null>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (token && originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return apiClient(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const response = await authClient.post(API_ENDPOINTS.AUTH.REFRESH, {
                    refreshToken: storedRefreshToken,
                });

                const newAccessToken = response.data?.data?.accessToken;
                const newRefreshToken = response.data?.data?.refreshToken;

                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken ?? storedRefreshToken);

                onTokenRefreshedCallback?.(newAccessToken);
                processQueue(null, newAccessToken);

                if (newAccessToken && originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }

                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                setAccessToken(null);
                setRefreshToken(null);
                onAuthFailureCallback?.();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;