import {decimal, pgTable, primaryKey, timestamp, uuid, varchar} from "drizzle-orm/pg-core";
import {baseIdColumn} from "./base-id-column.schema";
import {serviceRequestStatuses} from "./service-request-statuses.schema";
import {serviceProviders} from "./service-providers.schema";
import {baseAuditColumn} from "./base-audit-column.schema";
import {customers} from "./customers.schema";
import {users} from "./users.schema";

export const serviceRequests = pgTable('service_requests', {
        ...baseIdColumn(),
        serviceNumber: varchar('service_number', {length: 12})
            .notNull()
            .unique(),
        problem: varchar('problem').notNull(),
        solution: varchar('solution'),
        totalAmount: decimal('total_amount', {precision: 10, scale: 2}),
        startedAt: timestamp('started_at'),
        completedAt: timestamp('completed_at'),
        serviceRequestStatusId: uuid('service_request_status_id')
            .references(() => serviceRequestStatuses.id, {
                onDelete: 'set null'
            }),
        serviceProviderId: uuid('service_provider_id')
            .references(() => serviceProviders.id, {
                onDelete: 'set null'
            }),
        customerId: uuid('customer_id')
            .references(() => customers.id, {
                onDelete: 'set null'
            }),
        createdBy: uuid('created_by')
            .references(() => users.id, {
                onDelete: 'set null'
            }),
    // UpdatedBy could be add. 
        ...baseAuditColumn(),
    },
    // (t => [
    //     primaryKey({
    //         columns: [t.serviceRequestStatusId, t.serviceProviderId, t.customerId, t.createdBy]
    //     })
    // ])
)