import type {ChangePasswordValues, LoginValues} from "@sts/schemas/auth.schema";
import api from "@stf/lib/axios";
import type {AxiosResponse} from "axios";
import type {LoginResponse} from "@sts/models/login-response";
import type {SetPassword} from "@sts/models/set-password.model";
import type {VerifyTokenType} from "@sts/types/verify-token.type";

export const authService = {
    verifyToken: (body: VerifyTokenType) => api.post('/auth/verify-set-password-token', body),
    setPassword: (body: SetPassword) => api.post('/auth/set-password', body),
    changePassword: (body: ChangePasswordValues) => api.post('/auth/change-password', body),
    login: (data: LoginValues): Promise<AxiosResponse<LoginResponse>> => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout')
}