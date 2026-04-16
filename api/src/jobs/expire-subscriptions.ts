import {db} from "../db";
import {subscriptionPlans, subscriptions} from "../db/schema";
import {and, eq, lt} from "drizzle-orm";

export async function expireSubscriptions() {
    try {
        const result = await db
            .update(subscriptions)
            .set({
                isActive: false,
            }).where(and(
                eq(subscriptions.isDeleted, false),
                eq(subscriptions.isActive, true),
                lt(subscriptions.endDate, new Date()),
            )).returning();
        console.log("Expired subscription count --> ", result.length);
        
    } catch (e) {
        console.error("expire subscriptions error", e);
    }
}