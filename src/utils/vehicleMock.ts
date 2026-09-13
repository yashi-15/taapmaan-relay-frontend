/**
 * PLACEHOLDER ONLY: the backend doesn't return trip, location, or cost data
 * on the vehicle record yet, so everything in this file derives deterministic
 * pseudo-random values from the vehicle's id (never Math.random()), so the
 * same vehicle always looks the same on the list page and its detail page,
 * and doesn't flicker between renders. None of it carries real meaning —
 * swap it out once the trips/tracking/costs endpoints exist.
 */

export type MockTripStatus = "IN_TRANSIT" | "IDLE";

function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 31 + str.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
}

function pick<T>(arr: T[], seed: number): T {
    return arr[seed % arr.length];
}

export function getMockTripStatus(vehicleId: string): MockTripStatus {
    return hashString(vehicleId) % 2 === 0 ? "IN_TRANSIT" : "IDLE";
}

export function daysUntil(dateStr?: string): number | null {
    if (!dateStr) return null;
    const target = new Date(dateStr).getTime();
    if (Number.isNaN(target)) return null;
    return Math.ceil((target - Date.now()) / (1000 * 60 * 60 * 24));
}

/* ---------------------------- Trip & location ---------------------------- */

export interface MockTripStop {
    name: string;
    reachedAt?: string; // ISO string; undefined = not yet reached
}

export interface MockTrip {
    tripId: string;
    origin: string;
    destination: string;
    startedAt: string;
    eta: string;
    driverName: string;
    stops: MockTripStop[];
    currentLocation: { lat: number; lng: number; label: string; updatedAt: string };
    temperatureC?: number;
}

const CITIES = [
    "Delhi", "Gurugram", "Jaipur", "Agra", "Kanpur", "Lucknow",
    "Ludhiana", "Chandigarh", "Ambala", "Meerut", "Indore", "Bhopal",
];

const DRIVERS = ["Rajesh Kumar", "Suresh Yadav", "Amrik Singh", "Vinod Pal", "Mahesh Chand", "Iqbal Khan"];

/** Returns null when the vehicle isn't currently in transit. */
export function getMockTrip(vehicleId: string, hasTemperatureControl?: boolean): MockTrip | null {
    if (getMockTripStatus(vehicleId) !== "IN_TRANSIT") return null;

    const h = hashString(vehicleId);
    const origin = pick(CITIES, h);
    let destination = pick(CITIES, h + 7);
    if (destination === origin) destination = pick(CITIES, h + 3);

    const now = Date.now();
    const startedAt = new Date(now - ((h % 6) + 2) * 60 * 60 * 1000).toISOString();
    const eta = new Date(now + ((h % 5) + 1) * 60 * 60 * 1000).toISOString();

    const stopCount = (h % 2) + 1;
    const stops: MockTripStop[] = Array.from({ length: stopCount }).map((_, i) => ({
        name: pick(CITIES, h + i + 11),
        reachedAt: i === 0 ? new Date(now - ((h % 3) + 1) * 60 * 60 * 1000).toISOString() : undefined,
    }));

    // Rough India bounding box, nudged deterministically so pins don't overlap.
    const lat = 22 + ((h % 900) / 100);
    const lng = 75 + ((h % 700) / 100);

    return {
        tripId: `TRP-${(h % 90000) + 10000}`,
        origin,
        destination,
        startedAt,
        eta,
        driverName: pick(DRIVERS, h + 2),
        stops,
        currentLocation: {
            lat,
            lng,
            label: `Near ${pick(CITIES, h + 5)}`,
            updatedAt: new Date(now - 4 * 60 * 1000).toISOString(),
        },
        temperatureC: hasTemperatureControl ? 2 + (h % 4) : undefined,
    };
}

/* --------------------------------- Costs --------------------------------- */

export type CostCategory = "CNG" | "Toll" | "Repair" | "Tire" | "Other";
export type CostSource = "photo-whatsapp" | "photo-app";

export interface MockCostEntry {
    id: string;
    category: CostCategory;
    amount: number;
    date: string; // ISO
    note: string;
    source: CostSource;
}

export const COST_CATEGORIES: CostCategory[] = ["CNG", "Toll", "Repair", "Tire", "Other"];

const NOTES: Record<CostCategory, string[]> = {
    CNG: ["Fuel fill-up", "Full tank", "Partial refill"],
    Toll: ["Highway toll", "Expressway toll", "State border toll"],
    Repair: ["Brake pad replacement", "Engine service", "AC repair", "Clutch work"],
    Tire: ["Tire replacement", "Puncture repair", "Wheel alignment"],
    Other: ["Parking fee", "Loading labour", "Miscellaneous"],
};

const BASE_AMOUNT: Record<CostCategory, number> = {
    CNG: 1800,
    Toll: 350,
    Repair: 2500,
    Tire: 4000,
    Other: 600,
};

/** Deterministic mock cost ledger for a vehicle, covering the trailing 12 months. */
export function getMockCosts(vehicleId: string): MockCostEntry[] {
    const h = hashString(vehicleId);
    const entries: MockCostEntry[] = [];
    const now = new Date();

    for (let m = 0; m < 12; m++) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - m, 1);
        const entriesThisMonth = 3 + ((h + m) % 4);

        for (let i = 0; i < entriesThisMonth; i++) {
            const seed = h + m * 17 + i * 13;
            const category = pick(COST_CATEGORIES, seed);
            const day = 1 + (seed % 27);
            const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day).toISOString();
            const amount = Math.round(BASE_AMOUNT[category] * (0.6 + ((seed % 80) / 100)));

            entries.push({
                id: `${vehicleId}-${m}-${i}`,
                category,
                amount,
                date,
                note: pick(NOTES[category], seed + 3),
                source: seed % 3 === 0 ? "photo-app" : "photo-whatsapp",
            });
        }
    }

    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}