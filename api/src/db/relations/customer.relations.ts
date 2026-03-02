import {relations} from "drizzle-orm";
import {customers, serviceProviderCustomers, serviceRequests, users} from "../schema";

export const customerRelations = relations(customers, ({one, many}) => ({
    users: one(users, {
        fields: [customers.userId],
        references: [users.id]
    }),
    serviceProviderCustomers: many(serviceProviderCustomers),
    serviceRequests: many(serviceRequests),
}))