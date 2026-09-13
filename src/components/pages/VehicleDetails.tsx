import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { vehicleAPI } from "../../api/vehicle.api";
import type { VehicleRecord } from "../types/vehiclePayload";
import { DocBadge, StatusBadge, TripStatusBadge } from "../elements/VehicleBadges";
import {
    COST_CATEGORIES,
    daysUntil,
    getMockCosts,
    getMockTrip,
    type CostCategory,
    type MockCostEntry,
} from "../../utils/vehicleMock";

const DOCUMENT_FIELDS: { urlKey: keyof VehicleRecord["documents"]; dateKey: keyof VehicleRecord["documents"]; label: string }[] = [
    { urlKey: "rcUrl", dateKey: "rcExpiryDate", label: "Registration certificate" },
    { urlKey: "insuranceUrl", dateKey: "insuranceExpiryDate", label: "Insurance" },
    { urlKey: "permitUrl", dateKey: "permitExpiryDate", label: "Permit" },
    { urlKey: "puccUrl", dateKey: "puccExpiryDate", label: "PUCC" },
    { urlKey: "fitnessCertificateUrl", dateKey: "fitnessExpiryDate", label: "Fitness certificate" },
];

const CATEGORY_TONE: Record<CostCategory, string> = {
    CNG: "bg-amber-50 text-amber-700",
    Toll: "bg-indigo-50 text-indigo-700",
    Repair: "bg-red-50 text-red-700",
    Tire: "bg-slate-100 text-zinc-700",
    Other: "bg-emerald-50 text-emerald-700",
};

const CATEGORY_BAR: Record<CostCategory, string> = {
    CNG: "bg-amber-400",
    Toll: "bg-indigo-400",
    Repair: "bg-red-400",
    Tire: "bg-zinc-400",
    Other: "bg-emerald-400",
};

function formatINR(amount: number) {
    return `₹${amount.toLocaleString("en-IN")}`;
}

function formatDateTime(iso: string) {
    return new Date(iso).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
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

type TabKey = "overview" | "trip" | "costs";

const TABS: { key: TabKey; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "trip", label: "Trip & location" },
    { key: "costs", label: "Cost summary" },
];

const VehicleDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();

    const [vehicle, setVehicle] = useState<VehicleRecord | null>(
        (location.state as { vehicle?: VehicleRecord } | null)?.vehicle ?? null
    );
    const [loading, setLoading] = useState(!vehicle);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabKey>("overview");
    const [costView, setCostView] = useState<"monthly" | "yearly">("monthly");
    const [selectedMonthKey, setSelectedMonthKey] = useState<string | null>(null);

    useEffect(() => {
        if (vehicle || !id) return;
        // No dedicated GET /vehicles/:id yet — fall back to the list and find
        // the matching record. Swap for a direct fetch once that endpoint exists.
        setLoading(true);
        vehicleAPI
            .list()
            .then((res) => {
                const found = res.data.data.vehicles.find((v: VehicleRecord) => v.id === id);
                if (!found) {
                    setError("Vehicle not found.");
                } else {
                    setVehicle(found);
                }
            })
            .catch((err: any) => {
                setError(err?.response?.data?.message || "Couldn't load this vehicle. Please try again.");
            })
            .finally(() => setLoading(false));
    }, [id, vehicle]);

    if (loading) {
        return (
            <div className="py-1 sm:py-3">
                <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-sm text-zinc-500">
                    Loading vehicle…
                </div>
            </div>
        );
    }

    if (error || !vehicle) {
        return (
            <div className="py-1 sm:py-3 flex flex-col gap-4">
                <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-sm text-red-700">
                    {error || "Vehicle not found."}
                </div>
                <button
                    type="button"
                    onClick={() => navigate("/dashboard/vehicles")}
                    className="self-start text-sm font-semibold text-primary hover:underline"
                >
                    ← Back to vehicles
                </button>
            </div>
        );
    }

    const trip = getMockTrip(vehicle.id, vehicle.hasTemperatureControl);
    const costs = getMockCosts(vehicle.id);

    return (
        <div className="py-1 sm:py-3 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard/vehicles")}
                        className="text-xs font-semibold text-zinc-500 hover:text-zinc-700 mb-1"
                    >
                        ← Back to vehicles
                    </button>
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold text-zinc-900">{vehicle.registrationNumber}</h2>
                        <StatusBadge status={vehicle.status} />
                        <TripStatusBadge vehicleId={vehicle.id} />
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">
                        {vehicle.make} {vehicle.model} · {vehicle.vehicleSize} · {vehicle.capacityTon}T
                        {vehicle.hasTemperatureControl ? " · Temp control" : ""}
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
                    <SectionCard title="Vehicle details">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <p className="text-xs text-zinc-500">Registration</p>
                                <p className="font-medium text-zinc-800">{vehicle.registrationNumber}</p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500">Make and model</p>
                                <p className="font-medium text-zinc-800">{vehicle.make} {vehicle.model}</p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500">Size</p>
                                <p className="font-medium text-zinc-800">{vehicle.vehicleSize}</p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500">Capacity</p>
                                <p className="font-medium text-zinc-800">{vehicle.capacityTon} tons</p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500">Temperature control</p>
                                <p className="font-medium text-zinc-800">{vehicle.hasTemperatureControl ? "Yes" : "No"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500">Status</p>
                                <StatusBadge status={vehicle.status} />
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard title="Documents">
                        <div className="flex flex-col divide-y divide-slate-100">
                            {DOCUMENT_FIELDS.map(({ urlKey, dateKey, label }) => {
                                const url = vehicle.documents[urlKey];
                                const dateStr = vehicle.documents[dateKey];
                                const days = daysUntil(dateStr);
                                return (
                                    <div key={urlKey} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                                        <div className="flex items-center gap-3">
                                            <DocBadge label={label} dateStr={dateStr} />
                                            {dateStr && (
                                                <span className="text-xs text-zinc-500">
                                                    Expires {new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                                    {days !== null && days < 0 ? " (expired)" : ""}
                                                </span>
                                            )}
                                        </div>
                                        {url ? (
                                            <a
                                                href={url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-xs font-semibold text-primary hover:underline"
                                            >
                                                View file
                                            </a>
                                        ) : (
                                            <span className="text-xs text-zinc-400">Not uploaded</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </SectionCard>
                </div>
            )}

            {activeTab === "trip" && (
                <div className="flex flex-col gap-4">
                    {trip ? (
                        <>
                            <SectionCard title={`Trip ${trip.tripId}`} subtitle={`${trip.origin} → ${trip.destination}`}>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                                    <div>
                                        <p className="text-xs text-zinc-500">Driver</p>
                                        <p className="font-medium text-zinc-800">{trip.driverName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-500">Started</p>
                                        <p className="font-medium text-zinc-800">{formatDateTime(trip.startedAt)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-500">ETA</p>
                                        <p className="font-medium text-zinc-800">{formatDateTime(trip.eta)}</p>
                                    </div>
                                    {trip.temperatureC !== undefined && (
                                        <div>
                                            <p className="text-xs text-zinc-500">Cargo temperature</p>
                                            <p className="font-medium text-zinc-800">{trip.temperatureC}°C</p>
                                        </div>
                                    )}
                                </div>
                                <div className="border-t border-slate-100 pt-4">
                                    <p className="text-xs font-semibold text-zinc-500 mb-2">Stops</p>
                                    <div className="flex flex-col gap-2">
                                        {trip.stops.map((stop, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm">
                                                <span className={`w-2 h-2 rounded-full ${stop.reachedAt ? "bg-emerald-500" : "bg-slate-300"}`} />
                                                <span className="font-medium text-zinc-800">{stop.name}</span>
                                                <span className="text-xs text-zinc-500">
                                                    {stop.reachedAt ? `Reached ${formatDateTime(stop.reachedAt)}` : "Pending"}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </SectionCard>

                            <SectionCard title="Live location" subtitle="Location tracking will connect here once the tracker feed is live.">
                                <div className="h-64 rounded-lg border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center gap-2">
                                    <p className="text-sm font-medium text-zinc-600">{trip.currentLocation.label}</p>
                                    <p className="text-xs text-zinc-400">
                                        {trip.currentLocation.lat.toFixed(4)}, {trip.currentLocation.lng.toFixed(4)}
                                    </p>
                                    <p className="text-xs text-zinc-400">Updated {formatDateTime(trip.currentLocation.updatedAt)}</p>
                                </div>
                            </SectionCard>
                        </>
                    ) : (
                        <div className="bg-white p-10 rounded-xl border border-dashed border-slate-300 text-center">
                            <p className="text-sm text-zinc-500">This vehicle isn't on a trip right now.</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === "costs" && (
                <CostSummaryTab
                    costs={costs}
                    costView={costView}
                    setCostView={setCostView}
                    selectedMonthKey={selectedMonthKey}
                    setSelectedMonthKey={setSelectedMonthKey}
                />
            )}
        </div>
    );
};

function CostSummaryTab({
    costs,
    costView,
    setCostView,
    selectedMonthKey,
    setSelectedMonthKey,
}: {
    costs: MockCostEntry[];
    costView: "monthly" | "yearly";
    setCostView: (v: "monthly" | "yearly") => void;
    selectedMonthKey: string | null;
    setSelectedMonthKey: (v: string | null) => void;
}) {
    const total = costs.reduce((sum, c) => sum + c.amount, 0);

    const byCategory = COST_CATEGORIES.map((cat) => ({
        category: cat,
        amount: costs.filter((c) => c.category === cat).reduce((s, c) => s + c.amount, 0),
    })).sort((a, b) => b.amount - a.amount);
    const maxCategory = Math.max(...byCategory.map((c) => c.amount), 1);

    const monthMap = new Map<string, { label: string; amount: number }>();
    costs.forEach((c) => {
        const d = new Date(c.date);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        const label = d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
        const existing = monthMap.get(key);
        monthMap.set(key, { label, amount: (existing?.amount ?? 0) + c.amount });
    });
    const months = Array.from(monthMap.entries())
        .map(([key, v]) => ({ key, ...v }))
        .sort((a, b) => (a.key < b.key ? 1 : -1));
    const maxMonth = Math.max(...months.map((m) => m.amount), 1);

    const yearMap = new Map<number, number>();
    costs.forEach((c) => {
        const y = new Date(c.date).getFullYear();
        yearMap.set(y, (yearMap.get(y) ?? 0) + c.amount);
    });
    const years = Array.from(yearMap.entries())
        .map(([year, amount]) => ({ year, amount }))
        .sort((a, b) => b.year - a.year);
    const maxYear = Math.max(...years.map((y) => y.amount), 1);

    const visibleCosts = selectedMonthKey
        ? costs.filter((c) => {
              const d = new Date(c.date);
              return `${d.getFullYear()}-${d.getMonth()}` === selectedMonthKey;
          })
        : costs;

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <p className="text-xs text-zinc-500">Total spend</p>
                    <p className="text-lg font-semibold text-zinc-900 mt-1">{formatINR(total)}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">Last 12 months</p>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {byCategory.map(({ category, amount }) => (
                    <div key={category} className="bg-white p-4 rounded-xl border border-slate-200">
                        <p className={`text-xs inline-flex px-1.5 py-0.5 rounded ${CATEGORY_TONE[category]}`}>{category}</p>
                        <p className="text-lg font-semibold text-zinc-900 mt-1">{formatINR(amount)}</p>
                    </div>
                ))}
            </div>

            <SectionCard title="Cost breakdown by category">
                <div className="flex flex-col gap-3">
                    {byCategory.map(({ category, amount }) => (
                        <div key={category} className="flex items-center gap-3">
                            <span className="w-16 text-xs font-semibold text-zinc-600">{category}</span>
                            <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${CATEGORY_BAR[category]}`}
                                    style={{ width: `${(amount / maxCategory) * 100}%` }}
                                />
                            </div>
                            <span className="w-20 text-right text-xs font-medium text-zinc-700">{formatINR(amount)}</span>
                        </div>
                    ))}
                </div>
            </SectionCard>

            <SectionCard title="Spend over time">
                <div className="flex items-center gap-1 mb-4">
                    <button
                        type="button"
                        onClick={() => {
                            setCostView("monthly");
                            setSelectedMonthKey(null);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            costView === "monthly" ? "bg-primary text-white" : "bg-slate-100 text-zinc-600"
                        }`}
                    >
                        Monthly
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setCostView("yearly");
                            setSelectedMonthKey(null);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            costView === "yearly" ? "bg-primary text-white" : "bg-slate-100 text-zinc-600"
                        }`}
                    >
                        Yearly
                    </button>
                </div>

                {costView === "monthly" ? (
                    <div className="flex flex-col gap-2">
                        {months.map((m) => (
                            <button
                                key={m.key}
                                type="button"
                                onClick={() => setSelectedMonthKey(selectedMonthKey === m.key ? null : m.key)}
                                className="flex items-center gap-3 text-left"
                            >
                                <span className="w-20 text-xs font-medium text-zinc-600">{m.label}</span>
                                <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${selectedMonthKey === m.key ? "bg-primary" : "bg-zinc-400"}`}
                                        style={{ width: `${(m.amount / maxMonth) * 100}%` }}
                                    />
                                </div>
                                <span className="w-20 text-right text-xs font-medium text-zinc-700">{formatINR(m.amount)}</span>
                            </button>
                        ))}
                        {selectedMonthKey && (
                            <p className="text-xs text-zinc-400 mt-1">Showing transactions for the selected month below. Click again to clear.</p>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {years.map((y) => (
                            <div key={y.year} className="flex items-center gap-3">
                                <span className="w-20 text-xs font-medium text-zinc-600">{y.year}</span>
                                <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                                    <div className="h-full rounded-full bg-zinc-400" style={{ width: `${(y.amount / maxYear) * 100}%` }} />
                                </div>
                                <span className="w-20 text-right text-xs font-medium text-zinc-700">{formatINR(y.amount)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </SectionCard>

            <SectionCard title="Transactions" subtitle="Extracted from cost photos uploaded by the driver.">
                <div className="flex flex-col divide-y divide-slate-100">
                    {visibleCosts.map((c) => (
                        <div key={c.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                            <div className="flex items-center gap-3">
                                <span className={`text-xs px-1.5 py-0.5 rounded ${CATEGORY_TONE[c.category]}`}>{c.category}</span>
                                <div>
                                    <p className="text-sm font-medium text-zinc-800">{c.note}</p>
                                    <p className="text-xs text-zinc-400">
                                        {new Date(c.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                        {" · "}
                                        {c.source === "photo-app" ? "Uploaded via app" : "Shared on WhatsApp"}
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

export default VehicleDetails;