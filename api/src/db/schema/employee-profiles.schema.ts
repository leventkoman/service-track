import {pgTable, primaryKey, unique, uuid, varchar} from "drizzle-orm/pg-core";
import {users} from "./users.schema";
import {serviceProviders} from "./service-providers.schema";

export const employeeProfiles = pgTable('employee_profiles', {
        employeeId: uuid('employee_id')
            .notNull()
            .unique()
            .references(() => users.id, {
                onDelete: 'cascade'
            }),
        serviceProviderId: uuid('service_provider_id')
            .notNull()
            .references(() => serviceProviders.id, {
                onDelete: 'cascade'
            }),
    },
    (t) => [
        primaryKey({columns: [t.employeeId, t.serviceProviderId]})
    ]
);