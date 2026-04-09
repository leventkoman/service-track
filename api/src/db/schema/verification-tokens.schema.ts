import {Schema} from "zod/v3";
import {boolean, pgTable, timestamp, uuid, varchar} from "drizzle-orm/pg-core";
import {baseIdColumn} from "./base-id-column.schema";
import {users} from "./users.schema";

export const verificationTokens = pgTable('verification_tokens', {
   ...baseIdColumn(),
    token: varchar('token')
        .notNull()
        .unique(),
    userId: uuid().references(() => users.id, {
        onDelete: 'set null'
    }),
    expiresAt: timestamp('expires_at')
        .notNull(),
    isUsed: boolean('is_used')
        .default(false),
    createdAt: timestamp('created_at')
        .defaultNow(),
});