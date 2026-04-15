import api from "@stf/lib/axios";
import type {AxiosResponse} from "axios";
import type {Units} from "@sts/models/units.model";

export const UnitService = {
    getAll: (signal: AbortSignal): Promise<AxiosResponse<Units[]>> => api.get('/units', { signal: signal! })
}