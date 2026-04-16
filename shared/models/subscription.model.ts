import {SubscriptionPlan} from "@sts/models/subscription-plan.model";
import {ServiceProviderForSubscription} from "@sts/types/service-provider.types";

export interface Subscription {
    id: string;
    endDate: Date | null;
    startDate: Date;
    isActive: boolean;
    subscriptionPlan: SubscriptionPlan;
    serviceProvider: ServiceProviderForSubscription;
}