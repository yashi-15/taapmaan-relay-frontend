import { daysUntil, getMockTripStatus } from "../../utils/vehicleMock";
// components/elements/VehicleBadges.tsx
import { Snowflake, Thermometer, Package } from "lucide-react";
import type { TripPayment, BookingType } from "../../utils/paymentsMock";

export function TripStatusBadge({ vehicleId }: { vehicleId: string }) {
    const isInTransit = getMockTripStatus(vehicleId) === "IN_TRANSIT";
    const tone = isInTransit
        ? "bg-indigo-50 text-indigo-700 border-indigo-200"
        : "bg-slate-100 text-zinc-600 border-slate-200";
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${tone}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isInTransit ? "bg-indigo-500" : "bg-zinc-400"}`} />
            {isInTransit ? "In Transit" : "Idle"}
        </span>
    );
}

export function DocBadge({ label, dateStr }: { label: string; dateStr?: string }) {
    if (!dateStr) {
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-zinc-500 border border-slate-200">
                {label}
            </span>
        );
    }

    const days = daysUntil(dateStr);
    let tone = "bg-emerald-50 text-emerald-700 border-emerald-200";
    let suffix = "";
    if (days !== null && days < 0) {
        tone = "bg-red-50 text-red-700 border-red-200";
        suffix = " · Expired";
    } else if (days !== null && days <= 30) {
        tone = "bg-amber-50 text-amber-700 border-amber-200";
        suffix = ` · ${days}d left`;
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${tone}`}>
            {label}{suffix}
        </span>
    );
}

export function StatusBadge({ status }: { status: string }) {
    const tone =
        status === "ACTIVE"
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : status === "PENDING"
            ? "bg-amber-50 text-amber-700 border-amber-200"
            : "bg-slate-100 text-zinc-600 border-slate-200";
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${tone}`}>
            {status}
        </span>
    );
}

export const vehicleTypeStyles: Record<TripPayment["vehicleType"], string> = {
  Frozen: "bg-sky-50 text-sky-700 border-sky-200",
  Chiller: "bg-cyan-50 text-cyan-700 border-cyan-200",
  Dry: "bg-amber-50 text-amber-800 border-amber-200",
};

export const vehicleTypeIcon: Record<TripPayment["vehicleType"], React.ReactNode> = {
  Frozen: <Snowflake className="h-3 w-3" />,
  Chiller: <Thermometer className="h-3 w-3" />,
  Dry: <Package className="h-3 w-3" />,
};

export const bookingTypeStyles: Record<BookingType, string> = {
  Adhoc: "bg-slate-100 text-slate-700 border-slate-200",
  Dedicated: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

export function VehicleTypeBadge({ type }: { type: TripPayment["vehicleType"] }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${vehicleTypeStyles[type]}`}>
      {vehicleTypeIcon[type]}
      {type}
    </span>
  );
}

export function BookingTypeBadge({ type }: { type: BookingType }) {
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${bookingTypeStyles[type]}`}>
      {type}
    </span>
  );
}