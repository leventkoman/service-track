import {boolean, pgTable, timestamp, uuid} from "drizzle-orm/pg-core";
import {baseIdColumn} from "./base-id-column.schema";
import {subscriptionPlans} from "./subscription-plans.schema";
import {serviceProviders} from "./service-providers.schema";
import {baseAuditColumn} from "./base-audit-column.schema";

export const subscriptions = pgTable("subscriptions", {
    ...baseIdColumn(),
    planId: uuid('plan_id')
        .references(() => subscriptionPlans.id, {
        onDelete: 'set null'
    }),
    serviceProviderId : uuid('service_provider_id').references(() => serviceProviders.id, {
        onDelete: 'set null'
    }),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date'),
    isActive: boolean('is_active').default(false),
    ...baseAuditColumn()
});