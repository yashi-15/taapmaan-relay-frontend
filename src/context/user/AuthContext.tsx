import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

export interface AuthActionResult<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}

// Minimal fake "vendor" shape — trim/extend fields as your UI actually needs them.
export interface VendorData {
    email: string;
    name?: string;
    role?: string;
    permissions?: string[];
}

export interface LoginCredentials {
    emailOrCarrierId: string;
    password: string;
}

interface AuthContextValue {
    user: VendorData | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<AuthActionResult<VendorData>>;
    logout: () => Promise<void>;
    setUser: (user: VendorData | null) => void;
    clearError: () => void;
    hasRole: (role: string) => boolean;
    hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ---- Hardcoded fake credentials ----
// Change these to whatever you want the "valid" login to be.
const FAKE_EMAIL = "admin@company.com";
const FAKE_PASSWORD = "taapmaan-vendor";

const FAKE_USER: VendorData = {
    email: FAKE_EMAIL,
    name: "Admin",
    role: "vendor",
    permissions: ["*"],
};

// Persist the fake session across page refreshes without any backend.
const SESSION_KEY = "fake_auth_session";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUserState] = useState<VendorData | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setErrorState] = useState<string | null>(null);

    // On mount, restore session from localStorage if present (purely client-side).
    useEffect(() => {
        try {
            const stored = localStorage.getItem(SESSION_KEY);
            if (stored) {
                const parsed = JSON.parse(stored) as VendorData;
                setUserState(parsed);
                setIsAuthenticated(true);
            }
        } catch {
            localStorage.removeItem(SESSION_KEY);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = useCallback(async (credentials: LoginCredentials): Promise<AuthActionResult<VendorData>> => {
        setLoading(true);
        setErrorState(null);

        // Simulate a tiny delay so the loading state / spinner still makes sense.
        await new Promise((resolve) => setTimeout(resolve, 400));

        const emailMatches = credentials.emailOrCarrierId.trim().toLowerCase() === FAKE_EMAIL.toLowerCase();
        const passwordMatches = credentials.password === FAKE_PASSWORD;

        if (emailMatches && passwordMatches) {
            localStorage.setItem(SESSION_KEY, JSON.stringify(FAKE_USER));
            setUserState(FAKE_USER);
            setIsAuthenticated(true);
            setLoading(false);
            return { success: true, data: FAKE_USER };
        }

        setLoading(false);
        const errorMessage = "Invalid email or password.";
        setErrorState(errorMessage);
        return { success: false, error: errorMessage };
    }, []);

    const logout = useCallback(async (): Promise<void> => {
        localStorage.removeItem(SESSION_KEY);
        setUserState(null);
        setIsAuthenticated(false);
    }, []);

    const setUser = useCallback((userData: VendorData | null) => {
        setUserState(userData);
        if (userData) {
            setIsAuthenticated(true);
            localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
        }
    }, []);

    const clearError = useCallback(() => setErrorState(null), []);

    const hasRole = useCallback((role: string) => user?.role === role, [user?.role]);
    const hasPermission = useCallback(
        (permission: string) =>
            Array.isArray(user?.permissions) && (user!.permissions!.includes("*") || user!.permissions!.includes(permission)),
        [user]
    );

    const value = useMemo<AuthContextValue>(() => ({
        user,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        setUser,
        clearError,
        hasRole,
        hasPermission,
    }), [user, isAuthenticated, loading, error, login, logout, setUser, clearError, hasRole, hasPermission]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

/** Route guard HOC — unchanged behavior, no backend involved. */
export const withAuth = <P extends object>(Component: React.ComponentType<P>): React.FC<P> => {
    return function AuthenticatedComponent(props: P) {
        const { isAuthenticated, loading } = useAuth();

        if (loading) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-slate-50">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm text-slate-500 font-medium">Verifying authentication...</p>
                    </div>
                </div>
            );
        }

        if (!isAuthenticated) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                            !
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                        <p className="text-gray-600 mb-6">Please log in to access this page.</p>
                        <a
                            href="/login"
                            className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5"
                        >
                            Go to Login
                        </a>
                    </div>
                </div>
            );
        }

        return <Component {...props} />;
    };
};

export default AuthProvider;