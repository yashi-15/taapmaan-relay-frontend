import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  IndianRupee,
  MapPin,
  ArrowRightLeft,
  X,
  User,
  Truck,
  Clock,
} from "lucide-react";
import {
  trips as defaultTrips,
  drivers,
  vehicles,
  deriveStopStatus,
  type Trip,
  type Stop,
  type StopStatus,
  type TripStatus,
  type InstructionType,
} from "../../utils/tripslistMock";
import { useNavigate } from "react-router-dom";
import { FaArrowAltCircleRight } from "react-icons/fa";

/**
 * TripList
 * Two-level hierarchy: Trip -> Stop.
 *
 *   Trip (a contract, top row - collapsible, expands into its stop-by-stop
 *        table)
 *     -> Stop (a single location in the trip - each stop's pickup/dropoff
 *        instructions are independently collapsible)
 *
 * This file is purely presentational now — all trip/driver/vehicle types
 * and the dummy dataset live in ../../utils/tripsMock.ts, so the parent
 * (Trips.tsx) can import and filter that data directly instead of pulling
 * it out of this component. TripBar just renders whatever `trips` array
 * it's given (falling back to the full dummy dataset if none is passed).
 *
 * Trip.status has three states: "Pending", "In Transit", "Completed". This
 * changes what sits in the trailing slot of the trip header:
 *   - Pending  -> Accept button (opens AssignmentModal)
 *   - In Transit / Completed -> a compact stop-progress strip: each stop
 *     gets a small status icon (done / current / upcoming / exception),
 *     connected by thin lines, with long middle runs of stops collapsed
 *     into a "<lastSeq>…" marker so it stays readable in a narrow row.
 */

// ---------- helpers ----------

function formatCurrency(amount: number): string {
  return `\u20B9${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const instructionLabel: Record<InstructionType, string> = {
  pickup: "Pick-up instructions",
  dropoff: "Drop-off instructions",
  "pickup-dropoff": "Pick-up/Drop-off instructions",
};

// Collapsible wrapper using the 0fr/1fr grid-rows animation trick.
// This is the one place a dynamic inline style is unavoidable, since the
// grid-template-rows value depends on the open/closed state at runtime.
function Collapse({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <div
      className="grid transition-[grid-template-rows] duration-200 ease-out"
      style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
    >
      <div className="overflow-hidden min-h-0">{children}</div>
    </div>
  );
}

function StopBadge({ sequence }: { sequence: number }) {
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-900 text-white text-[10px] font-semibold shrink-0">
      {sequence}
    </span>
  );
}

// ---------- stop progress strip (In Transit / Completed trailing slot) ----------

function StopStatusIcon({ status }: { status: StopStatus }) {
  switch (status) {
    case "completed":
      return <span className="inline-block w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />;
    case "current":
      return <Clock size={13} className="text-sky-500 shrink-0" />;
    case "exception":
      return <Clock size={13} className="text-red-500 shrink-0" />;
    case "upcoming":
    default:
      return <span className="inline-block w-2 h-2 rounded-full bg-gray-300 shrink-0" />;
  }
}

/**
 * Compact horizontal readout of stop-by-stop progress, used in place of the
 * Accept button once a trip is In Transit or Completed. Shows the first
 * stop, the second stop, then — if there are more than four stops — a
 * single "<seq>…" marker standing in for the compressed middle run, and
 * finally the last stop. Each marker's color/icon reflects that stop's
 * status (done / current / upcoming / exception).
 */
function StopProgressStrip({ trip }: { trip: Trip }) {
  const withStatus = trip.stops.map((stop, i) => ({
    sequence: stop.sequence,
    status: stop.status ?? deriveStopStatus(trip, i),
  }));

  type Marker = { key: string; sequence: number; status: StopStatus; compressed?: boolean };
  let markers: Marker[];

  if (withStatus.length <= 4) {
    markers = withStatus.map((s) => ({ key: `${s.sequence}`, ...s }));
  } else {
    const first = withStatus[0];
    const second = withStatus[1];
    const middle = withStatus.slice(2, -1);
    const last = withStatus[withStatus.length - 1];
    // Represent the compressed run with the status of its last stop —
    // whichever stop is closest to "now" is the most relevant one to flag.
    markers = [
      { key: `${first.sequence}`, ...first },
      { key: `${second.sequence}`, ...second },
      { key: `mid-${middle[0].sequence}`, sequence: last.sequence, status: middle[middle.length - 1].status, compressed: true },
      { key: `${last.sequence}-last`, ...last },
    ];
  }

  return (
    <div className="justify-self-end flex items-center gap-1.5" title="Stop progress">
      {markers.map((m, i) => (
        <React.Fragment key={m.key}>
          {i > 0 && <span className="w-4 h-px bg-gray-200 shrink-0" />}
          <div className="flex items-center gap-1">
            <StopStatusIcon status={m.status} />
            <span className="text-[11px] text-gray-500 font-medium tabular-nums">
              {m.compressed ? `${m.sequence}\u2026` : m.sequence}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

// ---------- Stop instructions (innermost accordion) ----------

function StopInstructions({ stop }: { stop: Stop }) {
  const [open, setOpen] = useState(false);
  const hasRefs = stop.referenceNumbers.length > 0;

  return (
    <div className="mt-1.5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-[13px] font-medium text-secondary hover:underline"
      >
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        {instructionLabel[stop.instructionType]}
      </button>
      <Collapse open={open}>
        <div className="mt-2 mb-1 bg-gray-50 border border-gray-200 rounded-md overflow-hidden">
          <div className="grid grid-cols-2 gap-4 px-3 py-2 border-b border-gray-200">
            <div className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">
              Contact
            </div>
            <div className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">
              Reference #'s
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 px-3 py-2">
            <div className="text-[13px] italic text-gray-500">
              {stop.contact ?? "Available after accepting"}
            </div>
            <div className="text-[13px] italic text-gray-500">
              {hasRefs ? stop.referenceNumbers.join(", ") : "Available after accepting"}
            </div>
          </div>
          {stop.instructions && (
            <div className="px-3 pb-2 text-[13px] text-gray-600 border-t border-gray-200 pt-2">
              {stop.instructions}
            </div>
          )}
        </div>
      </Collapse>
    </div>
  );
}

// ---------- Stops table (shown when a Trip is expanded) ----------

function StopsTable({ stops }: { stops: Stop[] }) {
  return (
    <div className="bg-white overflow-x-auto">
      <div className="min-w-[640px]">
        <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-4 px-4 py-2 border-b border-gray-200 text-[12px] font-semibold text-gray-600">
          <div>Stop</div>
          <div>Equipment</div>
          <div>Arrival</div>
          <div>Departure</div>
        </div>
        <div className="divide-y divide-gray-100 font-medium">
          {stops.map((stop) => (
            <div key={stop.id} className="px-4 py-3">
              <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-4 items-start">
                <div className="flex items-start gap-2 min-w-0">
                  <StopBadge sequence={stop.sequence} />
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-medium text-gray-900">{stop.code}</div>
                    <div className="text-[12px] text-gray-500 truncate">{stop.company}</div>
                    <div className="text-[12px] text-gray-500 truncate">{stop.address}</div>
                  </div>
                </div>
                <div className="text-[13px] text-gray-700 pt-0.5">{stop.equipment}</div>
                <div className="text-[13px] text-gray-700 pt-0.5">{stop.arrival}</div>
                <div className="text-[13px] text-gray-700 pt-0.5">{stop.departure}</div>
              </div>
              <StopInstructions stop={stop} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- Assignment modal (driver + vehicle selection on Accept) ----------

function DriverSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const selected = drivers.find((d) => d.id === value);
  return (
    <div>
      <div className="text-[12px] font-semibold text-gray-700 mb-1.5">Driver</div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <User size={15} />
        </span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none border border-gray-200 rounded-md pl-9 pr-9 py-2.5 text-[13.5px] text-gray-900 bg-white hover:border-gray-300 focus:outline-none focus:border-primary"
        >
          <option value="" disabled>
            Select a driver
          </option>
          {drivers.map((driver) => (
            <option key={driver.id} value={driver.id} disabled={driver.status !== "Available"}>
              {driver.name} {driver.status !== "Available" ? "(On trip)" : `\u2014 \u2605 ${driver.rating}`}
            </option>
          ))}
        </select>
        <ChevronDown
          size={15}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>
      {selected && (
        <div className="mt-1.5 text-[12px] text-gray-500">
          {selected.phone} &middot; {selected.tripsCompleted} trips completed
        </div>
      )}
    </div>
  );
}

function VehicleSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const selected = vehicles.find((v) => v.id === value);
  return (
    <div>
      <div className="text-[12px] font-semibold text-gray-700 mb-1.5">Vehicle</div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <Truck size={15} />
        </span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none border border-gray-200 rounded-md pl-9 pr-9 py-2.5 text-[13.5px] text-gray-900 bg-white hover:border-gray-300 focus:outline-none focus:border-primary"
        >
          <option value="" disabled>
            Select a vehicle
          </option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id} disabled={vehicle.status !== "Available"}>
              {vehicle.plateNumber} {vehicle.status !== "Available" ? "(In use)" : `\u2014 ${vehicle.type}`}
            </option>
          ))}
        </select>
        <ChevronDown
          size={15}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>
      {selected && <div className="mt-1.5 text-[12px] text-gray-500">{selected.type}</div>}
    </div>
  );
}

function AssignmentModal({
  trip,
  onClose,
  onConfirm,
}: {
  trip: Trip;
  onClose: () => void;
  onConfirm: (driverId: string, vehicleId: string) => void;
}) {
  const [driverId, setDriverId] = useState("");
  const [vehicleId, setVehicleId] = useState("");

  const canConfirm = Boolean(driverId && vehicleId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md flex flex-col bg-white rounded-lg shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-gray-100">
          <div className="min-w-0">
            <div className="text-[15px] font-semibold text-gray-900">Assign driver &amp; vehicle</div>
            <div className="text-[12.5px] text-gray-500 truncate">
              {trip.contractCode} &middot; {trip.origin} &rarr; {trip.destination}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <DriverSelect value={driverId} onChange={setDriverId} />
          <VehicleSelect value={vehicleId} onChange={setVehicleId} />
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="text-[13.5px] font-medium text-gray-600 px-4 py-2 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canConfirm}
            onClick={() => driverId && vehicleId && onConfirm(driverId, vehicleId)}
            className={`text-[13.5px] font-medium px-5 py-2 rounded text-white ${canConfirm ? "bg-primary" : "bg-gray-300 cursor-not-allowed"
              }`}
          >
            Confirm assignment
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Trip card (top-level, expands directly into its stops) ----------

const statusTextClass: Record<TripStatus, string> = {
  Pending: "text-amber-600",
  "In Transit": "text-emerald-600",
  Completed: "text-gray-400",
};

function TripCard({ trip, onAccept }: { trip: Trip; onAccept: (trip: Trip) => void }) {
  const [open, setOpen] = useState(false);
  const lastStop = trip.stops[trip.stops.length - 1];
  const isPending = trip.status === "Pending";

  const navigate = useNavigate();

  return (
    <div className="border border-gray-200 rounded-md bg-white overflow-hidden mb-2">
      {/* trip summary header (click to expand/collapse into the stops table) */}
      <div
        className="flex items-center gap-3 px-4 py-2 cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? (
          <ChevronDown size={16} className="text-gray-400 shrink-0" />
        ) : (
          <ChevronRight size={16} className="text-gray-400 shrink-0" />
        )}

        <div className="flex-1 min-w-0 overflow-x-auto">
          <div className="grid grid-cols-[1.2fr_2fr_2fr_0.9fr_1.3fr_1fr_1.3fr_0.6fr] gap-4 items-center min-w-[820px] font-medium">
            <div>
              <div className="text-[14px] font-semibold text-secondary">{trip.contractCode}</div>
              <div className="text-[11.5px] text-gray-400">Expires in --</div>
              <div className="text-[11.5px] text-gray-400">Contract</div>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <StopBadge sequence={trip.stops[0]?.sequence ?? 1} />
              <div className="min-w-0">
                <div className="text-[13px] text-gray-800 truncate">{trip.origin}</div>
                <div className="text-[11.5px] text-gray-400">{trip.startTime}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <ArrowRightLeft size={14} className="text-gray-400 shrink-0" />
              <StopBadge sequence={lastStop?.sequence ?? trip.stops.length} />
              <div className="min-w-0">
                <div className="text-[13px] text-gray-800 truncate">{trip.destination}</div>
                <div className="text-[11.5px] text-gray-400">{trip.endTime}</div>
              </div>
            </div>

            <div className="text-[13px] text-gray-700">
              <div>{trip.totalDistance} km</div>
              <div className="text-[11.5px] text-gray-400">{trip.totalDuration}</div>
            </div>

            <div className="text-[13px] text-gray-700">
              <div>{trip.equipment}</div>
              <div className={`text-[12px] font-medium ${statusTextClass[trip.status]}`}>
                {trip.status}
              </div>
            </div>

            <div className="text-right">
              <div className="text-[15px] font-semibold text-gray-900">
                {formatCurrency(trip.amount)}
              </div>
              <div className="text-[11.5px] text-gray-400">
                {formatCurrency(trip.pricePerKm)}/km
              </div>
            </div>

            {isPending ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAccept(trip);
                }}
                className="justify-self-end bg-primary text-white text-[13.5px] font-medium px-5 py-2 rounded"
              >
                Accept
              </button>
            ) : (
              <StopProgressStrip trip={trip} />
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/dashboard/trips/${trip.id}`, { state: { trip } });
              }}
              className="text-xs font-semibold text-primary hover:underline"
            >
              <FaArrowAltCircleRight size={28} className="inline-block mr-1" />
            </button>
          </div>
        </div>
      </div>

      <Collapse open={open}>
        <div>
          {/* stops (directly under the trip, no shipment level in between) */}
          <StopsTable stops={trip.stops} />

          {/* footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <IndianRupee size={15} className="text-primary" />
              <MapPin size={15} className="text-primary" />
              <button type="button" className="text-[13px] text-primary hover:underline">
                View all stop details
              </button>
            </div>
            {isPending && (
              <button type="button" className="text-[13px] text-primary hover:underline">
                Reject
              </button>
            )}
            {trip.status === "In Transit" && (
              <button type="button" className="text-[13px] text-primary hover:underline">
                Report an issue
              </button>
            )}
            {trip.status === "Completed" && (
              <button type="button" className="text-[13px] text-primary hover:underline">
                View proof of delivery
              </button>
            )}
          </div>
        </div>
      </Collapse>
    </div>
  );
}

// ---------- top-level export ----------

export interface TripListProps {
  trips?: Trip[];
}

export default function TripBar({ trips: tripsProp = defaultTrips }: TripListProps) {
  const [assigningTrip, setAssigningTrip] = useState<Trip | null>(null);

  return (
    <div className="min-h-full px-4 py-6">
      <div className="mx-auto">
        {tripsProp.length === 0 ? (
          <div className="text-center text-[13.5px] text-gray-400 py-12 border border-dashed border-gray-200 rounded-md">
            No trips in this view.
          </div>
        ) : (
          tripsProp.map((trip) => (
            <TripCard key={trip.id} trip={trip} onAccept={setAssigningTrip} />
          ))
        )}
      </div>

      {assigningTrip && (
        <AssignmentModal
          trip={assigningTrip}
          onClose={() => setAssigningTrip(null)}
          onConfirm={(driverId, vehicleId) => {
            // Wire this up to your assignment API - for now just log and
            // close the modal.
            console.log("Assigned", { tripId: assigningTrip.id, driverId, vehicleId });
            setAssigningTrip(null);
          }}
        />
      )}
    </div>
  );
}