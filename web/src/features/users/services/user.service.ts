import api from "@stf/lib/axios";
import type {AxiosResponse} from "axios";
import type {UserProfile} from "@sts/models/user-profile";
import type {CreateUserValues} from "@stf/features/users/schemas/create-user.schema";

export const UserService = {
    getAllUsers: (signal?: AbortSignal): Promise<AxiosResponse<UserProfile[]>> => api.get("/users", { signal: signal! }),
    getActiveUsers: (signal?: AbortSignal): Promise<AxiosResponse<UserProfile[]>> => api.get("/users/activeUsers", { signal: signal! }),
    getUserById: (id: string, signal?: AbortSignal): Promise<AxiosResponse<UserProfile>> => api.get(`/users/${id}`, { signal: signal! }),
    createUser: (body: CreateUserValues, signal?: AbortSignal) => api.post('/users', body, { signal: signal! }),
    updateUser: (body: CreateUserValues, signal?: AbortSignal) => api.put(`/users/${body.id}`, body, { signal: signal! }),
    deleteUserById: (id: string, signal?: AbortSignal) => api.delete(`/users/${id}`, { signal: signal! }),
}