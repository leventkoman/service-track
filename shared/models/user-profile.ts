import type {RoleTypes} from "@sts/types/role.types";

export interface UserProfile {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    avatar: string;
    description: string
    title: string;
    lastLoginTime: Date | null;
    roles: RoleTypes[];
    status: {
        name: string;
        nameLocalized: string;
    }
}