import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { trips, drivers, vehicles } from "../../utils/tripslistMock";
import type { Trip, TripStatus, InstructionType } from "../../utils/tripslistMock";
import {
    getTripPayment,
    getTripAssignment,
    getPrimaryContact,
    getTripTracking,
    getTripClosureSummary,
    getTripCosts,
    TRIP_COST_CATEGORIES,
    type TripCostCategory,
    type TripCostEntry,
} from "../../utils/tripMock";

const STATUS_TONE: Record<TripStatus, string> = {
    Pending: "bg-amber-50 text-amber-700",
    "In Transit": "bg-indigo-50 text-indigo-700",
    Completed: "bg-emerald-50 text-emerald-700",
};

function TripStatusPill({ status }: { status: TripStatus }) {
    return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_TONE[status]}`}>{status}</span>;
}

const INSTRUCTION_LABEL: Record<InstructionType, string> = {
    pickup: "Pickup",
    dropoff: "Drop",
    "pickup-dropoff": "Pickup & Drop",
};

const INSTRUCTION_TONE: Record<InstructionType, string> = {
    pickup: "bg-indigo-50 text-indigo-700",
    dropoff: "bg-emerald-50 text-emerald-700",
    "pickup-dropoff": "bg-amber-50 text-amber-700",
};

function formatINR(amount: number) {
    return `₹${amount.toLocaleString("en-IN")}`;
}

function formatDateTime(iso: string) {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso; // mock strings like "11 Jul, 22:00" aren't real ISO dates
    return d.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
            {subtitle && <p className="text-xs text-zinc-500 mt-0.5 mb-4">{subtitle}</p>}
            {!subtitle && <div className="mb-4" />}
            {children}
        </div>
    );
}

type TabKey = "overview" | "second" | "costs";

const TripDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();

    // No dedicated GET /trips/:id yet — fall back to the mock list / whatever
    // was passed via router state. Swap for a direct fetch once that exists.
    const trip: Trip | undefined =
        (location.state as { trip?: Trip } | null)?.trip ?? trips.find((t) => t.id === id);

    const [activeTab, setActiveTab] = useState<TabKey>("overview");
    const [selectedDriverId, setSelectedDriverId] = useState("");
    const [selectedVehicleId, setSelectedVehicleId] = useState("");
    const [accepted, setAccepted] = useState(false);

    if (!trip) {
        return (
            <div className="py-1 sm:py-3 flex flex-col gap-4">
                <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-sm text-red-700">
                    Trip not found.
                </div>
                <button
                    type="button"
                    onClick={() => navigate("/dashboard/trips")}
                    className="self-start text-sm font-semibold text-primary hover:underline"
                >
                    ← Back to trips
                </button>
            </div>
        );
    }

    const payment = getTripPayment(trip);
    const assignment = getTripAssignment(trip);
    const contact = getPrimaryContact(trip);

    const secondTabLabel =
        trip.status === "Pending" ? "Accept trip" : trip.status === "In Transit" ? "Tracking" : "Trip summary";

    const TABS: { key: TabKey; label: string }[] = [
        { key: "overview", label: "Overview" },
        { key: "second", label: secondTabLabel },
        { key: "costs", label: "Cost overview" },
    ];

    return (
        <div className="py-1 sm:py-3 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard/trips")}
                        className="text-xs font-semibold text-zinc-500 hover:text-zinc-700 mb-1"
                    >
                        ← Back to trips
                    </button>
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold text-zinc-900">{trip.contractCode}</h2>
                        <TripStatusPill status={trip.status} />
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">
                        {trip.origin} → {trip.destination} · {trip.equipment}
                    </p>
                </div>
            </div>

            <div className="flex gap-1 border-b border-slate-200 overflow-x-auto no-scrollbar">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`shrink-0 whitespace-nowrap px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                            activeTab === tab.key
                                ? "border-primary text-primary"
                                : "border-transparent text-zinc-500 hover:text-zinc-700"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === "overview" && (
                <div className="flex flex-col gap-4">
                    <SectionCard title="Route & stops">
                        <div className="flex flex-col divide-y divide-slate-100">
                            {trip.stops.map((stop, i) => (
                                <div key={stop.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-slate-100 text-xs font-semibold text-zinc-600 flex items-center justify-center">
                                            {i + 1}
                                        </span>
                                        <div>
                                            <p className="text-sm font-medium text-zinc-800">
                                                {stop.code} · {stop.company}
                                            </p>
                                            <p className="text-xs text-zinc-500">{stop.address}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`text-xs px-1.5 py-0.5 rounded ${INSTRUCTION_TONE[stop.instructionType]}`}>
                                            {INSTRUCTION_LABEL[stop.instructionType]}
                                        </span>
                                        <span className="text-xs text-zinc-400">
                                            {stop.arrival} → {stop.departure}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionCard>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SectionCard title="Contact person">
                            <div className="text-sm">
                                <p className="font-medium text-zinc-800">{contact.name}</p>
                                <p className="text-xs text-zinc-500 mt-0.5">{contact.phone}</p>
                            </div>
                        </SectionCard>

                        <SectionCard title="Driver & vehicle">
                            {assignment ? (
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-xs text-zinc-500">Driver</p>
                                        <p className="font-medium text-zinc-800">{assignment.driver.name}</p>
                                        <p className="text-xs text-zinc-500">{assignment.driver.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-500">Vehicle</p>
                                        <p className="font-medium text-zinc-800">{assignment.vehicle.plateNumber}</p>
                                        <p className="text-xs text-zinc-500">{assignment.vehicle.type}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-zinc-400">Not yet assigned — accept the trip to assign a driver and vehicle.</p>
                            )}
                        </SectionCard>
                    </div>

                    <SectionCard title="Quote & payment" subtitle="Paid out on completion of this trip.">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <p className="text-xs text-zinc-500">Fixed component</p>
                                <p className="font-semibold text-zinc-900">{formatINR(payment.fixed)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500">
                                    Variable ({trip.pricePerKm}/km × {trip.totalDistance}km)
                                </p>
                                <p className="font-semibold text-zinc-900">{formatINR(payment.variable)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500">Total payout</p>
                                <p className="font-semibold text-zinc-900">{formatINR(payment.total)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500">Status</p>
                                <TripStatusPill status={trip.status} />
                            </div>
                        </div>
                    </SectionCard>
                </div>
            )}

            {activeTab === "second" && (
                <div className="flex flex-col gap-4">
                    {trip.status === "Pending" && (
                        <SectionCard title="Accept this trip" subtitle="Select a driver and a vehicle to assign.">
                            {accepted ? (
                                <div className="p-3 rounded-lg bg-emerald-50 text-sm text-emerald-700">
                                    Trip accepted and assigned. It will move to In Transit once it starts.
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-zinc-500">Driver</label>
                                            <select
                                                value={selectedDriverId}
                                                onChange={(e) => setSelectedDriverId(e.target.value)}
                                                className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                                            >
                                                <option value="">Select a driver</option>
                                                {drivers
                                                    .filter((d) => d.status === "Available")
                                                    .map((d) => (
                                                        <option key={d.id} value={d.id}>
                                                            {d.name} · {d.rating}★ · {d.tripsCompleted} trips
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-zinc-500">Vehicle</label>
                                            <select
                                                value={selectedVehicleId}
                                                onChange={(e) => setSelectedVehicleId(e.target.value)}
                                                className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                                            >
                                                <option value="">Select a vehicle</option>
                                                {vehicles
                                                    .filter((v) => v.status === "Available")
                                                    .map((v) => (
                                                        <option key={v.id} value={v.id}>
                                                            {v.plateNumber} · {v.type}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        disabled={!selectedDriverId || !selectedVehicleId}
                                        onClick={() => setAccepted(true)}
                                        className="self-start px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary disabled:bg-slate-300"
                                    >
                                        Accept trip
                                    </button>
                                </div>
                            )}
                        </SectionCard>
                    )}

                    {trip.status === "In Transit" && <TrackingSection trip={trip} />}
                    {trip.status === "Completed" && <ClosedTripSection trip={trip} />}
                </div>
            )}

            {activeTab === "costs" && <TripCostOverview trip={trip} />}
        </div>
    );
};

function TrackingSection({ trip }: { trip: Trip }) {
    const tracking = useMemo(() => getTripTracking(trip), [trip]);
    return (
        <>
            <SectionCard title="Trip timing & distance">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <p className="text-xs text-zinc-500">Start time</p>
                        <p className="font-medium text-zinc-800">{trip.startTime}</p>
                    </div>
                    <div>
                        <p className="text-xs text-zinc-500">Expected end</p>
                        <p className="font-medium text-zinc-800">{trip.endTime}</p>
                    </div>
                    <div>
                        <p className="text-xs text-zinc-500">Meter reading</p>
                        <p className="font-medium text-zinc-800">
                            {tracking.meterStart.toLocaleString("en-IN")} → {tracking.meterEnd.toLocaleString("en-IN")} km
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-zinc-500">Distance covered</p>
                        <p className="font-medium text-zinc-800">
                            {tracking.distanceCoveredKm} / {trip.totalDistance} km
                        </p>
                    </div>
                    {tracking.temperatureC !== null && (
                        <div>
                            <p className="text-xs text-zinc-500">Cargo temperature</p>
                            <p className="font-medium text-zinc-800">{tracking.temperatureC}°C</p>
                        </div>
                    )}
                </div>
            </SectionCard>

            <SectionCard title="Live location" subtitle="Location tracking will connect here once the tracker feed is live.">
                <div className="h-64 rounded-lg border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center gap-2">
                    <p className="text-sm font-medium text-zinc-600">{tracking.currentLocation.label}</p>
                    <p className="text-xs text-zinc-400">
                        {tracking.currentLocation.lat.toFixed(4)}, {tracking.currentLocation.lng.toFixed(4)}
                    </p>
                    <p className="text-xs text-zinc-400">Updated {formatDateTime(tracking.currentLocation.updatedAt)}</p>
                </div>
            </SectionCard>
        </>
    );
}

function ClosedTripSection({ trip }: { trip: Trip }) {
    const summary = useMemo(() => getTripClosureSummary(trip), [trip]);
    return (
        <>
            <SectionCard title="Trip summary">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <p className="text-xs text-zinc-500">Completed at</p>
                        <p className="font-medium text-zinc-800">{summary.completedAt}</p>
                    </div>
                    <div>
                        <p className="text-xs text-zinc-500">Final meter reading</p>
                        <p className="font-medium text-zinc-800">{summary.finalMeter.toLocaleString("en-IN")} km</p>
                    </div>
                    <div>
                        <p className="text-xs text-zinc-500">Total distance</p>
                        <p className="font-medium text-zinc-800">{summary.totalDistanceKm} km</p>
                    </div>
                    <div>
                        <p className="text-xs text-zinc-500">Driver rating given</p>
                        <p className="font-medium text-zinc-800">{summary.driverRatingGiven}★</p>
                    </div>
                </div>
                <p className="text-xs text-zinc-500 mt-4">{summary.notes}</p>
            </SectionCard>

            <SectionCard title="Stop-by-stop record">
                <div className="flex flex-col divide-y divide-slate-100">
                    {trip.stops.map((stop) => (
                        <div key={stop.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                            <span className="text-sm font-medium text-zinc-800">{stop.code}</span>
                            <span className="text-xs text-zinc-500">Reached {stop.arrival}</span>
                        </div>
                    ))}
                </div>
            </SectionCard>
        </>
    );
}

const TRIP_CATEGORY_TONE: Record<TripCostCategory, string> = {
    Fuel: "bg-amber-50 text-amber-700",
    Toll: "bg-indigo-50 text-indigo-700",
    "Loading/Unloading": "bg-slate-100 text-zinc-700",
    Detention: "bg-red-50 text-red-700",
    Other: "bg-emerald-50 text-emerald-700",
};

const TRIP_CATEGORY_BAR: Record<TripCostCategory, string> = {
    Fuel: "bg-amber-400",
    Toll: "bg-indigo-400",
    "Loading/Unloading": "bg-zinc-400",
    Detention: "bg-red-400",
    Other: "bg-emerald-400",
};

function TripCostOverview({ trip }: { trip: Trip }) {
    const costs: TripCostEntry[] = useMemo(() => getTripCosts(trip), [trip]);
    const total = costs.reduce((sum, c) => sum + c.amount, 0);
    const byCategory = TRIP_COST_CATEGORIES.map((cat) => ({
        category: cat,
        amount: costs.filter((c) => c.category === cat).reduce((s, c) => s + c.amount, 0),
    })).filter((c) => c.amount > 0);
    const maxCategory = Math.max(...byCategory.map((c) => c.amount), 1);

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <p className="text-xs text-zinc-500">Total spend</p>
                    <p className="text-lg font-semibold text-zinc-900 mt-1">{formatINR(total)}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">This trip</p>
                </div>
                {byCategory.map(({ category, amount }) => (
                    <div key={category} className="bg-white p-4 rounded-xl border border-slate-200">
                        <p className={`text-xs inline-flex px-1.5 py-0.5 rounded ${TRIP_CATEGORY_TONE[category]}`}>{category}</p>
                        <p className="text-lg font-semibold text-zinc-900 mt-1">{formatINR(amount)}</p>
                    </div>
                ))}
            </div>

            <SectionCard title="Cost breakdown by category">
                <div className="flex flex-col gap-3">
                    {byCategory.map(({ category, amount }) => (
                        <div key={category} className="flex items-center gap-3">
                            <span className="w-32 text-xs font-semibold text-zinc-600">{category}</span>
                            <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${TRIP_CATEGORY_BAR[category]}`}
                                    style={{ width: `${(amount / maxCategory) * 100}%` }}
                                />
                            </div>
                            <span className="w-20 text-right text-xs font-medium text-zinc-700">{formatINR(amount)}</span>
                        </div>
                    ))}
                </div>
            </SectionCard>

            <SectionCard title="Transactions" subtitle="Extracted from cost photos uploaded by the driver.">
                <div className="flex flex-col divide-y divide-slate-100">
                    {costs.map((c) => (
                        <div key={c.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                            <div className="flex items-center gap-3">
                                <span className={`text-xs px-1.5 py-0.5 rounded ${TRIP_CATEGORY_TONE[c.category]}`}>{c.category}</span>
                                <div>
                                    <p className="text-sm font-medium text-zinc-800">{c.note}</p>
                                    <p className="text-xs text-zinc-400">
                                        {c.date} · {c.source === "photo-app" ? "Uploaded via app" : "Shared on WhatsApp"}
                                    </p>
                                </div>
                            </div>
                            <span className="text-sm font-semibold text-zinc-800">{formatINR(c.amount)}</span>
                        </div>
                    ))}
                </div>
            </SectionCard>
        </div>
    );
}

export default TripDetails;