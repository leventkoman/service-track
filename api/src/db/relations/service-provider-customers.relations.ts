import {relations} from "drizzle-orm";
import {customers, serviceProviderCustomers, serviceProviders} from "../schema";

export const serviceProviderCustomersRelations = relations(serviceProviderCustomers, ({one}) => ({
    serviceProviders: one(serviceProviders, {
        fields: [serviceProviderCustomers.serviceProviderId],
        references: [serviceProviders.id]
    }),
    customers: one(customers, {
        fields: [serviceProviderCustomers.customerId],
        references: [customers.id]
    })
}));