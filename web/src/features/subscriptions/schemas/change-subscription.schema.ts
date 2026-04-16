import {z} from "zod";

export const changeSubscriptionSchema = z.object({
    id: z.uuid(),
    planType: z.string()
});

export type ChangeSubscriptionValue = z.infer<typeof changeSubscriptionSchema>;