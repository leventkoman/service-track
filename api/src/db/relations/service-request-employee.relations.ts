import {relations} from "drizzle-orm";
import {serviceRequestEmployees, serviceRequests, users} from "../schema";

export const serviceRequestEmployeeRelations = relations(serviceRequestEmployees, ({one}) => ({
    serviceRequest: one(serviceRequests, {
        fields: [serviceRequestEmployees.serviceRequestId],
        references: [serviceRequests.id]
    }),
    user: one(users, {
        fields: [serviceRequestEmployees.employeeId],
        references: [users.id]
    })
}))