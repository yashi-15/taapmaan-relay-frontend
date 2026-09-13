import { Link } from "react-router-dom";
import BarChartGraph from "../elements/graphs/BarChartGraph";

const Dashboard = () => {

    // ---- DUMMY DATA (replace with API calls once backend is ready) ----
    const vehicleCosts = {
        total: 458920.75,
        fuel: 210500.00,
        maintenance: 128420.75,
        tolls: 60000.00,
        other: 60000.00,
    };

    // TODO: fetch from vehicles schema — count of vehicles with status === "idle"
    const idleTrucksCount = 7;

    const recentlyCompletedTrips = [
        { id: "TRP-2201", route: "Delhi → Jaipur", vehicle: "DL 1AB 2345", completedOn: "28 Aug 2026" },
        { id: "TRP-2198", route: "Mumbai → Pune", vehicle: "MH 12 XY 7890", completedOn: "27 Aug 2026" },
        { id: "TRP-2190", route: "Chennai → Bengaluru", vehicle: "TN 09 KL 4567", completedOn: "26 Aug 2026" },
    ];

    const recentlyAssignedTrips = [
        { id: "TRP-2215", route: "Delhi → Chandigarh", vehicle: "DL 3CD 6789", assignedOn: "01 Sep 2026" },
        { id: "TRP-2213", route: "Hyderabad → Vizag", vehicle: "TS 08 GH 1122", assignedOn: "31 Aug 2026" },
        { id: "TRP-2210", route: "Kolkata → Bhubaneswar", vehicle: "WB 06 MN 3344", assignedOn: "30 Aug 2026" },
    ];
    // ---------------------------------------------------------------

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

            {/* --- NEW: Recently Completed & Recently Assigned trips --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-3">

<div className="rounded-md bg-white shadow-md">
                    <div className="p-3 lg:p-4 flex justify-between">
                        <h2 className="text-xs md:text-sm lg:text-base font-semibold">Recently Assigned Trips</h2>
                        <Link to={"/dashboard/trips?status=assigned"} className="flex items-center gap-2 bg-accent rounded-sm px-2 py-1 text-[9px] md:text-xs hover:bg-primary/15 hover:text-primary font-medium">
                            See All {" "}
                        </Link>
                    </div>
                    <div className="p-3 lg:p-4 flex flex-col gap-2">
                        {recentlyAssignedTrips.map((trip) => (
                            <div key={trip.id} className="flex justify-between items-center p-3 bg-light-secondary/25 rounded-sm">
                                <div>
                                    <p className="text-xs md:text-sm font-semibold">{trip.route}</p>
                                    <p className="text-[10px] md:text-xs text-gray-600">{trip.id} · {trip.vehicle}</p>
                                </div>
                                <p className="text-[10px] md:text-xs text-gray-600 whitespace-nowrap">{trip.assignedOn}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-md bg-white shadow-md">
                    <div className="p-3 lg:p-4 flex justify-between">
                        <h2 className="text-xs md:text-sm lg:text-base font-semibold">Recently Completed Trips</h2>
                        <Link to={"/dashboard/trips?status=completed"} className="flex items-center gap-2 bg-accent rounded-sm px-2 py-1 text-[9px] md:text-xs hover:bg-primary/15 hover:text-primary font-medium">
                            See All {" "}
                        </Link>
                    </div>
                    <div className="p-3 lg:p-4 flex flex-col gap-2">
                        {recentlyCompletedTrips.map((trip) => (
                            <div key={trip.id} className="flex justify-between items-center p-3 bg-light-primary/25 rounded-sm">
                                <div>
                                    <p className="text-xs md:text-sm font-semibold">{trip.route}</p>
                                    <p className="text-[10px] md:text-xs text-gray-600">{trip.id} · {trip.vehicle}</p>
                                </div>
                                <p className="text-[10px] md:text-xs text-gray-600 whitespace-nowrap">{trip.completedOn}</p>
                            </div>
                        ))}
                    </div>
                </div>

                
            </div>

            {/* --- NEW: Vehicles overview + Idle truck posting --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-3">
                <div className="rounded-md bg-white shadow-md">
                    <div className="p-3 lg:p-4 flex justify-between items-center">
                        <div>
                            <h2 className="text-xs md:text-sm lg:text-base font-semibold">Vehicles</h2>
                            <p className="text-xs">TOTAL COST (ALL VEHICLES)</p>
                        </div>
                        <Link to={"/dashboard/vehicles"} className="flex items-center gap-2 bg-accent rounded-sm px-2 py-1 text-[9px] md:text-xs hover:bg-primary/15 hover:text-primary font-medium">
                            View All Vehicles {" "}
                        </Link>
                    </div>
                    <div className="p-3 lg:p-4 flex flex-col gap-6">
                        <div>
                            <h3 className="text-2xl text-secondary font-semibold">
                                ₹{vehicleCosts.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </h3>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="p-2 bg-light-primary/25 rounded-sm">
                                <p className="text-[10px] md:text-xs text-gray-600">FUEL</p>
                                <p className="font-bold text-xs md:text-sm">₹{vehicleCosts.fuel.toLocaleString("en-IN")}</p>
                            </div>
                            <div className="p-2 bg-light-primary/25 rounded-sm">
                                <p className="text-[10px] md:text-xs text-gray-600">MAINTENANCE</p>
                                <p className="font-bold text-xs md:text-sm">₹{vehicleCosts.maintenance.toLocaleString("en-IN")}</p>
                            </div>
                            <div className="p-2 bg-light-primary/25 rounded-sm">
                                <p className="text-[10px] md:text-xs text-gray-600">TOLLS &amp; OTHER</p>
                                <p className="font-bold text-xs md:text-sm">₹{(vehicleCosts.tolls + vehicleCosts.other).toLocaleString("en-IN")}</p>
                            </div>
                        </div>
                    </div>
                </div>

                                <div className="rounded-md bg-white shadow-md">
                    <div className="p-3 lg:p-4 flex justify-between items-center">
                        <div>
                            <h2 className="text-xs md:text-sm lg:text-base font-semibold">Idle Trucks</h2>
                            <p className="text-xs">FROM YOUR FLEET</p>
                        </div>
                    </div>
                    <div className="p-3 lg:p-4 flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-2xl text-secondary font-semibold">{idleTrucksCount}</h3>
                            <p className="text-xs md:text-sm text-gray-600">
                                {idleTrucksCount === 1
                                    ? "truck is currently idle."
                                    : "trucks are currently idle."}
                            </p>
                        </div>

                        {idleTrucksCount > 0 ? (
                            <div className="p-3 bg-light-primary/25 rounded-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <p className="text-xs md:text-sm">
                                    Want to post {idleTrucksCount === 1 ? "it" : "them"} to the load board so shippers can book faster?
                                </p>
                                <Link
                                    to={"/dashboard/load-board/post-idle-truck"}
                                    className="flex items-center justify-center gap-2 bg-primary text-white rounded-sm px-3 py-2 text-xs md:text-sm font-medium hover:bg-primary/90 whitespace-nowrap"
                                >
                                    + Post Idle Trucks
                                </Link>
                            </div>
                        ) : (
                            <p className="text-xs md:text-sm text-gray-500">No idle trucks right now — your fleet is fully utilized.</p>
                        )}
                    </div>
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
                    <div className="p-3 lg:p-4 flex flex-col gap-10">
                        <div>
                            <h2 className="text-xs md:text-sm lg:text-base">Overall Score</h2>
                            <p className="text-2xl text-secondary">23.7%</p>
                        </div>
                        <div>
                            <div className="mt-1 p-3 bg-light-primary/25">On Time <span className="font-bold">79.4%</span></div>
                            <div className="mt-1 p-3 bg-light-primary/25">Tech Usage <span className="font-bold">79.4%</span></div>
                            <div className="mt-1 p-3 bg-light-primary/25">Disruption Free <span className="font-bold">79.4%</span></div>
                        </div>
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
                    <div className="p-3 lg:p-4 grid grid-cols-2 gap-10 justify-center items-center">
                        <div>
                            <h4 className="font-bold text-center">₹12,718,763.58</h4>
                            <p className="text-center text-sm">YTD (GROSS)</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-center">₹0.00</h4>
                            <p className="text-center text-sm">NET BALANCE</p>
                        </div>
                        <div className="col-span-2">
                            <BarChartGraph />
                        </div>
                    </div>
                </div>
            </div>

            

            
        </div>
    )
}

export default Dashboard