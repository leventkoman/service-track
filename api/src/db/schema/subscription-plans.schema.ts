import {integer, pgEnum, pgTable, varchar} from "drizzle-orm/pg-core";
import {baseIdColumn} from "./base-id-column.schema";
import {baseAuditColumn} from "./base-audit-column.schema";

export const subscriptionPlans = pgTable('subscription_plans', {
    ...baseIdColumn(),
    planType: varchar('plan_type').notNull(),
    name: varchar('name')
        .notNull(),
    duration: integer('duration')
        .notNull(),
    ...baseAuditColumn()
})