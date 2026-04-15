import {decimal, index, integer, pgTable, primaryKey, uuid, varchar} from "drizzle-orm/pg-core";
import {baseIdColumn} from "./base-id-column.schema";
import {serviceRequests} from "./service-requests.schema";
import {units} from "./units.schema";
import {vatRates} from "./vat-rates.schema";
import {baseAuditColumn} from "./base-audit-column.schema";

export const serviceItems = pgTable('service_items', {
    ...baseIdColumn(),
    itemName: varchar('item_name').notNull(),
    quantity: integer('quantity').notNull(),
    lineTotal: decimal('line_total', {precision: 10, scale: 2}).notNull(),
    unitPrice: decimal('unit_price', {precision: 10, scale: 2}).notNull(),
    itemPrice: decimal('item_price', {precision: 10, scale: 2}).notNull(),
    vatRatePrice: decimal('vat_rate_price', {precision: 10, scale: 2}).notNull(),
    serviceRequestId: uuid('service_request_id')
        .references(() => serviceRequests.id, {
            onDelete: 'set null'
        }),
    unitId: uuid('unit_id')
        .references(() => units.id, {
            onDelete: 'set null'
        }),
    vatRateId: uuid('vat_rate_id')
        .references(() => vatRates.id, {
            onDelete: 'set null'
        }),
    ...baseAuditColumn()
},
    // (t => [
    //     primaryKey({
    //         columns: [t.serviceRequestId, t.unitId, t.vatRateId]
    //     }),
    //     index('idx_service_items_sr').on(t.serviceRequestId),
    //     index('idx_service_items_unit').on(t.unitId),
    //     index('idx_service_items_vr').on(t.vatRateId),
    // ])
)