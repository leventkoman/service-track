import api from "@stf/lib/axios";
import {type AxiosResponse} from "axios";
import {type ServiceProviderList} from "@sts/types/service-provider.types";

export const serviceProviderService = {
    getAllServices: (): Promise<AxiosResponse<ServiceProviderList[]>> => api.get('/serviceProviders'),
    deleteService: (id: string): Promise<AxiosResponse<string>> => api.delete(`/serviceProviders/${id}`),
}