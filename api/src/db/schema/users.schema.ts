import {baseIdColumn} from "./base-id-column.schema";
import {baseAuditColumn} from "./base-audit-column.schema";
import {boolean, pgTable, varchar} from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    ...baseIdColumn(),
    phone: varchar('phone', {length: 11})
        .notNull()
        .unique(),
    email: varchar('email', {length: 255})
        .notNull()
        .unique(),
    passwordHash: varchar('password_hash'),
    isActive: boolean('is_active')
        .default(true)
        .notNull(),
    ...baseAuditColumn()
});