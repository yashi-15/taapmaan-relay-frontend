/**
 * FRONTEND-ONLY MOCK DATA for trips, drivers, and vehicles.
 *
 * This lives here (not inside TripBar) specifically so both the parent
 * (Trips.tsx, which needs to filter trips by status per tab) and the child
 * (TripBar.tsx, which renders them) can import independently, rather than
 * the parent having to reach into the child's exports to get at data the
 * child happens to own.
 *
 * Swap this whole file out once there's a real trips API: keep the type
 * exports (Trip, Stop, Driver, Vehicle, etc.) since components are typed
 * against them, but replace `trips`/`drivers`/`vehicles` with fetched data.
 */

// ---------- types ----------

export type InstructionType = "pickup" | "dropoff" | "pickup-dropoff";
export type StopStatus = "completed" | "current" | "upcoming" | "exception";
export type TripStatus = "Pending" | "In Transit" | "Completed";

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
  /** Optional explicit override — otherwise derived from the trip's status. */
  status?: StopStatus;
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
  status: TripStatus;
  amount: number;
  pricePerKm: number;
  stops: Stop[];
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  rating: number;
  tripsCompleted: number;
  status: "Available" | "On trip";
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  type: string;
  status: "Available" | "In use";
}

// ---------- helpers ----------

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

/**
 * Mock stop-level progress for trips whose stops don't specify an explicit
 * `status`. Pending trips haven't started, so every stop is "upcoming".
 * Completed trips are all "completed". In Transit trips get a rough split:
 * the first ~40% of stops done, one "current", the rest "upcoming" —
 * purely illustrative until the backend reports real stop-by-stop state.
 */
export function deriveStopStatus(trip: Trip, index: number): StopStatus {
  if (trip.status === "Completed") return "completed";
  if (trip.status === "Pending") return "upcoming";
  const doneCount = Math.max(1, Math.floor(trip.stops.length * 0.4));
  if (index < doneCount) return "completed";
  if (index === doneCount) return "current";
  return "upcoming";
}

// ---------- dummy data ----------
// Each trip's stops are given as a single flat, sequence-ordered list.
// Where the original data had a shared boundary stop between two legs
// (same `sequence`), it's represented once here, with the earlier leg's
// arrival time and the later leg's departure time.

export const trips: Trip[] = [
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
    status: "Pending",
    amount: 4886.77,
    pricePerKm: 18.05,
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
        departure: "12 Jul, 06:15",
        equipment: "10' Truck_CNG",
        instructionType: "pickup-dropoff",
      }),
      stopBase({
        sequence: 5,
        code: "HHR5",
        arrival: "12 Jul, 09:01",
        departure: "12 Jul, 11:15",
        equipment: "10' Truck_CNG",
        instructionType: "pickup-dropoff",
      }),
      stopBase({
        sequence: 6,
        code: "TDH4",
        arrival: "12 Jul, 15:47",
        departure: "12 Jul, 17:47",
        equipment: "10' Truck_CNG",
        instructionType: "pickup-dropoff",
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
    status: "In Transit",
    amount: 5720.4,
    pricePerKm: 20.0,
    stops: [
      // First stop explicitly flagged as an exception (e.g. late departure)
      // to demo the red "exception" marker in the progress strip.
      stopBase({
        sequence: 1,
        code: "DEL2",
        arrival: "13 Jul, 07:00",
        departure: "13 Jul, 08:00",
        equipment: "14' Truck",
        instructionType: "pickup",
        status: "exception",
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
        departure: "13 Jul, 13:40",
        equipment: "14' Truck",
        instructionType: "pickup-dropoff",
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
    status: "Completed",
    amount: 3913.8,
    pricePerKm: 21.5,
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
        departure: "14 Jul, 10:30",
        equipment: "10' Truck_CNG",
        instructionType: "pickup-dropoff",
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
    status: "Pending",
    amount: 3245.6,
    pricePerKm: 21.08,
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
    status: "In Transit",
    amount: 6081.5,
    pricePerKm: 22.03,
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
        departure: "16 Jul, 10:50",
        equipment: "17' Truck",
        instructionType: "pickup-dropoff",
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
];

export const drivers: Driver[] = [
  { id: "d1", name: "Ramesh Kumar", phone: "98110 22341", rating: 4.8, tripsCompleted: 312, status: "Available" },
  { id: "d2", name: "Suresh Yadav", phone: "98730 88120", rating: 4.6, tripsCompleted: 201, status: "Available" },
  { id: "d3", name: "Vikram Singh", phone: "99586 40092", rating: 4.9, tripsCompleted: 487, status: "Available" },
  { id: "d4", name: "Anil Sharma", phone: "97110 55673", rating: 4.3, tripsCompleted: 96, status: "On trip" },
  { id: "d5", name: "Deepak Mehta", phone: "96500 12983", rating: 4.7, tripsCompleted: 258, status: "Available" },
];

export const vehicles: Vehicle[] = [
  { id: "v1", plateNumber: "HR 38 AB 4471", type: "10' Truck_CNG", status: "Available" },
  { id: "v2", plateNumber: "HR 55 CJ 9012", type: "14' Truck", status: "Available" },
  { id: "v3", plateNumber: "DL 1L AA 2210", type: "9' Truck", status: "Available" },
  { id: "v4", plateNumber: "HR 26 BK 7734", type: "17' Truck", status: "In use" },
  { id: "v5", plateNumber: "MH 12 GZ 5568", type: "10' Truck_CNG", status: "Available" },
];