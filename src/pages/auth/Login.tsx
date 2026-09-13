import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import { useAuth } from "../../context/user/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";

const Login: React.FC = () => {
    const [email, setEmail] = useState("admin@company.com");
    const [password, setPassword] = useState("taapmaan-vendor");
    const [formError, setFormError] = useState("");

    const { login, loading, error, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Determine return destination
    const target = (location.state as { from?: { pathname?: string } })?.from?.pathname || "/dashboard";

    // If already authenticated, redirect immediately
    useEffect(() => {
        if (isAuthenticated) {
            navigate(target, { replace: true });
        }
    }, [isAuthenticated, navigate, target]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");

        if (!email.trim()) {
            setFormError("Please enter your email address.");
            return;
        }

        if (!password) {
            setFormError("Please enter your password.");
            return;
        }

        const result = await login({ emailOrCarrierId: email.trim(), password });
        if (result.success) {
            navigate(target, { replace: true });
        }
    };

    const displayError = formError || error;

    return (
        <div className="flex flex-col h-screen justify-center bg-light">
            <div className="fixed top-0 p-6">
                <img src={logo} alt="Taapmaan Logo" width="90px" />
            </div>
            <div className="flex flex-col justify-center items-center px-4">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-2">Welcome back</h1>
                        <p className="text-sm sm:text-base text-zinc-500">
                            Welcome back! Please enter your details
                        </p>
                    </div>

                    {displayError && (
                        <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                            <span className="font-semibold text-base">⚠️</span>
                            <span>{displayError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                name="email"
                                placeholder="name@company.com"
                                autoComplete="email"
                                disabled={loading}
                                className="w-full border border-zinc-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all disabled:bg-zinc-100"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                name="password"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                disabled={loading}
                                className="w-full border border-zinc-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all disabled:bg-zinc-100"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 bg-primary hover:bg-primary/90 active:scale-[0.99] text-white py-3 px-4 font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                "Log in"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-zinc-600">
                            Don't have an account?{" "}
                            <span className="text-primary font-semibold hover:underline cursor-pointer">
                                Sign up
                            </span>
                        </p>
                    </div>
                </div>
                <div>
                    <Link to="/create-vendor" className="w-full mt-2 bg-gray-400/50 hover:bg-secondary/90 active:scale-[0.99] text-white py-3 px-4 font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                        Create vendor account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
