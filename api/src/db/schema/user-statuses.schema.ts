import {integer, pgTable, varchar} from "drizzle-orm/pg-core";
import {baseIdColumn} from "./base-id-column.schema";
import {baseAuditColumn} from "./base-audit-column.schema";

export const userStatuses = pgTable('user_statuses', {
    ...baseIdColumn(),
    name: varchar('name').
        notNull()
        .unique(),
    nameLocalized: varchar('name_localized')
        .notNull(),
    sortOrder: integer('sort_order').notNull(),
    ...baseAuditColumn()
});