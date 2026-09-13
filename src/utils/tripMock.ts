import type { Trip, Driver, Vehicle } from "./tripslistMock";
import { drivers, vehicles } from "./tripslistMock";

// ---------- payment ----------

export interface TripPayment {
  fixed: number;
  variable: number;
  total: number;
}

/**
 * Splits a trip's total payout into a fixed base fee and a variable,
 * distance-based component. Purely illustrative until the backend exposes
 * a real fixed/variable breakdown per contract.
 */
export function getTripPayment(trip: Trip): TripPayment {
  const variable = Math.round(trip.pricePerKm * trip.totalDistance * 100) / 100;
  const fixed = Math.max(Math.round((trip.amount - variable) * 100) / 100, 0);
  return { fixed, variable, total: trip.amount };
}

// ---------- assignment (driver + vehicle) ----------

export interface TripAssignment {
  driver: Driver;
  vehicle: Vehicle;
}

function hashIndex(id: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 100000;
  return h % mod;
}

/**
 * Pending trips have no assignment yet. In Transit / Completed trips get a
 * deterministic mock driver + vehicle (keyed off the trip id) so Overview
 * and Tracking have something real to show.
 */
export function getTripAssignment(trip: Trip): TripAssignment | null {
  if (trip.status === "Pending") return null;
  return {
    driver: drivers[hashIndex(trip.id, drivers.length)],
    vehicle: vehicles[hashIndex(trip.id + "v", vehicles.length)],
  };
}

// ---------- primary contact ----------

export interface TripContact {
  name: string;
  phone: string;
}

const MOCK_CONTACT_NAMES = ["Rajeev Malhotra", "Pooja Verma", "Sanjay Gupta", "Neha Kapoor", "Arvind Chawla"];

/** Falls back to a deterministic mock contact if no stop has one set. */
export function getPrimaryContact(trip: Trip): TripContact {
  const stopWithContact = trip.stops.find((s) => s.contact);
  if (stopWithContact?.contact) {
    return { name: stopWithContact.contact, phone: `+91 98${100000 + hashIndex(trip.id, 800000)}` };
  }
  const idx = hashIndex(trip.id, MOCK_CONTACT_NAMES.length);
  return { name: MOCK_CONTACT_NAMES[idx], phone: `+91 97${100000 + hashIndex(trip.id + "p", 800000)}` };
}

// ---------- tracking (In Transit) ----------

export interface TripTracking {
  currentLocation: { label: string; lat: number; lng: number; updatedAt: string };
  meterStart: number;
  meterEnd: number;
  distanceCoveredKm: number;
  temperatureC: number | null;
}

export function getTripTracking(trip: Trip): TripTracking {
  const meterStart = 10000 + hashIndex(trip.id, 5000);
  const distanceCoveredKm = Math.round(trip.totalDistance * 0.55);
  return {
    currentLocation: {
      label: `Near ${trip.stops[Math.min(1, trip.stops.length - 1)].code}`,
      lat: 28.5 + hashIndex(trip.id, 100) / 1000,
      lng: 77.1 + hashIndex(trip.id + "x", 100) / 1000,
      updatedAt: new Date().toISOString(),
    },
    meterStart,
    meterEnd: meterStart + distanceCoveredKm,
    distanceCoveredKm,
    temperatureC: trip.equipment.includes("CNG") ? null : 4 + hashIndex(trip.id, 6),
  };
}

// ---------- closed trip summary ----------

export interface TripClosureSummary {
  completedAt: string;
  finalMeter: number;
  totalDistanceKm: number;
  driverRatingGiven: number;
  notes: string;
}

export function getTripClosureSummary(trip: Trip): TripClosureSummary {
  const meterStart = 10000 + hashIndex(trip.id, 5000);
  return {
    completedAt: trip.endTime,
    finalMeter: meterStart + trip.totalDistance,
    totalDistanceKm: trip.totalDistance,
    driverRatingGiven: hashIndex(trip.id, 10) % 2 === 0 ? 4.5 : 4,
    notes: "No exceptions reported. POD collected at final drop.",
  };
}

// ---------- cost overview ----------

export type TripCostCategory = "Fuel" | "Toll" | "Loading/Unloading" | "Detention" | "Other";
export const TRIP_COST_CATEGORIES: TripCostCategory[] = ["Fuel", "Toll", "Loading/Unloading", "Detention", "Other"];

export interface TripCostEntry {
  id: string;
  category: TripCostCategory;
  amount: number;
  date: string;
  note: string;
  source: "photo-app" | "whatsapp";
}

/** Deterministic mock cost ledger for a trip, until real expense data exists. */
export function getTripCosts(trip: Trip): TripCostEntry[] {
  const base = hashIndex(trip.id, 500) + 200;
  return [
    { id: `${trip.id}-c1`, category: "Fuel", amount: base * 3, date: trip.startTime, note: "CNG refill", source: "photo-app" },
    { id: `${trip.id}-c2`, category: "Toll", amount: base, date: trip.startTime, note: "Toll plaza", source: "whatsapp" },
    { id: `${trip.id}-c3`, category: "Loading/Unloading", amount: base * 1.5, date: trip.endTime, note: "Loader charges", source: "photo-app" },
    { id: `${trip.id}-c4`, category: "Other", amount: base * 0.5, date: trip.endTime, note: "Miscellaneous", source: "whatsapp" },
  ];
}