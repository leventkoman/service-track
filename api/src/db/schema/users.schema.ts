import {baseIdColumn} from "./base-id-column.schema";
import {baseAuditColumn} from "./base-audit-column.schema";
import {boolean, pgTable, timestamp, uuid, varchar} from "drizzle-orm/pg-core";
import {userStatuses} from "./user-statuses.schema";

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
    statusId: uuid('status_id')
        .references(() => userStatuses.id),
    lastLoginTime: timestamp('last_login_time'),
    ...baseAuditColumn()
});