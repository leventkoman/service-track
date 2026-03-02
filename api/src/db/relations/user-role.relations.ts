import {relations} from "drizzle-orm";
import {roles, userRoles, users} from "../schema";

export const userRoleRelations = relations(userRoles, ({one}) => ({
    user: one(users, {
        fields: [userRoles.userId],
        references: [users.id]
    }),
    role: one(roles, {
        fields: [userRoles.roleId],
        references: [roles.id]
    })
}))