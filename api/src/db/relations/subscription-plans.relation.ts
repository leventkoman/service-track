import {relations} from "drizzle-orm";
import { subscriptionPlans, subscriptions} from "../schema";

export const subscriptionPlanRelations = relations(subscriptionPlans, ({many}) => ({
    subscription: many(subscriptions),
}))