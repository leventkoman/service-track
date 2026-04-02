import api from "@stf/lib/axios";
import type {AxiosResponse} from "axios";
import type {ServiceProviderForMinimal, ServiceProviderList} from "@sts/types/service-provider.types";
import type {CreateServiceProviderValue} from "@sts/schemas/create-service-provider.schema";

export const serviceProviderService = {
    getAllServiceProviders: (signal?: AbortSignal): Promise<AxiosResponse<ServiceProviderList[]>> => api.get('/serviceProviders', { signal: signal! }),
    getAllServiceProviderById: (id: string, signal?: AbortSignal): Promise<AxiosResponse<ServiceProviderForMinimal>> => api.get(`/serviceProviders/${id}`, { signal: signal! }),
    createServiceProvider: (body: CreateServiceProviderValue, signal?: AbortSignal) => api.post('/serviceProviders', body, { signal: signal! }),
    updateServiceProvider: (body: CreateServiceProviderValue, signal?: AbortSignal) => api.put(`/serviceProviders/${body.id}`, body, { signal: signal! }),
    deleteService: (id: string, signal?: AbortSignal): Promise<AxiosResponse<string>> => api.delete(`/serviceProviders/${id}`, { signal: signal! }),
}