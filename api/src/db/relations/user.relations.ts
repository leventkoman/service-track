import {relations} from "drizzle-orm";
import {
    customers,
    employeeProfiles,
    serviceProviders,
    serviceRequestEmployees,
    serviceRequests,
    userProfiles,
    userRoles,
    users, userStatuses
} from "../schema";
import {verificationTokens} from "../schema/verification-tokens.schema";

export const userRelations = relations(users, ({one, many}) => ({
    userProfile: one(userProfiles, {
        fields: [users.id],
        references: [userProfiles.userId]
    }),
    employeeProfile: one(employeeProfiles, {
        fields: [users.id],
        references: [employeeProfiles.employeeId]
    }),
    status: one(userStatuses, {
        fields: [users.statusId],
        references: [userStatuses.id]
    }),
    verificationTokens: many(users),
    userRoles: many(userRoles),
    customers: many(customers),
    serviceProviders: many(serviceProviders),
    serviceRequests: many(serviceRequests),
    serviceRequestEmployees: many(serviceRequestEmployees),
}));