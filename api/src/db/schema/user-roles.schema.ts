import {pgTable, primaryKey, uuid, varchar} from "drizzle-orm/pg-core";
import {users} from "./users.schema";
import {roles} from "./roles.schema";
import {userProfiles} from "./user-profiles.schema";
import {serviceProviders} from "./service-providers.schema";

export const userRoles = pgTable('user_roles', {
        userId: uuid('user_id')
            .notNull()
            .references(() => users.id, {onDelete: 'cascade'}),
        roleId: uuid('role_id')
            .notNull()
            .references(() => roles.id, {onDelete: 'cascade'}),
    },
    (t => [
        primaryKey({columns: [t.userId, t.roleId]})
    ])
)

// Tüm relations tanımlamaları
// const relations = defineRelations({
//     users,
//     roles,
//     userRoles,
//     userProfiles,
//     serviceProviders,
//     customers,
//     serviceProviderCustomers,
//     employeeProfiles,
//     serviceRequestStatuses,
//     serviceRequests,
//     serviceRequestEmployees,
//     units,
//     vatRates,
//     serviceItems,
// }, (r) => ({
//     // USERS RELATIONS
//     users: {
//         // One-to-one: Kullanıcı profili
//         profile: r.one.userProfiles({
//             from: r.users.id,
//             to: r.userProfiles.userId,
//         }),
//
//         // Many-to-many: Kullanıcı rolleri
//         userRoles: r.many.userRoles({
//             from: r.users.id,
//             to: r.userRoles.userId,
//         }),
//
//         // One-to-many: Kullanıcının oluşturduğu servis sağlayıcılar
//         createdServiceProviders: r.many.serviceProviders({
//             from: r.users.id,
//             to: r.serviceProviders.createdBy,
//         }),
//
//         // One-to-many: Kullanıcının oluşturduğu servis talepleri
//         createdServiceRequests: r.many.serviceRequests({
//             from: r.users.id,
//             to: r.serviceRequests.createdBy,
//         }),
//
//         // One-to-many: Kullanıcının müşteri kayıtları
//         customers: r.many.customers({
//             from: r.users.id,
//             to: r.customers.userId,
//         }),
//
//         // Many-to-many: Kullanıcının çalıştığı servis talepleri (employee olarak)
//         assignedServiceRequests: r.many.serviceRequestEmployees({
//             from: r.users.id,
//             to: r.serviceRequestEmployees.employeeId,
//         }),
//
//         // Many-to-many: Kullanıcının çalıştığı servis sağlayıcılar (employee olarak)
//         employeeProfiles: r.many.employeeProfiles({
//             from: r.users.id,
//             to: r.employeeProfiles.employeeId,
//         }),
//     },
//
//     // ROLES RELATIONS
//     roles: {
//         // Many-to-many: Role sahip kullanıcılar
//         userRoles: r.many.userRoles({
//             from: r.roles.id,
//             to: r.userRoles.roleId,
//         }),
//     },
//
//     // USER ROLES RELATIONS
//     userRoles: {
//         user: r.one.users({
//             from: r.userRoles.userId,
//             to: r.users.id,
//         }),
//         role: r.one.roles({
//             from: r.userRoles.roleId,
//             to: r.roles.id,
//         }),
//     },
//
//     // USER PROFILES RELATIONS
//     userProfiles: {
//         user: r.one.users({
//             from: r.userProfiles.userId,
//             to: r.users.id,
//         }),
//     },
//
//     // SERVICE PROVIDERS RELATIONS
//     serviceProviders: {
//         // One-to-many: Servis sağlayıcının çalışanları
//         employeeProfiles: r.many.employeeProfiles({
//             from: r.serviceProviders.id,
//             to: r.employeeProfiles.serviceProviderId,
//         }),
//
//         // One-to-many: Servis sağlayıcının müşteri ilişkileri
//         customerRelations: r.many.serviceProviderCustomers({
//             from: r.serviceProviders.id,
//             to: r.serviceProviderCustomers.serviceProviderId,
//         }),
//
//         // One-to-many: Servis sağlayıcının servis talepleri
//         serviceRequests: r.many.serviceRequests({
//             from: r.serviceProviders.id,
//             to: r.serviceRequests.serviceProviderId,
//         }),
//
//         // Many-to-one: Servis sağlayıcıyı oluşturan kullanıcı
//         createdBy: r.one.users({
//             from: r.serviceProviders.createdBy,
//             to: r.users.id,
//         }),
//     },
//
//     // CUSTOMERS RELATIONS
//     customers: {
//         // Many-to-one: Müşterinin bağlı olduğu kullanıcı
//         user: r.one.users({
//             from: r.customers.userId,
//             to: r.users.id,
//         }),
//
//         // One-to-many: Müşterinin servis sağlayıcı ilişkileri
//         serviceProviderRelations: r.many.serviceProviderCustomers({
//             from: r.customers.id,
//             to: r.serviceProviderCustomers.customerId,
//         }),
//
//         // One-to-many: Müşterinin servis talepleri
//         serviceRequests: r.many.serviceRequests({
//             from: r.customers.id,
//             to: r.serviceRequests.customerId,
//         }),
//     },
//
//     // SERVICE PROVIDER CUSTOMERS RELATIONS
//     serviceProviderCustomers: {
//         serviceProvider: r.one.serviceProviders({
//             from: r.serviceProviderCustomers.serviceProviderId,
//             to: r.serviceProviders.id,
//         }),
//         customer: r.one.customers({
//             from: r.serviceProviderCustomers.customerId,
//             to: r.customers.id,
//         }),
//     },
//
//     // EMPLOYEE PROFILES RELATIONS
//     employeeProfiles: {
//         employee: r.one.users({
//             from: r.employeeProfiles.employeeId,
//             to: r.users.id,
//         }),
//         serviceProvider: r.one.serviceProviders({
//             from: r.employeeProfiles.serviceProviderId,
//             to: r.serviceProviders.id,
//         }),
//     },
//
//     // SERVICE REQUEST STATUSES RELATIONS
//     serviceRequestStatuses: {
//         serviceRequests: r.many.serviceRequests({
//             from: r.serviceRequestStatuses.id,
//             to: r.serviceRequests.serviceRequestStatusId,
//         }),
//     },
//
//     // SERVICE REQUESTS RELATIONS
//     serviceRequests: {
//         status: r.one.serviceRequestStatuses({
//             from: r.serviceRequests.serviceRequestStatusId,
//             to: r.serviceRequestStatuses.id,
//         }),
//         serviceProvider: r.one.serviceProviders({
//             from: r.serviceRequests.serviceProviderId,
//             to: r.serviceProviders.id,
//         }),
//         customer: r.one.customers({
//             from: r.serviceRequests.customerId,
//             to: r.customers.id,
//         }),
//         createdByUser: r.one.users({
//             from: r.serviceRequests.createdBy,
//             to: r.users.id,
//         }),
//         // One-to-many: Servis talebinin kalemleri
//         serviceItems: r.many.serviceItems({
//             from: r.serviceRequests.id,
//             to: r.serviceItems.serviceRequestId,
//         }),
//         // Many-to-many: Servis talebine atanan çalışanlar
//         assignedEmployees: r.many.serviceRequestEmployees({
//             from: r.serviceRequests.id,
//             to: r.serviceRequestEmployees.serviceRequestId,
//         }),
//     },
//
//     // SERVICE REQUEST EMPLOYEES RELATIONS
//     serviceRequestEmployees: {
//         employee: r.one.users({
//             from: r.serviceRequestEmployees.employeeId,
//             to: r.users.id,
//         }),
//         serviceRequest: r.one.serviceRequests({
//             from: r.serviceRequestEmployees.serviceRequestId,
//             to: r.serviceRequests.id,
//         }),
//     },
//
//     // UNITS RELATIONS
//     units: {
//         serviceItems: r.many.serviceItems({
//             from: r.units.id,
//             to: r.serviceItems.unitId,
//         }),
//     },
//
//     // VAT RATES RELATIONS
//     vatRates: {
//         serviceItems: r.many.serviceItems({
//             from: r.vatRates.id,
//             to: r.serviceItems.vatRateId,
//         }),
//     },
//
//     // SERVICE ITEMS RELATIONS
//     serviceItems: {
//         serviceRequest: r.one.serviceRequests({
//             from: r.serviceItems.serviceRequestId,
//             to: r.serviceRequests.id,
//         }),
//         unit: r.one.units({
//             from: r.serviceItems.unitId,
//             to: r.units.id,
//         }),
//         vatRate: r.one.vatRates({
//             from: r.serviceItems.vatRateId,
//             to: r.vatRates.id,
//         }),
//     },
// }));