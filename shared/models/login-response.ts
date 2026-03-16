import type {LoginUser} from "@sts/models/login-user";

export interface LoginResponse {
    token: string;
    user: LoginUser;
}