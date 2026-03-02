import {pgTable, uuid, varchar} from "drizzle-orm/pg-core";
import {baseIdColumn} from "./base-id-column.schema";
import {users} from "./users.schema";
import {baseAuditColumn} from "./base-audit-column.schema";

export const userProfiles = pgTable('user_profiles', {
    ...baseIdColumn(),
    fullName: varchar('full_name', {length: 255}).notNull(),
    address: varchar('address', {length: 255}).notNull(),
    title: varchar('title', {length: 50}),
    avatar: varchar('avatar', {length: 255}),
    description: varchar('description', {length: 500}),
    userId: uuid('user_id')
        .unique()
        .references(() => users.id,
            {
                onUpdate: 'cascade',
                onDelete: 'cascade'
            }),
    ...baseAuditColumn()
})