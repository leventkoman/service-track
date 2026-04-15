import {SubscriptionPlan} from "@sts/models/subscription-plan.model";

export interface Subscription {
    id: string;
    endDate: string;
    startDate: string;
    subscriptionPlan: SubscriptionPlan;
}