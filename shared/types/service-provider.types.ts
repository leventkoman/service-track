import {ServiceProvider} from "@sts/models/service-provider";

export type ServiceProviderList = Omit<ServiceProvider, 'firstContactDate'>;
export type ServiceProviderForCustomer = Omit<ServiceProvider, 'createdAt' | 'createdBy' | 'updatedAt'>