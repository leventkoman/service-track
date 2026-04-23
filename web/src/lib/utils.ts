import {customerLabels, type CustomerType} from "@sts/types/customer.types";
import type {ServiceProviderForCustomer} from "@sts/types/service-provider.types";
import {roleLabels, type RoleTypes} from "@sts/types/role.types";
import dayjs from "dayjs";

export function convertCustomerType(customerType: CustomerType): string {
    if (!customerType) {
        return "";
    }
    
    return customerLabels[customerType];
}

export function getCompanyName(serviceProviders: ServiceProviderForCustomer[]): string {
    return serviceProviders.map(item => item.companyName).join(', ');
}

export function getRoles(roles: RoleTypes[]): string {
    return roles.map(role => roleLabels[role] ?? role).join(', ');
}

export function formatDateTimeToDMYHM(date: Date | null): string {
    if (!date) {
        return "";
    }
    
    return dayjs(date).format('DD/MM/YYYY HH:mm');
}

export function roleMatch(userRoles: string[] | undefined, roles: string[] | undefined) {
    if (!userRoles || !roles) return ;
    return roles.some(r => userRoles.includes(r))
}

export function getFirstLetterFromFullName(fullName: string) {
    if (!fullName) return '?';
    return fullName.slice(0, 1).toUpperCase();
}