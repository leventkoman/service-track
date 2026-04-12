import {pgTable, varchar} from "drizzle-orm/pg-core";
import {baseIdColumn} from "./base-id-column.schema";
import {baseAuditColumn} from "./base-audit-column.schema";

export const units = pgTable('units', {
    ...baseIdColumn(),
    name: varchar('name', {length: 255}).notNull(),
    code: varchar('code', {length: 255})
        .notNull()
        .unique(),
    ...baseAuditColumn()
})