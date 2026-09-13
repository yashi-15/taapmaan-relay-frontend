import type { CreateVehiclePayload, CreateVehicleResponse, ListVehiclesParams, ListVehiclesResponse } from "../components/types/vehiclePayload";
import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";

export const vehicleAPI = {
    // Both vehicle routes require a vendor bearer token, so use apiClient
    // (adds Authorization header + handles 401 refresh) rather than authClient.
    create: (data: CreateVehiclePayload) =>
        apiClient.post<CreateVehicleResponse>(API_ENDPOINTS.VEHICLES.CREATE, data),

    list: (params?: ListVehiclesParams) =>
        apiClient.get<ListVehiclesResponse>(API_ENDPOINTS.VEHICLES.LIST, { params }),
};

export default vehicleAPI;