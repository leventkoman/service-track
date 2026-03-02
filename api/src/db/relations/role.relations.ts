import {relations} from "drizzle-orm";
import {roles, userRoles} from "../schema";

export const roleRelations = relations(roles, ({many}) => ({
    userRoles: many(userRoles)
}))