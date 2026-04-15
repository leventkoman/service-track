import type {AxiosResponse} from "axios";
import type {VatRates} from "@sts/models/vat-rates.model";
import api from "@stf/lib/axios";

export const VatRateService = {
    getAll: (signal: AbortSignal): Promise<AxiosResponse<VatRates[]>> => api.get('/vatRates', { signal: signal! }) 
}