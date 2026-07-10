import { useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import TripBar from '../elements/TripBar'

const Trips = () => {

    const [tab, setTab] = useState("upcoming")

    return (
        <div className="py-1 sm:py-3 flex flex-col gap-4">
                    <div className="flex justify-end items-center gap-1"><CiSearch className="text-3xl" /><span>Advanced Search</span></div>
                    
                    <div className="flex gap-5">
                        <button onClick={() => setTab("upcoming")} className={`w-32 pb-2 ${tab === "upcoming" ? 'border-b-4 border-primary' : 'border-b-0'}`}>Upcoming</button>
                        <button onClick={() => setTab("in-transit")} className={`w-32 pb-2 ${tab === "in-transit" ? 'border-b-4 border-primary' : 'border-b-0'}`}>In-Transit</button>
                        <button onClick={() => setTab("history")} className={`w-32 pb-2 ${tab === "history" ? 'border-b-4 border-primary' : 'border-b-0'}`}>History</button>
                    </div>
        
        
                    {/* UPCOMING  */}
                    {tab === "upcoming" && 
                    <TripBar />
                    }
        
                    {/* IN-TRANSIT  */}
                    {tab === "in-transit" && 
                    <TripBar />
                    }

                    {/* HISTORY  */}
                    {tab === "history" && 
                    <TripBar />
                    }
                </div>
    )
}

export default Trips
