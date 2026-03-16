import api from "@stf/lib/axios";
import type {AxiosResponse} from "axios";
import type {ServiceRequest} from "@sts/models/service-request";

export const serviceRequestService = {
    getAllServiceRequests: (): Promise<AxiosResponse<ServiceRequest[]>> => api.get('/serviceRequests')
}