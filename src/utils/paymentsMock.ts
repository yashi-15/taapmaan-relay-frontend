// paymentsMock.ts
// Mock data for the Vendor Payments tab.
// Replace with real API calls once the payments endpoints are ready.

export type BookingType = "Adhoc" | "Dedicated";
export type VehicleType = "Frozen" | "Chiller" | "Dry";
export type PaymentStatus = "Due" | "Received";

export interface TripPayment {
  id: string;               // internal record id
  tripId: string;           // shown to vendor, e.g. TRIP-9F21EA5
  bookingType: BookingType;
  origin: string;
  destination: string;
  vehicleNumber: string;
  vehicleType: VehicleType;
  driverName: string;
  workPeriodStart: string;  // ISO date
  workPeriodEnd: string;    // ISO date
  completedOn: string;      // ISO date — when the trip was closed
  invoiceDate: string;      // ISO date
  amount: number;           // INR
  status: PaymentStatus;
  receivedOn?: string;      // ISO date, only when status === "Received"
  paymentMode?: string;     // e.g. "NEFT", "UPI"
  utrNumber?: string;       // bank reference, only when received
}

export const duePayments: TripPayment[] = [
  {
    id: "pay_1001",
    tripId: "TRIP-9EA5F2",
    bookingType: "Dedicated",
    origin: "Bhiwandi, MH",
    destination: "Indore, MP",
    vehicleNumber: "MH-04-GT-9812",
    vehicleType: "Frozen",
    driverName: "Ramesh Yadav",
    workPeriodStart: "2026-08-02",
    workPeriodEnd: "2026-08-15",
    completedOn: "2026-08-15",
    invoiceDate: "2026-08-22",
    amount: 76149.57,
    status: "Due",
  },
  {
    id: "pay_1002",
    tripId: "TRIP-32EE1C",
    bookingType: "Adhoc",
    origin: "Nashik, MH",
    destination: "Ahmedabad, GJ",
    vehicleNumber: "MH-15-CJ-4471",
    vehicleType: "Chiller",
    driverName: "Suresh Pawar",
    workPeriodStart: "2026-08-14",
    workPeriodEnd: "2026-08-14",
    completedOn: "2026-08-14",
    invoiceDate: "2026-08-22",
    amount: 18782.0,
    status: "Due",
  },
  {
    id: "pay_1003",
    tripId: "TRIP-77B940",
    bookingType: "Dedicated",
    origin: "Pune, MH",
    destination: "Hyderabad, TS",
    vehicleNumber: "MH-12-KL-3390",
    vehicleType: "Dry",
    driverName: "Vikram Chauhan",
    workPeriodStart: "2026-08-16",
    workPeriodEnd: "2026-08-29",
    completedOn: "2026-08-29",
    invoiceDate: "2026-08-30",
    amount: 112430.5,
    status: "Due",
  },
  {
    id: "pay_1004",
    tripId: "TRIP-5D0A88",
    bookingType: "Adhoc",
    origin: "Bhiwandi, MH",
    destination: "Surat, GJ",
    vehicleNumber: "GJ-05-BT-2210",
    vehicleType: "Frozen",
    driverName: "Ramesh Yadav",
    workPeriodStart: "2026-08-25",
    workPeriodEnd: "2026-08-25",
    completedOn: "2026-08-25",
    invoiceDate: "2026-08-26",
    amount: 22960.0,
    status: "Due",
  },
];

export const paymentHistory: TripPayment[] = [
  {
    id: "pay_0987",
    tripId: "TRIP-11FA20",
    bookingType: "Dedicated",
    origin: "Bhiwandi, MH",
    destination: "Indore, MP",
    vehicleNumber: "MH-04-GT-9812",
    vehicleType: "Frozen",
    driverName: "Ramesh Yadav",
    workPeriodStart: "2026-07-19",
    workPeriodEnd: "2026-08-01",
    completedOn: "2026-08-01",
    invoiceDate: "2026-08-08",
    amount: 74200.0,
    status: "Received",
    receivedOn: "2026-08-10",
    paymentMode: "NEFT",
    utrNumber: "UTR2260810884231",
  },
  {
    id: "pay_0965",
    tripId: "TRIP-08C412",
    bookingType: "Adhoc",
    origin: "Nashik, MH",
    destination: "Vadodara, GJ",
    vehicleNumber: "MH-15-CJ-4471",
    vehicleType: "Chiller",
    driverName: "Suresh Pawar",
    workPeriodStart: "2026-08-05",
    workPeriodEnd: "2026-08-05",
    completedOn: "2026-08-05",
    invoiceDate: "2026-08-06",
    amount: 16340.75,
    status: "Received",
    receivedOn: "2026-08-07",
    paymentMode: "UPI",
    utrNumber: "UTR2260807771902",
  },
  {
    id: "pay_0940",
    tripId: "TRIP-C29A03",
    bookingType: "Dedicated",
    origin: "Pune, MH",
    destination: "Hyderabad, TS",
    vehicleNumber: "MH-12-KL-3390",
    vehicleType: "Dry",
    driverName: "Vikram Chauhan",
    workPeriodStart: "2026-07-02",
    workPeriodEnd: "2026-07-15",
    completedOn: "2026-07-15",
    invoiceDate: "2026-07-16",
    amount: 108900.0,
    status: "Received",
    receivedOn: "2026-07-19",
    paymentMode: "NEFT",
    utrNumber: "UTR2260719440871",
  },
  {
    id: "pay_0911",
    tripId: "TRIP-9A7701",
    bookingType: "Adhoc",
    origin: "Bhiwandi, MH",
    destination: "Surat, GJ",
    vehicleNumber: "GJ-05-BT-2210",
    vehicleType: "Frozen",
    driverName: "Ramesh Yadav",
    workPeriodStart: "2026-06-28",
    workPeriodEnd: "2026-06-28",
    completedOn: "2026-06-28",
    invoiceDate: "2026-06-29",
    amount: 21500.0,
    status: "Received",
    receivedOn: "2026-07-02",
    paymentMode: "UPI",
    utrNumber: "UTR2260702118820",
  },
];

export const formatINR = (value: number): string =>
  `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });