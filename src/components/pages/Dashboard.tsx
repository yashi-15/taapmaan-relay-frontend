import { Link } from "react-router-dom";

const Dashboard = () => {
    
    return (
        <div className="py-1 sm:py-3">
            <div className="hidden md:block border-none">
                <input type="text" placeholder="Search..." className="p-2 text-sm focus:outline-1 focus:outline-accent rounded-md w-full border border-primary" />
            </div>
            <div className="pt-3 lg:pt-6 flex justify-between">
                <h2 className="text-xs md:text-sm lg:text-base font-semibold">Trips needing attention</h2>
                <Link to={"/dashboard/transactions"} className="flex items-center gap-2 bg-accent rounded-sm px-2 py-1 text-[9px] md:text-xs hover:bg-primary/15 hover:text-primary font-medium">
                    View In-transit trips {" "}
                </Link>
            </div>
            <div className="grid grid-cols-3 gap-3 my-3">
                <div className="bg-white p-3 rounded-md shadow-md gap-3">
                    <h2 className="text-[8px] sm:text-xs md:text-sm lg:text-base text-gray-600 ">UPCOMING</h2>
                    <h3 className="text-[10px] sm:text-sm md:text-lg lg:text-2xl xl:text-3xl font-semibold">100</h3>
                    <button className="mt-5 px-3 py-1 border border-primary rounded-sm text-primary hover:bg-primary hover:text-white shadow-lg">View</button>
                </div>
                <div className="bg-white p-3 rounded-md shadow-md gap-3">
                    <h2 className="text-[8px] sm:text-xs md:text-sm lg:text-base text-gray-600 ">IN TRANSIT</h2>
                    <h3 className="text-[10px] sm:text-sm md:text-lg lg:text-2xl xl:text-3xl font-semibold">100</h3>
                    <button className="mt-5 px-3 py-1 border border-primary rounded-sm text-primary hover:bg-primary hover:text-white shadow-lg">View</button>
                </div>
                <div className="bg-white p-3 rounded-md shadow-md gap-3">
                    <h2 className="text-[8px] sm:text-xs md:text-sm lg:text-base text-gray-600 ">HISTORY</h2>
                    <h3 className="text-[10px] sm:text-sm md:text-lg lg:text-2xl xl:text-3xl font-semibold">100</h3>
                    <button className="mt-5 px-3 py-1 border border-primary rounded-sm text-primary hover:bg-primary hover:text-white shadow-lg">View</button>

                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-3">
                <div className="rounded-md bg-white shadow-md">
                    <div className="p-3 lg:p-4 flex justify-between">
                        <div>
                            <h2 className="text-xs md:text-sm lg:text-base font-semibold">Overall Performance</h2>
                            <p className="text-xs">LAST 6 ACTIVE WEEKS</p>
                        </div>
                        <Link to={"/dashboard/transactions"} className="flex items-center gap-2 bg-accent rounded-sm px-2 py-1 text-[9px] md:text-xs hover:bg-primary/15 hover:text-primary font-medium">
                            See All {" "}
                        </Link>
                    </div>
                    <div className="p-3 lg:p-4">
                        <div>
                            <h2 className="text-xs md:text-sm lg:text-base">Overall Score</h2>
                            <p className="text-2xl text-secondary">23.7%</p>
                        </div>
                        <div className="mt-1 p-3 bg-light-primary/25">On Time <span className="font-bold">79.4%</span></div>
                        <div className="mt-1 p-3 bg-light-primary/25">Tech Usage <span className="font-bold">79.4%</span></div>
                        <div className="mt-1 p-3 bg-light-primary/25">Disruption Free <span className="font-bold">79.4%</span></div>
                    </div>
                </div>
                <div className="rounded-md bg-white shadow-md">
                    <div className="p-3 lg:p-4 flex justify-between">
                        <div>
                            <h2 className="text-xs md:text-sm lg:text-base font-semibold">Payments</h2>
                        </div>
                        <Link to={"/dashboard/transactions"} className="flex items-center gap-2 bg-accent rounded-sm px-2 py-1 text-[9px] md:text-xs hover:bg-primary/15 hover:text-primary font-medium">
                            See All {" "}
                        </Link>
                    </div>
                    <div className="p-3 lg:p-4 grid grid-cols-2 justify-center items-center">
                        <div>
                            <h4 className="font-bold text-center">₹12,718,763.58</h4>
                            <p className="text-center text-sm">YTD (GROSS)</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-center">₹0.00</h4>
                            <p className="text-center text-sm">NET BALANCE</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
