import {relations} from "drizzle-orm";
import {employeeProfiles, serviceProviders, users} from "../schema";

export const employeeProfilesRelations = relations(employeeProfiles, ({one}) => ({
    employeeId: one(users, {
        fields: [employeeProfiles.employeeId],
        references: [users.id]
    }),
    serviceProviders: one(serviceProviders, {
        fields: [employeeProfiles.employeeId],
        references: [serviceProviders.id]
    })
}))