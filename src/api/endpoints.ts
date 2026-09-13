export const API_ENDPOINTS = {
    VENDORS: {
        CREATE: "/vendors",
        ME: "/vendors/me",
    },
    AUTH: {
        LOGIN: "/auth/vendor/login",
        REFRESH: "/auth/vendor/refresh-token",
        LOGOUT: "/auth/vendor/logout",
    },
    VEHICLES: {
        CREATE: "/vehicles",
        LIST: "/vehicles",
    },
} as const;