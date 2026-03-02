import {relations} from "drizzle-orm";
import {serviceItems, vatRates} from "../schema";

export const vatRatesRelations = relations(vatRates, ({many}) => ({
    serviceItem: many(serviceItems),
}));