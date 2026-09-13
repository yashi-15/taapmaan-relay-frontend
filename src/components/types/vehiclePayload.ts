// NOTE: the docs only show "FT_8" as an example vehicleSize value — no enum
// list was provided. Using `string` for now; tighten to a union once the
// full set of allowed sizes is confirmed with backend.
export type VehicleSize = string;

export type VehicleStatus = "ACTIVE" | "INACTIVE" | string;

export interface VehicleDocuments {
    /** Only mandatory field in `documents` per the docs. */
    rcUrl: string;
    rcExpiryDate?: string;
    insuranceUrl?: string;
    insuranceExpiryDate?: string;
    permitUrl?: string;
    permitExpiryDate?: string;
    puccUrl?: string;
    puccExpiryDate?: string;
    fitnessCertificateUrl?: string;
    fitnessExpiryDate?: string;
}

export interface CreateVehiclePayload {
    registrationNumber: string;
    vehicleSize: VehicleSize;
    capacityTon: number;
    hasTemperatureControl: boolean;
    make: string;
    model: string;
    documents: VehicleDocuments;
}

export interface VehicleRecord extends CreateVehiclePayload {
    id: string;
    vendorId: string;
    status: VehicleStatus;
    createdAt: string;
    updatedAt: string;
}

export interface VehicleFieldError {
    field: string;
    message: string;
}

export interface CreateVehicleResponse {
    success: boolean;
    message: string;
    data?: VehicleRecord;
    error?: string;
    errors?: VehicleFieldError[];
}

export interface VehiclePagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ListVehiclesResponse {
    success: boolean;
    message: string;
    data: {
        vehicles: VehicleRecord[];
        pagination: VehiclePagination;
    };
}

/** Query params for GET /vehicles — page/limit aren't documented explicitly
 * but the response includes a pagination block, so exposing them here for
 * when/if the backend confirms support. */
export interface ListVehiclesParams {
    page?: number;
    limit?: number;
}