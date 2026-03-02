import {pgTable, primaryKey, timestamp, uuid} from "drizzle-orm/pg-core";
import {baseIdColumn} from "./base-id-column.schema";
import {serviceProviders} from "./service-providers.schema";
import {customers} from "./customers.schema";
import {baseAuditColumn} from "./base-audit-column.schema";

export const serviceProviderCustomers = pgTable('service_provider_customers', {
        ...baseIdColumn(),
        serviceProviderId: uuid('service_provider_id')
            .references(() => serviceProviders.id, {
                onDelete: 'set null'
            }),
        customerId: uuid('customer_id')
            .references(() => customers.id, {
                onDelete: 'set null'
            }),
        firstContactDate: timestamp('first_contact_date')
            .notNull()
            .defaultNow(),
        ...baseAuditColumn(),
    },
    // (t => [
    //     primaryKey({columns: [t.customerId, t.serviceProviderId]})
    // ])
)