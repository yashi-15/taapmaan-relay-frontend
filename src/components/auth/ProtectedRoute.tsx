import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/user/AuthContext";

interface ProtectedRouteProps {
    children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // 1. Silent refresh is underway (initial boot or token restoration)
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-light">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-zinc-600 font-medium tracking-wide">
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    // 2. Unauthenticated -> Redirect to login while preserving target route
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. Authenticated -> Render protected content
    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
