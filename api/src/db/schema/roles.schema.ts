import {pgTable, timestamp, varchar} from "drizzle-orm/pg-core";
import {baseAuditColumn} from "./base-audit-column.schema";
import {baseIdColumn} from "./base-id-column.schema";

export const roles = pgTable('roles', {
    ...baseIdColumn(),
    name: varchar('name', {length: 50})
        .unique()
        .notNull(),
    createdAt: timestamp('created_at')
        .notNull()
        .defaultNow()
})