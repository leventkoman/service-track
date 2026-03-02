import {decimal, pgTable} from "drizzle-orm/pg-core";
import {baseIdColumn} from "./base-id-column.schema";
import {baseAuditColumn} from "./base-audit-column.schema";

export const vatRates = pgTable('vat_rates', {
    ...baseIdColumn(),
    rate: decimal('rate', {
        precision: 5,
        scale: 2
    }).notNull(),
    ...baseAuditColumn()
})