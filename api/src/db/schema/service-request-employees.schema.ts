import {pgTable, primaryKey, uuid} from "drizzle-orm/pg-core";
import {users} from "./users.schema";
import {serviceRequests} from "./service_requests.schema";

export const serviceRequestEmployees = pgTable('service_request_employees', {
        employeeId: uuid('employee_id')
            .notNull()
            .references(() => users.id, {
                onDelete: 'cascade'
            }),
        serviceRequestId: uuid('service_request_id')
            .notNull()
            .references(() => serviceRequests.id, {
                onDelete: 'cascade'
            }),
    },
    (t => [
        primaryKey({
            columns: [t.employeeId, t.serviceRequestId]
        })
    ])
)