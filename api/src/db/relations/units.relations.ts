import {relations} from "drizzle-orm";
import {serviceItems, units} from "../schema";

export const unitsRelations = relations(units, ({many}) => ({
    serviceItem: many(serviceItems),
}))