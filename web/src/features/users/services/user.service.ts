import api from "@stf/lib/axios";
import type {AxiosResponse} from "axios";
import type {UserProfile} from "@sts/models/user-profile";

export const UserService = {
    getAllUsers: (): Promise<AxiosResponse<UserProfile[]>> => api.get("/users"),
}