import api from "@stf/lib/axios";
import type {AxiosResponse} from "axios";
import type {ServiceRequest} from "@sts/models/service-request";
import type {CreateServiceRequestValues} from "@stf/features/service-request/schemas/create-service-request.schema";

export const serviceRequestService = {
    getAllServiceRequests: (signal?: AbortSignal): Promise<AxiosResponse<ServiceRequest[]>> => api.get('/serviceRequests', { signal: signal! }),
    getServiceRequestsById: (id: string, signal?: AbortSignal): Promise<AxiosResponse<ServiceRequest>> => api.get(`/serviceRequests/${id}`, { signal: signal! }),
    createServiceRequests: (body: CreateServiceRequestValues, signal?: AbortSignal) => api.post('/serviceRequests', body, { signal: signal! }),
    updateServiceRequests: (body: CreateServiceRequestValues, signal?: AbortSignal) => api.put(`/serviceRequests/${body.id}`, body, { signal: signal! }),
    deleteServiceRequestById: (id: string, signal?: AbortSignal) => api.delete(`/serviceRequests/${id}`, { signal: signal! }),
}