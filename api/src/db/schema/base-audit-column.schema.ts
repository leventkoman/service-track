import {boolean, timestamp} from "drizzle-orm/pg-core";
import {sql} from "drizzle-orm";

export function baseAuditColumn() {
    return {
        isDeleted: boolean('is_deleted').default(false).notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at').default(sql`NULL`).$onUpdate(() => new Date())
    }
}