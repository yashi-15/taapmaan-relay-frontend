import { useState } from "react"
import { Link } from "react-router-dom"
import { CiSettings } from "react-icons/ci";
import { IoIosRefresh } from "react-icons/io";
import { FaRegCirclePause } from "react-icons/fa6";

const Notifications = () => {
    const [tab, setTab] = useState("tasks")


    const tasksData = [
        {
            "description": "Document access request for 113GK1BSC",
            "severity": "Critical",
            "category": "Document Access Request",
            "received": "Nov 06 25 02:49 IST",
            "due": "Escalated",
            "action": "Resolve"
        },
        {
            "description": "Late Truck for 1158L9QQN",
            "severity": "Critical",
            "category": "Late Truck",
            "received": "Jun 24 26 05:05 IST",
            "due": "Escalated",
            "action": "Resolve"
        },
        {
            "description": "Late Truck for 1157P1TG3",
            "severity": "Critical",
            "category": "Late Truck",
            "received": "Jun 24 26 05:01 IST",
            "due": "Escalated",
            "action": "Resolve"
        },
        {
            "description": "Late Truck for 111TL362B",
            "severity": "Critical",
            "category": "Late Truck",
            "received": "Jun 24 26 05:15 IST",
            "due": "Escalated",
            "action": "Resolve"
        },
        {
            "description": "Late Truck for 111KX553J",
            "severity": "Critical",
            "category": "Late Truck",
            "received": "Jun 24 26 09:30 IST",
            "due": "Escalated",
            "action": "Resolve"
        },
        {
            "description": "Late Truck for 113SVC76W",
            "severity": "Critical",
            "category": "Late Truck",
            "received": "Jun 24 26 13:30 IST",
            "due": "Escalated",
            "action": "Resolve"
        },
        {
            "description": "Late Truck for 115HCPCDC",
            "severity": "Critical",
            "category": "Late Truck",
            "received": "Jun 24 26 14:00 IST",
            "due": "Escalated",
            "action": "Resolve"
        },
        {
            "description": "Late Truck for 116J7KYG3",
            "severity": "Critical",
            "category": "Late Truck",
            "received": "Jun 24 26 14:30 IST",
            "due": "Escalated",
            "action": "Resolve"
        },
        {
            "description": "Late Truck for 115MNXBS8",
            "severity": "Critical",
            "category": "Late Truck",
            "received": "Jun 24 26 16:45 IST",
            "due": "Escalated",
            "action": "Resolve"
        },
        {
            "description": "Late Truck for 112PJSVCG",
            "severity": "Critical",
            "category": "Late Truck",
            "received": "Jun 24 26 20:30 IST",
            "due": "Escalated",
            "action": "Resolve"
        },
        {
            "description": "Late Truck for 112FXGY2K",
            "severity": "Critical",
            "category": "Late Truck",
            "received": "Jun 25 26 05:00 IST",
            "due": "Escalated",
            "action": "Resolve"
        },
        {
            "description": "Late Truck for 112ZY1D7D",
            "severity": "Critical",
            "category": "Late Truck",
            "received": "Jun 25 26 05:05 IST",
            "due": "Escalated",
            "action": "Resolve"
        }
    ]

    const notificationsData = [
        {
            "description": "Critical Update: Government mandated fuel increase, effective from 15th May'26 onwards.",
            "severity": "High",
            "category": "Payments",
            "received": "May 30 26 00:52 IST",
            "action": "View"
        },
        {
            "description": "Critical GST Update for GTA: Window open for any change from FCM to RCM or vice versa for FY26-27.",
            "severity": "High",
            "category": "Payments",
            "received": "Feb 25 26 21:57 IST",
            "action": "View"
        },
        {
            "description": "Exciting News: NET7 Pay-Term for RLB Invoices!",
            "severity": "High",
            "category": "Payments",
            "received": "Jan 28 26 01:37 IST",
            "action": "View"
        },
        {
            "description": "Exciting News: NET7 Pay-Term for RLB Invoices!",
            "severity": "High",
            "category": "Payments",
            "received": "Oct 03 25 00:17 IST",
            "action": "View"
        },
        {
            "description": "Attention required: BVA1 truck flow change",
            "severity": "High",
            "category": "Safety Policy Compliance",
            "received": "Sep 15 25 15:13 IST",
            "action": "View"
        },
        {
            "description": "FY24-25 Pending GST Reconciliation",
            "severity": "High",
            "category": "Payments",
            "received": "Sep 14 25 23:11 IST",
            "action": "View"
        },
        {
            "description": "Critical GST Update: 12% slab will be discontinued from Sept 22",
            "severity": "Critical",
            "category": "Payments",
            "received": "Sep 14 25 23:11 IST",
            "action": "View"
        },
        {
            "description": "Yard Zone Management (YZM) Launch - BRE2, ORY4 & IST2",
            "severity": "High",
            "category": "Safety Policy Compliance",
            "received": "Aug 06 25 12:53 IST",
            "action": "View"
        },
        {
            "description": "Exciting News: NET7 Pay-Term for RLB Invoices!",
            "severity": "High",
            "category": "Payments",
            "received": "Aug 06 25 12:49 IST",
            "action": "View"
        },
        {
            "description": "Exciting News: NET7 Pay-Term for RLB Invoices!",
            "severity": "High",
            "category": "Payments",
            "received": "Jul 25 25 14:30 IST",
            "action": "View"
        }
    ]

    return (
        <div className="py-1 sm:py-3 flex flex-col gap-4">
            <div className="flex justify-end items-center gap-1"><CiSettings className="text-3xl" /><span>Notification settings</span></div>
            <div className="flex justify-end items-center gap-2">
                <div className="flex gap-2"><span>Next Refresh 4m 35s</span> <FaRegCirclePause className="text-2xl" /></div>
                <div>|</div>
                <div><IoIosRefresh className="text-2xl" /></div>
            </div>
            <div className="flex gap-5">
                <button onClick={() => setTab("tasks")} className={`w-32 pb-2 ${tab === "tasks" ? 'border-b-4 border-primary' : 'border-b-0'}`}>Tasks</button>
                <button onClick={() => setTab("notifications")} className={`w-32 pb-2 ${tab === "notifications" ? 'border-b-4 border-primary' : 'border-b-0'}`}>Notifications</button>
            </div>


            {/* TASKS  */}
            {tab === "tasks" && 
            <div>
                <div className="flex gap-4 bg-[#f3f3f3] p-2">
                    <input type="text" placeholder="Search..." className="p-2 text-sm focus:outline-1 focus:outline-accent rounded-md w-92 border border-primary" />
                    <select className="p-2 text-sm focus:outline-1 focus:outline-accent rounded-md w-32 border border-primary">
                        <option value="all">All</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
                <table className="w-full">
                    <thead className="text-left">
                        <tr>
                            <th className="p-4">Description</th>
                            <th className="p-4">Severity</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Received</th>
                            <th className="p-4">Due</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tasksData.map((item, index) => (
                            <tr key={index} className="border-b-2 border-accent">
                                <td className="p-4">{item.description}</td>
                                <td className="p-4">{item.severity}</td>
                                <td className="p-4">{item.category}</td>
                                <td className="p-4">{item.received}</td>
                                <td className="p-4">{item.due}</td>
                                <td className="p-4"><span className="bg-primary text-center p-2 borde text-white rounded-md">{item.action}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            }

            {/* NOTIFICATIONS  */}
            {tab === "notifications" && 
            
            <div>
                <div className="flex gap-4 bg-[#f3f3f3] p-2">
                    <input type="text" placeholder="Search..." className="p-2 text-sm focus:outline-1 focus:outline-accent rounded-md w-92 border border-primary" />
                    <select className="p-2 text-sm focus:outline-1 focus:outline-accent rounded-md w-32 border border-primary">
                        <option value="all">All</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                    <select className="p-2 text-sm focus:outline-1 focus:outline-accent rounded-md w-32 border border-primary">
                        <option value="all">Contracts</option>
                        <option value="critical">General Notification</option>
                        <option value="high">Learning</option>
                        <option value="medium">Payments</option>
                        <option value="low">Performance</option>
                        <option value="low">Safety</option>
                        <option value="low">Work</option>
                    </select>
                </div>
                <table className="w-full">
                    <thead className="text-left">
                        <tr>
                            <th className="p-4 w-[45%]">Description</th>
                            <th className="p-4">Severity</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Received</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {notificationsData.map((item, index) => (
                            <tr key={index} className="border-b-2 border-accent">
                                <td className="p-4 w-[45%]">{item.description}</td>
                                <td className="p-4">{item.severity}</td>
                                <td className="p-4">{item.category}</td>
                                <td className="p-4">{item.received}</td>
                                <td className="p-4"><span className="bg-primary text-center p-2 borde text-white rounded-md">{item.action}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            }
        </div>
    )
}

export default Notifications
