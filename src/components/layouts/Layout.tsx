import { NavLink, Outlet } from "react-router-dom"
import logo from "../../assets/logo.png"
import { useState } from "react"

const Layout = () => {
    const [role, setRole] = useState("vendor")
    const navigation = {
        vendor: [
            { slug: "/dashboard", name: "Dashboard" },
            { slug: "/dashboard/notifications", name: "Notifications" },
            { slug: "/dashboard/trips", name: "Trips" },
            { slug: "/dashboard/load-board", name: "Load Board" },
            { slug: "/dashboard/payments", name: "Payments" },
        ],
        admin: [
            { slug: "/dashboard", name: "Dashboard" },
            { slug: "/dashboard/notifications", name: "Notifications" },
            { slug: "/dashboard/trips", name: "Trips" },
            { slug: "/dashboard/vendors", name: "Vendors" },
            { slug: "/dashboard/payments", name: "Payments" },
        ]
    }
    return (
        <div className="flex h-screen">
            <aside className="w-12 sm:w-16 md:w-44 lg:w-64 bg-white p-2 md:p-4 flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <div className="flex gap-0 items-center justify-center md:justify-start">
                        <img src={logo} width={"90px"} />
                    </div>
                    <div className="hidden md:block">
                        <input type="text" placeholder="Search..." className="p-2 text-sm focus:outline-2 focus:outline-accent rounded-md w-full border-2 border-accent" />
                    </div>
                </div>
                <div className="grow flex flex-col w-full overflow-auto">

                    {role === "admin" && <>
                        {navigation.admin.map((nav, index) => {
                            return (
                                <NavLink key={index} to={nav.slug} end className={({ isActive }) => `flex items-center gap-2 p-1 sm:p-2 m-1 font-semibold rounded-md text-sm lg:text-base ${isActive ? "bg-primary/15 text-primary" : "text-zinc-600"} `}>
                                    <span className="hidden md:block">{nav.name}</span>
                                </NavLink>
                            )
                        })}
                    </>}
                    {role === "vendor" && <>
                        {navigation.vendor.map((nav, index) => {
                            return (
                                <NavLink key={index} to={nav.slug} end className={({ isActive }) => `flex items-center gap-2 p-1 sm:p-2 m-1 font-semibold rounded-md text-sm lg:text-base ${isActive ? "bg-primary/15 text-primary" : "text-zinc-600"} `}>
                                    <span className="hidden md:block">{nav.name}</span>
                                </NavLink>
                            )
                        })}
                    </>}
                </div>
                <div className="border-t-2 border-accent relative">
                    <div className="flex items-center gap-4 md:p-2 w-full md:bg-primary/15 rounded-md mt-4">
                        <div className="bg-primary/15 md:bg-white p-2 rounded-full text-xs md:text-sm lg:text-base cursor-pointer">
                            <h3 className="text-xs xl:text-base">name</h3>
                            <p className="text-[10px] font-light text-gray-700">email</p>
                        </div>
                        <div className="hidden lg:block hover:bg-accent p-1 rounded-full cursor-pointer">
                        </div>
                    </div>
                    <div className="bg-accent absolute bottom-10 -right-12 md:bottom-16 md:right-0 z-40">
                        <div className="text-xs lg:text-sm py-2 px-4 hover:bg-primary/15 cursor-pointer">Settings</div>
                        <div className="text-xs lg:text-sm py-2 px-4 hover:bg-primary/15 cursor-pointer">
                            Logout
                        </div>
                    </div>
                </div>
            </aside>
            <main className="flex-1 overflow-auto p-1 sm:p-4 lg:p-8">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout
