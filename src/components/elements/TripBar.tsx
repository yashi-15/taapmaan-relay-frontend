import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  IndianRupee,
  MapPin,
  ArrowRightLeft,
  ArrowRight,
} from "lucide-react";

/**
 * TripList
 * Matches the real data hierarchy: Trip -> Shipment -> Stop.
 *
 *   Trip (a contract, top row - collapsible, expands into its shipments)
 *     -> Shipment (a leg of the trip, e.g. 113CZJTF2 - collapsible, expands
 *        into its stop-by-stop table)
 *        -> Stop (a single location in the shipment - each stop's
 *           pickup/dropoff instructions are independently collapsible)
 *
 * All three levels are independent accordions: opening/closing a Trip
 * doesn't reset which of its Shipments were open, and opening/closing a
 * Shipment doesn't reset which Stop instruction panels were open. Trips
 * default to open on first render so the initial view matches the
 * reference UI; click the chevron in the trip header to collapse one.
 *
 * Animation: the same 0fr/1fr CSS grid-rows trick as before. That's the only
 * inline style in the file; everything else is Tailwind utility classes.
 */

// ---------- types ----------

export type InstructionType = "pickup" | "dropoff" | "pickup-dropoff";

export interface Stop {
  id: string;
  sequence: number;
  code: string; // e.g. "HHR5"
  company: string;
  address: string;
  arrival: string;
  departure: string;
  equipment: string;
  instructionType: InstructionType;
  contact: string | null;
  referenceNumbers: string[];
  instructions: string;
}

export interface Shipment {
  id: string;
  shipmentCode: string;
  fromStop: number;
  toStop: number;
  distance: number;
  duration: string;
  equipment: string;
  status: "Live";
  amount: number;
  stops: Stop[];
}

export interface Trip {
  id: string;
  contractId: string;
  contractCode: string;
  origin: string;
  destination: string;
  startTime: string;
  endTime: string;
  totalDistance: number;
  totalDuration: string;
  equipment: string;
  status: "Live" | "Completed";
  amount: number;
  pricePerKm: number;
  shipments: Shipment[];
}

// ---------- dummy data ----------
// Extended to include all 4 shipments shown in the reference screenshot;
// stop details are filled in fully only for the first shipment (as given),
// the rest use lighter placeholder stop data so the demo still renders end
// to end. Swap this whole array for real API data.

function stopBase(overrides: Omit<Stop, "id" | "company" | "address" | "contact" | "referenceNumbers" | "instructions"> &
  Partial<Pick<Stop, "company" | "address" | "contact" | "referenceNumbers" | "instructions">>): Stop {
  return {
    company: "Cold Star Logistics Pvt Ltd",
    address: "Killa No. Khasra No. 4//23/1, Sonipat, HARYANA 131103",
    contact: null,
    referenceNumbers: [],
    instructions: "",
    id: `${overrides.code}-${overrides.sequence}`,
    ...overrides,
  };
}

const trips: Trip[] = [
  {
    id: "trip1",
    contractId: "C-00009B5C2",
    contractCode: "T-30FAR3011",
    origin: "HHR5 KUNDLI INDUSTRIAL AREA",
    destination: "HHR5 KUNDLI INDUSTRIAL AREA",
    startTime: "Sat, Jul 11, 22:00 IST",
    endTime: "Sun, Jul 12, 18:00 IST",
    totalDistance: 271,
    totalDuration: "20h 31m",
    equipment: "10' Truck_CNG",
    status: "Live",
    amount: 4886.77,
    pricePerKm: 18.05,
    shipments: [
      {
        id: "s1",
        shipmentCode: "113CZJTF2",
        fromStop: 1,
        toStop: 4,
        distance: 72,
        duration: "7h 1m",
        equipment: "10' Truck_CNG",
        status: "Live",
        amount: 32.31,
        stops: [
          stopBase({
            sequence: 1,
            code: "HHR5",
            arrival: "11 Jul, 22:00",
            departure: "12 Jul, 00:30",
            equipment: "10' Truck_CNG",
            instructionType: "pickup",
            instructions: "Available after accepting",
          }),
          stopBase({
            sequence: 2,
            code: "TDD9",
            arrival: "12 Jul, 02:30",
            departure: "12 Jul, 03:30",
            equipment: "10' Truck_CNG",
            instructionType: "pickup-dropoff",
            instructions: "Available after accepting",
          }),
          stopBase({
            sequence: 3,
            code: "TDH4",
            arrival: "12 Jul, 03:30",
            departure: "12 Jul, 04:30",
            equipment: "10' Truck_CNG",
            instructionType: "pickup-dropoff",
          }),
          stopBase({
            sequence: 4,
            code: "TDC2",
            arrival: "12 Jul, 04:30",
            departure: "12 Jul, 05:01",
            equipment: "10' Truck_CNG",
            instructionType: "pickup-dropoff",
          }),
        ],
      },
      {
        id: "s2",
        shipmentCode: "1122Q6T5L",
        fromStop: 4,
        toStop: 5,
        distance: 73,
        duration: "3h 46m",
        equipment: "10' Truck_CNG",
        status: "Live",
        amount: 32.75,
        stops: [
          stopBase({
            sequence: 4,
            code: "TDC2",
            arrival: "12 Jul, 05:01",
            departure: "12 Jul, 06:15",
            equipment: "10' Truck_CNG",
            instructionType: "pickup",
          }),
          stopBase({
            sequence: 5,
            code: "HHR5",
            arrival: "12 Jul, 09:01",
            departure: "12 Jul, 10:01",
            equipment: "10' Truck_CNG",
            instructionType: "dropoff",
          }),
        ],
      },
      {
        id: "s3",
        shipmentCode: "114BC55P6",
        fromStop: 5,
        toStop: 6,
        distance: 62,
        duration: "5h 46m",
        equipment: "10' Truck_CNG",
        status: "Live",
        amount: 27.7,
        stops: [
          stopBase({
            sequence: 5,
            code: "HHR5",
            arrival: "12 Jul, 10:01",
            departure: "12 Jul, 11:15",
            equipment: "10' Truck_CNG",
            instructionType: "pickup",
          }),
          stopBase({
            sequence: 6,
            code: "TDH4",
            arrival: "12 Jul, 15:47",
            departure: "12 Jul, 16:47",
            equipment: "10' Truck_CNG",
            instructionType: "dropoff",
          }),
        ],
      },
      {
        id: "s4",
        shipmentCode: "115NZYTV5",
        fromStop: 6,
        toStop: 7,
        distance: 65,
        duration: "4h 1m",
        equipment: "10' Truck_CNG",
        status: "Live",
        amount: 35.57,
        stops: [
          stopBase({
            sequence: 6,
            code: "TDH4",
            arrival: "12 Jul, 16:47",
            departure: "12 Jul, 17:47",
            equipment: "10' Truck_CNG",
            instructionType: "pickup",
          }),
          stopBase({
            sequence: 7,
            code: "HHR5",
            arrival: "12 Jul, 21:48",
            departure: "12 Jul, 22:48",
            equipment: "10' Truck_CNG",
            instructionType: "dropoff",
          }),
        ],
      },
    ],
  },
  {
  id: "trip2",
  contractId: "C-00009B5C3",
  contractCode: "T-30FAR3012",
  origin: "DEL2 DELHI SORT CENTER",
  destination: "JPR3 JAIPUR HUB",
  startTime: "Mon, Jul 13, 07:00 IST",
  endTime: "Mon, Jul 13, 18:20 IST",
  totalDistance: 286,
  totalDuration: "11h 20m",
  equipment: "14' Truck",
  status: "Live",
  amount: 5720.4,
  pricePerKm: 20.0,
  shipments: [
    {
      id: "s5",
      shipmentCode: "221ABR5Q2",
      fromStop: 1,
      toStop: 3,
      distance: 118,
      duration: "4h 15m",
      equipment: "14' Truck",
      status: "Live",
      amount: 41.9,
      stops: [
        stopBase({
          sequence: 1,
          code: "DEL2",
          arrival: "13 Jul, 07:00",
          departure: "13 Jul, 08:00",
          equipment: "14' Truck",
          instructionType: "pickup",
        }),
        stopBase({
          sequence: 2,
          code: "RWR1",
          arrival: "13 Jul, 10:15",
          departure: "13 Jul, 10:45",
          equipment: "14' Truck",
          instructionType: "pickup-dropoff",
        }),
        stopBase({
          sequence: 3,
          code: "ALW2",
          arrival: "13 Jul, 12:15",
          departure: "13 Jul, 13:00",
          equipment: "14' Truck",
          instructionType: "pickup-dropoff",
        }),
      ],
    },
    {
      id: "s6",
      shipmentCode: "221ABR5Q3",
      fromStop: 3,
      toStop: 5,
      distance: 168,
      duration: "7h 5m",
      equipment: "14' Truck",
      status: "Live",
      amount: 56.4,
      stops: [
        stopBase({
          sequence: 3,
          code: "ALW2",
          arrival: "13 Jul, 13:00",
          departure: "13 Jul, 13:40",
          equipment: "14' Truck",
          instructionType: "pickup",
        }),
        stopBase({
          sequence: 4,
          code: "DSA1",
          arrival: "13 Jul, 15:45",
          departure: "13 Jul, 16:15",
          equipment: "14' Truck",
          instructionType: "pickup-dropoff",
        }),
        stopBase({
          sequence: 5,
          code: "JPR3",
          arrival: "13 Jul, 18:20",
          departure: "13 Jul, 18:50",
          equipment: "14' Truck",
          instructionType: "dropoff",
        }),
      ],
    },
  ],
},

{
  id: "trip3",
  contractId: "C-00009B5C4",
  contractCode: "T-30FAR3013",
  origin: "PNQ1 PUNE FC",
  destination: "BOM4 MUMBAI FC",
  startTime: "Tue, Jul 14, 06:30 IST",
  endTime: "Tue, Jul 14, 13:45 IST",
  totalDistance: 182,
  totalDuration: "7h 15m",
  equipment: "10' Truck_CNG",
  status: "Live",
  amount: 3913.8,
  pricePerKm: 21.5,
  shipments: [
    {
      id: "s7",
      shipmentCode: "331LMN8Q1",
      fromStop: 1,
      toStop: 2,
      distance: 82,
      duration: "3h 10m",
      equipment: "10' Truck_CNG",
      status: "Live",
      amount: 28.2,
      stops: [
        stopBase({
          sequence: 1,
          code: "PNQ1",
          arrival: "14 Jul, 06:30",
          departure: "14 Jul, 07:10",
          equipment: "10' Truck_CNG",
          instructionType: "pickup",
        }),
        stopBase({
          sequence: 2,
          code: "LNV1",
          arrival: "14 Jul, 09:40",
          departure: "14 Jul, 10:00",
          equipment: "10' Truck_CNG",
          instructionType: "dropoff",
        }),
      ],
    },
    {
      id: "s8",
      shipmentCode: "331LMN8Q2",
      fromStop: 2,
      toStop: 4,
      distance: 100,
      duration: "4h 5m",
      equipment: "10' Truck_CNG",
      status: "Live",
      amount: 35.9,
      stops: [
        stopBase({
          sequence: 2,
          code: "LNV1",
          arrival: "14 Jul, 10:00",
          departure: "14 Jul, 10:30",
          equipment: "10' Truck_CNG",
          instructionType: "pickup",
        }),
        stopBase({
          sequence: 3,
          code: "NVM1",
          arrival: "14 Jul, 11:45",
          departure: "14 Jul, 12:10",
          equipment: "10' Truck_CNG",
          instructionType: "pickup-dropoff",
        }),
        stopBase({
          sequence: 4,
          code: "BOM4",
          arrival: "14 Jul, 13:45",
          departure: "14 Jul, 14:15",
          equipment: "10' Truck_CNG",
          instructionType: "dropoff",
        }),
      ],
    },
  ],
},

{
  id: "trip4",
  contractId: "C-00009B5C5",
  contractCode: "T-30FAR3014",
  origin: "BLR2 BANGALORE FC",
  destination: "MYS1 MYSORE HUB",
  startTime: "Wed, Jul 15, 09:00 IST",
  endTime: "Wed, Jul 15, 16:10 IST",
  totalDistance: 154,
  totalDuration: "7h 10m",
  equipment: "9' Truck",
  status: "Live",
  amount: 3245.6,
  pricePerKm: 21.08,
  shipments: [
    {
      id: "s9",
      shipmentCode: "441QWE6R1",
      fromStop: 1,
      toStop: 3,
      distance: 154,
      duration: "7h 10m",
      equipment: "9' Truck",
      status: "Live",
      amount: 36.8,
      stops: [
        stopBase({
          sequence: 1,
          code: "BLR2",
          arrival: "15 Jul, 09:00",
          departure: "15 Jul, 09:45",
          equipment: "9' Truck",
          instructionType: "pickup",
        }),
        stopBase({
          sequence: 2,
          code: "RAM1",
          arrival: "15 Jul, 12:00",
          departure: "15 Jul, 12:25",
          equipment: "9' Truck",
          instructionType: "pickup-dropoff",
        }),
        stopBase({
          sequence: 3,
          code: "MYS1",
          arrival: "15 Jul, 16:10",
          departure: "15 Jul, 16:40",
          equipment: "9' Truck",
          instructionType: "dropoff",
        }),
      ],
    },
  ],
},

{
  id: "trip5",
  contractId: "C-00009B5C6",
  contractCode: "T-30FAR3015",
  origin: "HYD3 HYDERABAD FC",
  destination: "VJW2 VIJAYAWADA HUB",
  startTime: "Thu, Jul 16, 05:45 IST",
  endTime: "Thu, Jul 16, 14:25 IST",
  totalDistance: 276,
  totalDuration: "8h 40m",
  equipment: "17' Truck",
  status: "Live",
  amount: 6081.5,
  pricePerKm: 22.03,
  shipments: [
    {
      id: "s10",
      shipmentCode: "551JKL9T1",
      fromStop: 1,
      toStop: 2,
      distance: 134,
      duration: "4h 5m",
      equipment: "17' Truck",
      status: "Live",
      amount: 44.6,
      stops: [
        stopBase({
          sequence: 1,
          code: "HYD3",
          arrival: "16 Jul, 05:45",
          departure: "16 Jul, 06:30",
          equipment: "17' Truck",
          instructionType: "pickup",
        }),
        stopBase({
          sequence: 2,
          code: "SRY1",
          arrival: "16 Jul, 09:50",
          departure: "16 Jul, 10:20",
          equipment: "17' Truck",
          instructionType: "dropoff",
        }),
      ],
    },
    {
      id: "s11",
      shipmentCode: "551JKL9T2",
      fromStop: 2,
      toStop: 4,
      distance: 142,
      duration: "4h 35m",
      equipment: "17' Truck",
      status: "Live",
      amount: 46.1,
      stops: [
        stopBase({
          sequence: 2,
          code: "SRY1",
          arrival: "16 Jul, 10:20",
          departure: "16 Jul, 10:50",
          equipment: "17' Truck",
          instructionType: "pickup",
        }),
        stopBase({
          sequence: 3,
          code: "GNT2",
          arrival: "16 Jul, 12:45",
          departure: "16 Jul, 13:05",
          equipment: "17' Truck",
          instructionType: "pickup-dropoff",
        }),
        stopBase({
          sequence: 4,
          code: "VJW2",
          arrival: "16 Jul, 14:25",
          departure: "16 Jul, 15:00",
          equipment: "17' Truck",
          instructionType: "dropoff",
        }),
      ],
    },
  ],
},
  
];

// ---------- helpers ----------

function useOpenSet(initial: string[] = []): [Set<string>, (id: string) => void] {
  const [open, setOpen] = useState<Set<string>>(new Set(initial));
  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  return [open, toggle];
}

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

// ---------- Stops table (shown when a Shipment is expanded) ----------

function StopsTable({ stops }: { stops: Stop[] }) {
  return (
    <div className="bg-white">
      <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-4 px-4 py-2 border-b border-gray-200 text-[12px] font-semibold text-gray-600">
        <div>Stop</div>
        <div>Equipment</div>
        <div>Arrival</div>
        <div>Departure</div>
      </div>
      <div className="divide-y divide-gray-100">
        {stops.map((stop) => (
          <div key={stop.id} className="px-4 py-3">
            <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-4 items-start">
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
  );
}

// ---------- Shipment row (middle accordion, expands into StopsTable) ----------

function ShipmentRow({
  shipment,
  open,
  onToggle,
}: {
  shipment: Shipment;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <div
        className="grid grid-cols-[1.5fr_2fr_2fr_0.9fr_1.3fr_1fr_1.3fr] gap-4 items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 cursor-pointer"
        onClick={onToggle}
      >
        <button
          type="button"
          className="flex items-center gap-1.5 text-[13.5px] font-semibold text-secondary min-w-0"
        >
          {open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          <span className="truncate">{shipment.shipmentCode}</span>
        </button>

        <div className="flex items-center gap-2 text-[13px] text-gray-800 min-w-0">
          <StopBadge sequence={shipment.fromStop} />
          <span>{shipment.stops[0]?.code}</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-gray-800 min-w-0">
          <ArrowRight size={13} className="text-gray-400 shrink-0" />
          <StopBadge sequence={shipment.toStop} />
          <span>{shipment.stops[shipment.stops.length - 1]?.code}</span>
        </div>

        <div className="text-[13px] text-gray-700">
          <div>{shipment.distance} km</div>
          <div className="text-[11.5px] text-gray-400">{shipment.duration}</div>
        </div>

        <div className="text-[13px] text-gray-700">
            <div>{shipment.equipment}</div>
            <div
              className={`text-[12px] font-medium ${
                shipment.status === "Live" ? "text-emerald-600" : "text-gray-400"
              }`}
            >
              {shipment.status}
            </div>
          </div>
        <div className="text-[13.5px] font-medium text-gray-900 text-right">
          {formatCurrency(shipment.amount)}
        </div>
      </div>

      <Collapse open={open}>
        <StopsTable stops={shipment.stops} />
      </Collapse>
    </div>
  );
}

// ---------- Trip card (top-level, always shows its shipments) ----------

function TripCard({
  trip,
  openShipments,
  toggleShipment,
}: {
  trip: Trip;
  openShipments: Set<string>;
  toggleShipment: (id: string) => void;
}) {
  // Trip-level accordion state. Defaults open so the card behaves the same
  // as before on first render; click the chevron (or anywhere in the
  // header) to collapse the shipments + footer away.
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-md bg-white overflow-hidden mb-4">
      {/* trip summary header (click to expand/collapse the whole trip) */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? (
          <ChevronDown size={16} className="text-gray-400 shrink-0" />
        ) : (
          <ChevronRight size={16} className="text-gray-400 shrink-0" />
        )}

        <div className="grid grid-cols-[1.2fr_2fr_2fr_0.9fr_1.3fr_1fr_1.3fr] gap-4 items-center flex-1 min-w-0">
          <div>
            <div className="text-[14px] font-semibold text-secondary">{trip.contractCode}</div>
            <div className="text-[11.5px] text-gray-400">Expires in --</div>
            <div className="text-[11.5px] text-gray-400">Contract</div>
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <StopBadge sequence={1} />
            <div className="min-w-0">
              <div className="text-[13px] text-gray-800 truncate">{trip.origin}</div>
              <div className="text-[11.5px] text-gray-400">{trip.startTime}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <ArrowRightLeft size={14} className="text-gray-400 shrink-0" />
            <StopBadge sequence={trip.shipments.length + 3} />
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
            <div
              className={`text-[12px] font-medium ${
                trip.status === "Live" ? "text-emerald-600" : "text-gray-400"
              }`}
            >
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

          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="justify-self-end bg-primary text-white text-[13.5px] font-medium px-5 py-2 rounded"
          >
            Accept
          </button>
        </div>
      </div>

      <Collapse open={open}>
        <div>
          {/* shipments (each independently collapsible into its stops) */}
          <div>
            {trip.shipments.map((shipment) => (
              <ShipmentRow
                key={shipment.id}
                shipment={shipment}
                open={openShipments.has(shipment.id)}
                onToggle={() => toggleShipment(shipment.id)}
              />
            ))}
          </div>

          {/* footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <IndianRupee size={15} className="text-primary" />
              <MapPin size={15} className="text-primary" />
              <button type="button" className="text-[13px] text-primary hover:underline">
                View all shipment details
              </button>
            </div>
            <button type="button" className="text-[13px] text-primary hover:underline">
              Reject
            </button>
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

export default function TripBar({ trips: tripsProp = trips }: TripListProps) {
  // Shipment-level open state is shared across all trips in one Set, since
  // shipment ids are globally unique - same pattern as the node-level state
  // in the previous version of this component.
  const [openShipments, toggleShipment] = useOpenSet();

  return (
    <div className="min-h-full px-4 py-6">
      <div className="mx-auto">
        {tripsProp.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            openShipments={openShipments}
            toggleShipment={toggleShipment}
          />
        ))}
      </div>
    </div>
  );
}