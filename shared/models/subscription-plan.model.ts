export interface SubscriptionPlan {
    id: string;
    name: string;
    planType: string; // Todo: add enum for types.
    duration: number;
}