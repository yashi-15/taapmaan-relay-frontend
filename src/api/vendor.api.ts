import { apiClient, authClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";

export interface VendorDocuments {
    gstin: string;
    panCard: string;
    carrierAgreementUrl?: string;
    programmePolicyUrl?: string;
}

export interface VendorBankDetails {
    bankName: string;
    accountHolderName: string;
    ifscCode: string;
    /** Backend returns this masked (e.g. "*********012") on read endpoints. */
    bankAccountNumber: string;
}

export type OnboardingSource = "SELF_ONBOARDED" | "ADMIN_ONBOARDED" | string;
export type VendorStatus = "PENDING" | "ACTIVE" | string;

// NOTE: neither the "complete" nor "minimal" request body examples in the
// vendor onboarding docs include a `password` field, even though vendors
// clearly need one to log in later (POST /auth/vendor/login takes a
// password). Confirm with backend whether it's (a) missing from the docs,
// (b) auto-generated and emailed to the vendor, or (c) set via a separate
// endpoint. Left out of CreateVendorPayload below until that's confirmed —
// add it back in if backend confirms it's required on this endpoint.
export interface CreateVendorPayload {
    name: string;
    companyName: string;
    carrierIdentifier: string;
    email: string;
    countryCode: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
    domiciles: string[];
    onboardingSource?: OnboardingSource;
    documents: VendorDocuments;
    bankDetails: VendorBankDetails;
}

export interface VendorData {
    id: string;
    name: string;
    companyName: string;
    carrierIdentifier: string;
    email: string;
    countryCode: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    domiciles: string[];
    documents: VendorDocuments;
    bankDetails: VendorBankDetails;
    status: VendorStatus;
    onboardingSource: OnboardingSource;
    createdAt: string;
    updatedAt: string;
    /** Not present in the vendor docs — kept optional for the admin/vendor
     * nav split in Layout.tsx. Confirm with backend if/when admin accounts
     * are exposed through this same shape. */
    role?: string;
    permissions?: string[];
}

export interface VendorFieldError {
    field: string;
    message: string;
}

export interface CreateVendorResponse {
    success: boolean;
    message: string;
    data?: VendorData;
    error?: string;
    errors?: VendorFieldError[];
}

export interface LoginCredentials {
    emailOrCarrierId: string;
    password: string;
}

export interface LoginResponseData {
    token: string;
    vendor: VendorData;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: LoginResponseData;
}

export interface RefreshTokenResponse {
    success: boolean;
    message: string;
    data: {
        accessToken: string;
        refreshToken: string;
        token: string;
    };
}

export interface LogoutResponse {
    success: boolean;
    message: string;
    data: { message: string };
}

export interface VendorProfileResponse {
    success: boolean;
    message: string;
    data: VendorData;
}

export const authAPI = {
    // Public registration endpoint — no bearer token yet, so use authClient.
    create: (data: CreateVendorPayload) =>
        authClient.post<CreateVendorResponse>(API_ENDPOINTS.VENDORS.CREATE, data),

    login: (credentials: LoginCredentials) =>
        authClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials),

    refresh: (refreshToken: string) =>
        authClient.post<RefreshTokenResponse>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken }),

    // Body shape per docs is `{ refreshToken: "" }` — pass "" when none is on hand.
    logout: (refreshToken?: string | null) =>
        authClient.post<LogoutResponse>(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken: refreshToken ?? "" }),

    getUserInfo: () =>
        apiClient.get<VendorProfileResponse>(API_ENDPOINTS.VENDORS.ME),

    updateUserInfo: (data: Partial<CreateVendorPayload> | Record<string, unknown>) =>
        apiClient.patch<VendorProfileResponse>(API_ENDPOINTS.VENDORS.ME, data),
};

export default authAPI;