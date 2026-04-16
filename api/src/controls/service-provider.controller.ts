import {NextFunction, Request, Response} from "express";
import {StatusCodes} from "../enums/status-codes.enum";
import {db} from "../db";
import {employeeProfiles, serviceProviders, subscriptionPlans, subscriptions} from "../db/schema";
import {and, eq} from "drizzle-orm";
import {generateToken, roleMatch, setAccessTokenCookie, userProfileFields} from "../helpers/utils";
import {Role} from "../enums/role.enum";

export class ServiceProviderController {
    // Todo: Only for super_admin role
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user!;
            const isSuperAdmin = roleMatch(user.roles, Role.SUPER_ADMIN);
            const spList = await db.query.serviceProviders.findMany({
                where: and(
                    eq(serviceProviders.isDeleted, false),
                    !isSuperAdmin ? 
                    eq(serviceProviders.id, user.serviceProviderId!)
                        : undefined,
                ),
                columns: { isDeleted: false },
                with: {
                    createdBy: {
                        columns: {
                            id: true, 
                            email: true,
                            phone: true,
                        },
                        with: {
                            userProfile: {
                                columns: { ...userProfileFields() }
                            }
                        }
                    }
                }
            });
            const response = spList.map((sp) => ({
                ...sp,
                createdBy: {
                    id: sp.createdBy?.id,
                    email: sp.createdBy?.email,
                    phone: sp.createdBy?.phone,
                    ...sp.createdBy?.userProfile,
                }
            }));
            
            return res.status(StatusCodes.OK).json(response);
        } catch (e: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: e?.message ?? e });
        }
    }
    
    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user!;
            const isSuperAdmin = roleMatch(user.roles, Role.SUPER_ADMIN);
            const id = req.params.id as string;
            const sp = await db.query.serviceProviders.findFirst({
                where: and(
                    eq(serviceProviders.isDeleted, false),
                    eq(serviceProviders.id, id),
                    !isSuperAdmin ? eq(serviceProviders.createdBy, user.userId) : undefined
                ),
                columns: { isDeleted: false },
                with: {
                    createdBy: {
                        columns: {
                            id: true,
                            email: true,
                            phone: true,
                        },
                        with: {
                            userProfile: {
                                columns: { ...userProfileFields() }
                            }
                        }
                    }
                }
            })
            if (!sp) {
                return res.status(StatusCodes.NOT_FOUND).json({error: 'Servis provider bulunamadı.'})
            }
            
            const {createdBy, ...safeSp} = sp;
            const response = {
                ...safeSp,
                createdBy: {
                    id: createdBy?.id,
                    email: createdBy?.email,
                    phone: createdBy?.phone,
                    ...createdBy?.userProfile,
                }
            }
            
            return res.status(StatusCodes.OK).json(response);
        } catch (e: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: e });
        }
    }
    
    static async createServiceProvider(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user!;
            const {companyName, taxNumber, email, phone, address} = req.body;
            await db.transaction(async (trx) => {
                const [spResult] = await trx.insert(serviceProviders).values({
                    companyName,
                    taxNumber,
                    email,
                    phone,
                    address,
                    createdBy: user?.userId
                }).returning();

                if (!spResult || !spResult.createdBy) {
                    throw ({status: StatusCodes.NOT_FOUND, message: `Service provider not found.`});
                }
                
                await trx.insert(employeeProfiles).values({
                    employeeId: spResult.createdBy,
                    serviceProviderId: spResult.id
                });
                
                const freePlan = await db.query.subscriptionPlans.findFirst({
                    where: (and(
                        eq(subscriptionPlans.isDeleted, false),
                        eq(subscriptionPlans.planType, 'freeTrial')
                    ))
                });
                
                if (!freePlan) {return;}
                
                await trx.insert(subscriptions).values({
                    planId: freePlan.id,
                    serviceProviderId: spResult.id,
                    startDate: new Date(),
                    endDate: new Date(Date.now() + freePlan.duration * 24 * 60 * 60 * 1000)
                })
                
                const payload = {
                    userId: user.userId,
                    phone: user.phone,
                    email: user.email,
                    roles: user.roles,
                    serviceProviderId: spResult.id
                }
                const newAccessToken = generateToken(payload);
                
                setAccessTokenCookie(res, newAccessToken);
            })
            
            return res.status(StatusCodes.CREATED).send();
        } catch (e: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: e.message ?? e });
        }
    }
    
    static async updateServiceProvider(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user!;
            const {id, companyName, taxNumber, email, phone, address} = req.body;
            const result = await db.update(serviceProviders).set({
                companyName,
                taxNumber,
                email,
                phone,
                address,
            }).where(and(
                eq(serviceProviders.id, id),
                eq(serviceProviders.createdBy, user.userId)
            ));
            
            if (result.rowCount === 0) {
                return res.status(StatusCodes.NOT_FOUND).json({error: 'Servis provider bulunamadı.'})
            }
            
            return res.status(StatusCodes.NO_CONTENT).send();
        } catch (e: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: e });
        }
    }
    
    static async deleteServiceProvider(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user!;
            const id = req.params.id as string;
            
            const result = await db.update(serviceProviders).set({
                isDeleted: true
            }).where(and(
                eq(serviceProviders.id, id),
                eq(serviceProviders.createdBy, user.userId)
            ));
            
            if (result.rowCount === 0) {
                return res.status(StatusCodes.NOT_FOUND).json({error: 'Servis sağlayıcı bulunamadı.'})
            }

            return res.status(StatusCodes.NO_CONTENT).send();
        } catch (e: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: e });
        }
    }
}