import type { VehicleRecord } from "../components/types/vehiclePayload";

// Starting fleet shown on the Vehicles page. No backend call is made —
// this is the only source of data for that page.
export const mockVehiclesList: VehicleRecord[] = [
    {
        id: "veh_001",
        vendorId: "vendor_mock_1",
        registrationNumber: "DL01AB1234",
        vehicleSize: "FT_8",
        capacityTon: 8,
        hasTemperatureControl: false,
        make: "Tata",
        model: "LPT 1109",
        documents: {
            rcUrl: "https://storage.example.com/docs/veh_001/rc.pdf",
            rcExpiryDate: "2027-03-15",
            insuranceUrl: "https://storage.example.com/docs/veh_001/insurance.pdf",
            insuranceExpiryDate: "2026-12-01",
            permitUrl: "https://storage.example.com/docs/veh_001/permit.pdf",
            permitExpiryDate: "2027-01-10",
            puccUrl: "https://storage.example.com/docs/veh_001/pucc.pdf",
            puccExpiryDate: "2026-11-20",
            fitnessCertificateUrl: "https://storage.example.com/docs/veh_001/fitness.pdf",
            fitnessExpiryDate: "2027-05-01",
        },
        status: "ACTIVE",
        createdAt: "2026-01-10T09:30:00.000Z",
        updatedAt: "2026-01-10T09:30:00.000Z",
    },
    {
        id: "veh_002",
        vendorId: "vendor_mock_1",
        registrationNumber: "HR26CD5678",
        vehicleSize: "FT_20",
        capacityTon: 20,
        hasTemperatureControl: true,
        make: "Ashok Leyland",
        model: "Boss 1616",
        documents: {
            rcUrl: "https://storage.example.com/docs/veh_002/rc.pdf",
            rcExpiryDate: "2026-10-05",
            insuranceUrl: "https://storage.example.com/docs/veh_002/insurance.pdf",
            insuranceExpiryDate: "2026-09-30",
            puccUrl: "https://storage.example.com/docs/veh_002/pucc.pdf",
            puccExpiryDate: "2026-10-15",
        },
        status: "ACTIVE",
        createdAt: "2026-02-02T11:15:00.000Z",
        updatedAt: "2026-02-02T11:15:00.000Z",
    },
    {
        id: "veh_003",
        vendorId: "vendor_mock_1",
        registrationNumber: "MH12EF9012",
        vehicleSize: "FT_14",
        capacityTon: 14,
        hasTemperatureControl: false,
        make: "Eicher",
        model: "Pro 3015",
        documents: {
            rcUrl: "https://storage.example.com/docs/veh_003/rc.pdf",
            rcExpiryDate: "2027-01-01",
            permitUrl: "https://storage.example.com/docs/veh_003/permit.pdf",
            permitExpiryDate: "2026-12-31",
            fitnessCertificateUrl: "https://storage.example.com/docs/veh_003/fitness.pdf",
            fitnessExpiryDate: "2026-12-01",
        },
        status: "INACTIVE",
        createdAt: "2026-03-18T14:45:00.000Z",
        updatedAt: "2026-03-18T14:45:00.000Z",
    },
];

// Small helper so the "Add Vehicle" form can generate a fake id locally.
export function generateMockVehicleId(): string {
    return `veh_${Math.random().toString(36).slice(2, 8)}`;
}