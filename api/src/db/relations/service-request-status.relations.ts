import {relations} from "drizzle-orm";
import {serviceRequests, serviceRequestStatuses} from "../schema";

export const serviceRequestStatusRelations = relations(serviceRequestStatuses, ({many}) => ({
    serviceRequest: many(serviceRequests)
}))