import {decimal, pgTable, varchar} from "drizzle-orm/pg-core";
import {baseIdColumn} from "./base-id-column.schema";
import {baseAuditColumn} from "./base-audit-column.schema";

export const vatRates = pgTable('vat_rates', {
    ...baseIdColumn(),
    name: varchar('name'),
    rate: decimal('rate', {
        precision: 5,
        scale: 2
    }).notNull(),
    ...baseAuditColumn()
})