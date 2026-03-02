import {pgEnum, pgTable, text, uuid, varchar} from "drizzle-orm/pg-core";
import {relations} from 'drizzle-orm';
import {baseIdColumn} from "./base-id-column.schema";
import {users} from "./users.schema";
import {baseAuditColumn} from "./base-audit-column.schema";

export const customerTypeEnum = pgEnum('customer_type', [
    'individual',
    'corporate'
])

export const customers = pgTable('customers', {
    ...baseIdColumn(),
    customerType: customerTypeEnum('customer_type').notNull(),
    note: varchar('note', {length: 255}),
    userId: uuid('user_id').references(() => users.id, {
        onDelete: 'set null'
    }),
    ...baseAuditColumn(),
});