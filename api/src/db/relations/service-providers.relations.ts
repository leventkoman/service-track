import {relations} from "drizzle-orm";
import {employeeProfiles, serviceProviderCustomers, serviceProviders, serviceRequests, users} from "../schema";

export const serviceProvidersRelations = relations(serviceProviders, ({one, many}) => ({
    createdBy: one(users, {
        fields: [serviceProviders.createdBy],
        references: [users.id]
    }),
    employeeProfiles: many(employeeProfiles),
    serviceProviderCustomers: many(serviceProviderCustomers),
    serviceRequests: many(serviceRequests),
}))