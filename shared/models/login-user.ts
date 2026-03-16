export interface LoginUser {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    roles: string[];
    serviceProviderId: string;
}