import {integer, pgTable, varchar} from "drizzle-orm/pg-core";
import {baseIdColumn} from "./base-id-column.schema";
import {baseAuditColumn} from "./base-audit-column.schema";

export const serviceRequestStatuses = pgTable('service_request_statuses', {
    ...baseIdColumn(),
    name: varchar('name', {length: 50})
        .notNull()
        .unique(),
    nameLocalized: varchar('name_localized', {length: 100}).notNull(),
    sortOrder: integer('sort_order').notNull(),
    ...baseAuditColumn(),
})