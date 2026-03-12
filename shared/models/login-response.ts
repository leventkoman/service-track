import {User} from "@sts/models/user";

export interface LoginResponse {
    token: string;
    user: User;
}