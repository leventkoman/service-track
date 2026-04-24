import {Request, Response} from "express";
import {StatusCodes} from "../enums/status-codes.enum";
import {db} from "../db";
import {
    employeeProfiles,
    serviceProviderCustomers,
    serviceProviders,
    serviceRequests,
    serviceRequestStatuses, subscriptions,
    users
} from "../db/schema";
import {and, eq, sql} from "drizzle-orm";
import {roleMatch} from "../helpers/utils";
import {Role} from "../enums/role.enum";

export class DashboardController {
    static async getStats(req: Request, res: Response) {
        try {
            const user = req.user;
            const isSuperAdmin = roleMatch(user?.roles!, Role.SUPER_ADMIN); 
            const [userCount] = await db
                .select({
                    total:  sql`count(*)`.mapWith(Number),
                    active:  sql`count(*) filter (where ${users.isActive} = true)`.mapWith(Number) ,
                    passive:  sql`count(*) filter (where ${users.isActive} = false)`.mapWith(Number) ,
                })
                .from(employeeProfiles)
                .leftJoin(serviceProviders, eq(employeeProfiles.serviceProviderId, serviceProviders.id))
                .leftJoin(users, eq(employeeProfiles.employeeId, users.id))
                .where(and(
                    eq(users.isDeleted, false),
                    !isSuperAdmin ? 
                        eq(employeeProfiles.serviceProviderId, user?.serviceProviderId!) : undefined,
                ));
            
            const [customers] = await db
                .select({
                    total:  sql`count(*)`.mapWith(Number),
                })
                .from(serviceProviderCustomers)
                .where(
                    and(
                        eq(serviceProviderCustomers.isDeleted, false),
                        !isSuperAdmin ?
                        eq(serviceProviderCustomers.serviceProviderId, user?.serviceProviderId!)
                        : undefined,
                    )
                )

            const statusCounts = !isSuperAdmin ? await db
                .select({
                    name: serviceRequestStatuses.name,
                    nameLocalized: serviceRequestStatuses.nameLocalized,
                    count: sql`count(${serviceRequests.id})`.mapWith(Number),
                })
                .from(serviceRequestStatuses)
                .leftJoin(
                    serviceRequests,
                    and(
                        eq(serviceRequests.serviceRequestStatusId, serviceRequestStatuses.id),
                        eq(serviceRequests.isDeleted, false),
                        eq(serviceRequests.serviceProviderId, user?.serviceProviderId!)
                    )
                )
                .where(eq(serviceRequestStatuses.isDeleted, false))
                .groupBy(serviceRequestStatuses.id)
                .orderBy(serviceRequestStatuses.sortOrder)
                : [];
            
            const [revenue] = await db
                .select({
                    totalRevenue: sql`coalesce(sum(${serviceRequests.totalAmount}), 0)`.mapWith(Number),
                })
                .from(serviceRequests)
                .where(and(
                    eq(serviceRequests.isDeleted, false),
                    !isSuperAdmin ?
                    eq(serviceRequests.serviceProviderId, user?.serviceProviderId!)
                        : undefined,
                ));

            const [spCount] = isSuperAdmin ? await db
                .select({
                    count: sql`count(*)`.mapWith(Number),
                })
                .from(serviceProviders)
                .where(eq(serviceProviders.isDeleted, false)) 
                : [];
            
            const [subsCount] = isSuperAdmin ? await db
                .select({
                    total:  sql`count(*)`.mapWith(Number),
                    active: sql`count(*) filter (where ${subscriptions.isActive} = true)`.mapWith(Number),
                })
                .from(subscriptions)
                .where(and(
                    eq(subscriptions.isDeleted, false),
                )) 
                : [];
            
            const stats = {
                users: {
                    total: userCount?.total,
                    active: userCount?.active,
                    passive: userCount?.passive,
                },
                customerCount: customers?.total,
                revenueTotal: revenue?.totalRevenue,
                serviceProviderCount: isSuperAdmin ? spCount?.count : null,
                subscriptionCount : isSuperAdmin ? {
                    total: subsCount?.total,
                    active: subsCount?.active,
                } : null,
                serviceRequests: !isSuperAdmin ? 
                    statusCounts.map((status) => ({
                    name: status.name,
                    nameLocalized: status.nameLocalized,
                    count: status.count,
                }))
                : null,
            };            
            
            return res.status(StatusCodes.OK).send(stats);
        } catch (e: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: e});
        }
    }
}