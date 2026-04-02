import {ServiceProviderForCustomer} from "@sts/types/service-provider.types";
import {CustomerType} from "@sts/enums/customer-type.enum";

export interface Customer {
    address: string;
    avatar: string;
    customerType: CustomerType;
    description: string;
    email: string;
    fullName: string;
    id: string;
    note: string;
    phone: string;
    serviceProviders: ServiceProviderForCustomer[];
}