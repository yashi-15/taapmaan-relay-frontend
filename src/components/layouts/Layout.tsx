import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth } from "../../context/user/AuthContext";

const Layout: React.FC = () => {
    const { user, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const navigate = useNavigate();

    const role = (user?.role === "admin" ? "admin" : "vendor") as "admin" | "vendor";

    const navigation = {
        vendor: [
            { slug: "/dashboard", name: "Dashboard" },
            { slug: "/dashboard/notifications", name: "Notifications" },
            { slug: "/dashboard/trips", name: "Trips" },
            { slug: "/dashboard/load-board", name: "Load Board" },
            { slug: "/dashboard/scorecard", name: "Scorecard" },
            { slug: "/dashboard/vehicles", name: "Vehicles" },
            { slug: "/dashboard/drivers", name: "Drivers" },
            { slug: "/dashboard/payments", name: "Payments" },
            { slug: "/dashboard/carrier-account", name: "Carrier Account" },
        ],
        admin: [
            { slug: "/dashboard", name: "Dashboard" },
            { slug: "/dashboard/notifications", name: "Notifications" },
            { slug: "/dashboard/trips", name: "Trips" },
            { slug: "/dashboard/vendors", name: "Vendors" },
            { slug: "/dashboard/payments", name: "Payments" },
        ],
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            navigate("/login");
        }
    };

    const displayName = user?.name || user?.companyName || "Vendor User";
    const displayEmail = user?.email || "user@taapmaan.in";
    const initials = displayName.substring(0, 2).toUpperCase();

    return (
        <div className="flex h-screen bg-light">
            <aside className="w-16 sm:w-20 md:w-56 lg:w-64 bg-white border-r border-slate-100 p-2 md:p-4 flex flex-col justify-between shadow-sm">
                <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-center md:justify-start px-2 pt-2">
                        <img src={logo} alt="Taapmaan Logo" width="90px" />
                    </div>
                    <div className="hidden md:block">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-lg w-full border border-slate-200"
                        />
                    </div>

                    <nav className="flex flex-col gap-1 w-full overflow-y-auto">
                        {navigation[role].map((nav, index) => (
                            <NavLink
                                key={index}
                                to={nav.slug}
                                end
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-2 sm:px-3 sm:py-2.5 rounded-xl font-medium text-sm transition-colors ${
                                        isActive
                                            ? "bg-primary/10 text-primary font-semibold"
                                            : "text-zinc-600 hover:bg-slate-50 hover:text-zinc-900"
                                    }`
                                }
                            >
                                <span className="truncate">{nav.name}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* User Profile & Menu */}
                <div className="border-t border-slate-100 pt-3 relative">
                    <div
                        onClick={() => setShowProfileMenu((prev) => !prev)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm shrink-0">
                            {initials}
                        </div>
                        <div className="hidden md:block overflow-hidden">
                            <h3 className="text-sm font-semibold text-zinc-900 truncate">
                                {displayName}
                            </h3>
                            <p className="text-xs text-zinc-500 truncate">{displayEmail}</p>
                        </div>
                    </div>

                    {showProfileMenu && (
                        <div className="absolute bottom-16 left-2 right-2 md:right-auto md:w-56 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50">
                            <div className="px-3 py-2 border-b border-slate-100">
                                <p className="text-xs font-semibold text-zinc-900 truncate">{displayName}</p>
                                <p className="text-[11px] text-zinc-500 truncate">{displayEmail}</p>
                            </div>
                            <NavLink
                                to="/dashboard/carrier-account"
                                onClick={() => setShowProfileMenu(false)}
                                className="block px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                Account Settings
                            </NavLink>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
