// driversMock.ts
// ---------------------------------------------------------------------------
// Dummy data for the vendor-side Drivers list. Shape mirrors the `Driver`
// Prisma model (fields the vendor actually enters/sees) — swap this out for
// a real API call (e.g. GET /vendor/drivers) once the backend is wired up.
// ---------------------------------------------------------------------------

export type DriverAvailabilityStatus = "available" | "on_trip" | "unavailable";

export type DriverVerificationStatus = "pending" | "verified" | "rejected";

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | null;
  licenseNumber: string;
  emergencyContact?: string | null;
  dateOfBirth?: string | null; // ISO date, e.g. "1994-03-12"
  joiningDate?: string | null; // ISO date
  address?: string | null;
  profilePhotoUrl?: string | null;
  availabilityStatus: DriverAvailabilityStatus;
  verificationStatus: DriverVerificationStatus;
  rejectionReason?: string | null;
  createdAt: string; // ISO datetime
}

export const DRIVERS_MOCK: Driver[] = [
  {
    id: "d1",
    firstName: "Ramesh",
    lastName: "Yadav",
    phone: "9820011223",
    email: "ramesh.yadav@example.com",
    licenseNumber: "MH1420110012345",
    emergencyContact: "9820099887",
    dateOfBirth: "1988-06-14",
    joiningDate: "2024-01-10",
    address: "Flat 12, Sai Nagar, Bhiwandi, MH",
    profilePhotoUrl: null,
    availabilityStatus: "on_trip",
    verificationStatus: "verified",
    rejectionReason: null,
    createdAt: "2024-01-08T10:30:00.000Z",
  },
  {
    id: "d2",
    firstName: "Suresh",
    lastName: "Pawar",
    phone: "9765544332",
    email: null,
    licenseNumber: "MH1220190087654",
    emergencyContact: "9765500011",
    dateOfBirth: "1991-11-02",
    joiningDate: "2024-03-22",
    address: "Near Bus Stand, Nashik Road, MH",
    profilePhotoUrl: null,
    availabilityStatus: "available",
    verificationStatus: "verified",
    rejectionReason: null,
    createdAt: "2024-03-20T09:15:00.000Z",
  },
  {
    id: "d3",
    firstName: "Irfan",
    lastName: "Sheikh",
    phone: "9988712340",
    email: "irfan.sheikh@example.com",
    licenseNumber: "GJ0120215566778",
    emergencyContact: "9988700001",
    dateOfBirth: "1995-02-19",
    joiningDate: "2025-05-02",
    address: "Ring Road, Surat, GJ",
    profilePhotoUrl: null,
    availabilityStatus: "unavailable",
    verificationStatus: "pending",
    rejectionReason: null,
    createdAt: "2025-05-01T12:00:00.000Z",
  },
  {
    id: "d4",
    firstName: "Vikas",
    lastName: "More",
    phone: "9822334455",
    email: "vikas.more@example.com",
    licenseNumber: "MH1420180023456",
    emergencyContact: null,
    dateOfBirth: "1989-09-30",
    joiningDate: "2023-11-05",
    address: "Sector 7, Chinchwad, Pune, MH",
    profilePhotoUrl: null,
    availabilityStatus: "available",
    verificationStatus: "verified",
    rejectionReason: null,
    createdAt: "2023-11-03T08:45:00.000Z",
  },
  {
    id: "d5",
    firstName: "Ganesh",
    lastName: "Kolhe",
    phone: "9090011122",
    email: null,
    licenseNumber: "MH0920221199887",
    emergencyContact: "9090000011",
    dateOfBirth: "1997-01-25",
    joiningDate: "2026-08-12",
    address: "Old Agra Road, Malegaon, MH",
    profilePhotoUrl: null,
    availabilityStatus: "unavailable",
    verificationStatus: "rejected",
    rejectionReason: "License photo unreadable — please re-upload a clearer copy.",
    createdAt: "2026-08-11T16:20:00.000Z",
  },
];