import api from "@stf/lib/axios";
import {type AxiosResponse} from "axios";

export const ServiceRequestStatusService = {
    getAllStatuses: (signal?: AbortSignal): Promise<AxiosResponse<any>> => api.get('/serviceRequestStatuses', { signal: signal! })
}