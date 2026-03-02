import {relations} from "drizzle-orm";
import {serviceItems, serviceRequests, units, vatRates} from "../schema";

export const serviceItemsRelations = relations(serviceItems, ({one}) => ({
    unit: one(units, {
        fields: [serviceItems.unitId],
        references: [units.id]
    }),
    vatRate: one(vatRates, {
        fields: [serviceItems.vatRateId],
        references: [vatRates.id]
    }),
    serviceRequest: one(serviceRequests, {
        fields: [serviceItems.serviceRequestId],
        references: [serviceRequests.id]
    }),
}))