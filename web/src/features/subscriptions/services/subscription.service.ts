import api from "@stf/lib/axios";
import type {ChangeSubscriptionValue} from "@stf/features/subscriptions/schemas/change-subscription.schema";

export const SubscriptionService = {
    getAllSubscriptions: (signal?: AbortSignal) => api.get("/subscriptions", { signal: signal! }),
    changePlanType: (body: ChangeSubscriptionValue, signal?: AbortSignal) => api.post("/subscriptions/changePlanType", body, { signal: signal! }),
}