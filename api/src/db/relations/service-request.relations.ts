import {relations} from "drizzle-orm";
import {
    customers, serviceItems, serviceProviders,
    serviceRequestEmployees, serviceRequests, serviceRequestStatuses, users
} from "../schema";

export const serviceRequestRelations = relations(serviceRequests, ({one, many}) => ({
    user: one(users, {
        fields: [serviceRequests.createdBy],
        references: [users.id]
    }),
    customer: one(customers, {
        fields: [serviceRequests.customerId],
        references: [customers.id]
    }),
    serviceProvider: one(serviceProviders, {
        fields: [serviceRequests.serviceProviderId],
        references: [serviceProviders.id]
    }),
    serviceRequestsStatus: one(serviceRequestStatuses, {
        fields: [serviceRequests.serviceRequestStatusId],
        references: [serviceRequestStatuses.id]
    }),
    serviceItems: many(serviceItems),
    serviceRequestEmployee: many(serviceRequestEmployees)
}))