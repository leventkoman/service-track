import {relations} from "drizzle-orm";
import {userProfiles, userRoles, users} from "../schema";

export const userProfileRelations = relations(userProfiles, ({one}) => ({
    user: one(users, {
        fields: [userProfiles.userId],
        references: [users.id]
    }),
}))