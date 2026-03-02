import {pgTable, uuid, varchar} from "drizzle-orm/pg-core";
import {baseIdColumn} from "./base-id-column.schema";
import {baseAuditColumn} from "./base-audit-column.schema";
import {users} from "./users.schema";

export const serviceProviders = pgTable('service_providers', {
    ...baseIdColumn(),
    companyName: varchar('company_name', {length: 255}).notNull(),
    taxNumber: varchar('tax_id', {length: 11}).unique(),
    email: varchar('email', {length: 255}).notNull(),
    phone: varchar('phone', {length: 11}).notNull(),
    address: varchar('address', {length: 255}).notNull(),
    createdBy: uuid('created_by')
        .references(() => users.id, {
            onDelete: 'set null'
        }),
    ...baseAuditColumn()
});