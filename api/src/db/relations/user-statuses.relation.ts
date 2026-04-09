import {relations} from "drizzle-orm";
import {users, userStatuses} from "../schema";

export const userStatusesRelation = relations(userStatuses, ({many}) => ({
    users: many(users)
}))