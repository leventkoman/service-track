import type {LoginValues} from "@sts/schemas/auth.schema";
import api from "@stf/lib/axios";
import type {AxiosResponse} from "axios";
import type {LoginResponse} from "@sts/models/login-response";

export const authService = {
    login: (data: LoginValues): Promise<AxiosResponse<LoginResponse>> => api.post('/auth/login', data)
}