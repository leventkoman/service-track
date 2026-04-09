import {relations} from "drizzle-orm";
import {users, verificationTokens} from "../schema";

export const verificationTokensRelations = relations(verificationTokens, ({one}) => ({
    user: one(users, {
        fields: [verificationTokens.userId],
        references: [users.id],
    })
}));