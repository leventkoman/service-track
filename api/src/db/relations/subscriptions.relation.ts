import {relations} from "drizzle-orm";
import {serviceProviders, subscriptionPlans, subscriptions} from "../schema";

export const subscriptionsRelations = relations(subscriptions, ({one}) => ({
    subscriptionPlan: one(subscriptionPlans, {
        fields: [subscriptions.planId],
        references: [subscriptionPlans.id]
    }),
    serviceProvider: one(serviceProviders, {
        fields: [subscriptions.serviceProviderId],
        references: [serviceProviders.id],
    }),
}))