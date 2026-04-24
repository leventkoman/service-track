import api from "@stf/lib/axios";
import type {AxiosResponse} from "axios";
import type {Stat} from "@sts/models/stat.model";

export const DashboardService = {
    getAllDashboards: (): Promise<AxiosResponse<Stat>> => api.get('/dashboard/stats'),
}