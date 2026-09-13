import { useMemo, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import TripBar from '../elements/TripBar'
import { trips } from '../../utils/tripsMock'

const Trips = () => {

    const [tab, setTab] = useState("pending")

    // Single source of truth (the dummy dataset exported from TripBar) is
    // filtered by status here, so each tab only ever shows its own trips
    // instead of the full list three times over.
    const pendingTrips = useMemo(() => trips.filter((t) => t.status === "Pending"), [])
    const onGoingTrips = useMemo(() => trips.filter((t) => t.status === "In Transit"), [])
    const closedTrips = useMemo(() => trips.filter((t) => t.status === "Completed"), [])

    const tabs = [
        { key: "pending", label: "Pending", count: pendingTrips.length },
        { key: "on-going", label: "On-Going", count: onGoingTrips.length },
        { key: "closed", label: "Closed", count: closedTrips.length },
    ] as const

    return (
        <div className="py-1 sm:py-3 flex flex-col gap-4">
                    <div className="flex justify-end items-center gap-1"><CiSearch className="text-3xl" /><span>Advanced Search</span></div>

                    <div className="flex gap-5">
                        {tabs.map((t) => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`w-32 pb-2 ${tab === t.key ? 'border-b-4 border-primary' : 'border-b-0'}`}
                            >
                                {t.label} <span className="text-gray-400 text-sm">({t.count})</span>
                            </button>
                        ))}
                    </div>


                    {/* PENDING  */}
                    {tab === "pending" &&
                    <TripBar trips={pendingTrips} />
                    }

                    {/* ON-GOING  */}
                    {tab === "on-going" &&
                    <TripBar trips={onGoingTrips} />
                    }

                    {/* CLOSED  */}
                    {tab === "closed" &&
                    <TripBar trips={closedTrips} />
                    }
                </div>
    )
}

export default Trips