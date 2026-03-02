import {Request, response, Response} from "express";
import {StatusCodes} from "../enums/status-codes.enum";
import {db} from "../db";
import {and, eq, exists, sql} from "drizzle-orm";
import {
    customers,
    roles,
    serviceProviderCustomers, serviceProviders,
    userProfiles,
    userRoles,
    users
} from "../db/schema";
import {roleMatch, userProfileFields} from "../helpers/utils";
import e from "cors";
import {CustomerType} from "../enums/customer-type.enum";
import {Role} from "../enums/role.enum";

export class CustomerController {
    static async getAll(req: Request, res: Response) {
        try {
            const user = req.user!;
            const isSuperAdmin = roleMatch(user.roles, Role.SUPER_ADMIN);
            
            const customerResult = await db.query.customers.findMany({
               where: and(
                   eq(customers.isDeleted, false),
                   !isSuperAdmin ? exists(
                       db.select({val: sql`1`})
                           .from(serviceProviderCustomers)
                           .where(and(
                               eq(serviceProviderCustomers.customerId, customers.id),
                               eq(serviceProviderCustomers.serviceProviderId, user.serviceProviderId!),
                               eq(serviceProviderCustomers.isDeleted, false)
                           ))
                   ) : undefined
               ),
                columns: {
                   id: true,
                   customerType: true,
                   note: true, 
                },
                with: {
                   users: {
                       columns: {
                           email: true,
                           phone: true,
                       },
                       with: {
                           userProfile: {
                               columns: {
                                   ...userProfileFields()
                               }
                           }
                       }
                   },
                   serviceProviderCustomers: {
                        where: !isSuperAdmin ? eq(serviceProviderCustomers.serviceProviderId, user.serviceProviderId!) : undefined, 
                       columns: {
                           firstContactDate: true,
                       },
                       with: {
                           serviceProviders: {
                               columns: {
                                   isDeleted: false,
                                   createdAt: false,
                                   updatedAt: false,
                                   createdBy: false,
                               }
                           }
                       }
                   }
                }
            });
            
            const response = customerResult.map(({users, serviceProviderCustomers, ...customer}) => ({
                ...customer,
                email: users?.email,
                phone: users?.phone,
                ...users?.userProfile,
                serviceProviders: serviceProviderCustomers.map(({firstContactDate, serviceProviders}) => ({...serviceProviders, firstContactDate}))
            }));
            
            return res.status(StatusCodes.OK).json(response);
        } catch (e: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: e?.message ?? e});
        }
    }
    
    static async getCustomerById(req: Request, res: Response) {
        try {
            const user = req.user!;
            const customerId = req.params.id as string;
            const isSuperAdmin = roleMatch(user.roles, Role.SUPER_ADMIN);
            const findCustomer = await db.query.customers.findFirst({
                where: and(
                    eq(customers.id, customerId),
                    eq(customers.isDeleted, false),
                    !isSuperAdmin ? exists(
                        db.select({val: sql`1`})
                        .from(serviceProviderCustomers)
                        .where(and(
                            eq(serviceProviderCustomers.customerId, customerId),
                            eq(serviceProviderCustomers.serviceProviderId, user.serviceProviderId!),
                            eq(serviceProviderCustomers.isDeleted, false)
                        ))
                    ) : undefined
                ),
                columns: {
                    id: true,
                    customerType: true,
                    note: true,
                },
                with: {
                    users: {
                        columns: {
                            email: true,
                            phone: true,
                        },
                        with: {
                            userProfile: {
                                columns: {
                                    ...userProfileFields()
                                }
                            }
                        }
                    },
                    serviceProviderCustomers: {
                        where: and(
                            eq(serviceProviderCustomers.isDeleted, false), 
                            eq(serviceProviderCustomers.serviceProviderId, user.serviceProviderId!)
                        ),
                        columns: {
                            firstContactDate: true,
                        },
                        with: {
                            serviceProviders: {
                                columns: {
                                    isDeleted: false,
                                    createdAt: false,
                                    updatedAt: false,
                                    createdBy: false,
                                }
                            }
                        }
                    }
                }
            });
            
            if (!findCustomer) {
                return res.status(StatusCodes.NOT_FOUND).json({error: 'Müşteri bulunamadı'});
            }
            
            const { users, serviceProviderCustomers: spCustomers, ...customer } = findCustomer;
            const [spCustomer] = spCustomers;
            
            const response = {
                ...customer,
                email: users?.email,
                phone: users?.phone,
                ...users?.userProfile,
                serviceProvider: {
                    ...spCustomer?.serviceProviders,
                    firstContactDate: spCustomer?.firstContactDate
                }
            } 
            
            return res.status(StatusCodes.OK).json(response);
        } catch (e: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: e});
        }
    }
    
    // Todo: Eğer aynı müşteriyi farklı bir servis sağlayıcıda eklemek isterse 
    //  o müşteriyi bul ve phone ve email hariç alanlarıda userProfiles tablosunda güncelle.
    //  serviceProvidercustomers tablosuna kayıt at. 
    //  users, userRoles, ve customers tablosuna dokunma.
    static async createCustomer(req: Request, res: Response) {
        try {
            const user = req.user;
            const {customerType, note, email, phone, fullName, address, avatar, title, description} = req.body;
            await db.transaction(async (trx) => {
                const customerRole = await trx.query.roles.findFirst({
                    where: eq(roles.name, 'customer')
                });

                if (!customerRole) {
                    throw ({status: StatusCodes.NOT_FOUND, message: `Role not found.`}); 
                }

                const [userResult] = await trx.insert(users).values({
                    email,
                    phone,
                }).returning();

                if (!userResult) {
                    throw ({status: StatusCodes.NOT_FOUND, message: `User not found.`});
                }

                await trx.insert(userProfiles).values({
                    fullName,
                    address,
                    avatar,
                    title,
                    description,
                    userId: userResult.id
                });

                await trx.insert(userRoles).values({
                    userId: userResult.id,
                    roleId: customerRole.id
                })

                const [customerResult] = await trx.insert(customers).values({
                    customerType,
                    note,
                    userId: userResult.id,
                }).returning();

                if (!customerResult) {
                    throw ({status: StatusCodes.NOT_FOUND, message: `Customer not found.`});
                }

                await trx.insert(serviceProviderCustomers).values({
                   serviceProviderId: user?.serviceProviderId,
                   customerId: customerResult.id, 
                }).returning();
            })
            
            return res.status(StatusCodes.CREATED).send();
        } catch (e: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: e});
        }
    }
    
    static async updateCustomer(req: Request, res: Response) {
        try {
            const user = req.user!;
            const {customerType, note, email, phone, fullName, address, avatar, title, description, id} = req.body;
            await db.transaction(async (trx) => {
                const [customerResult] = await trx.update(customers).set({
                    customerType,
                    note,
                }).where(and(
                    eq(customers.id, id),
                    exists(
                        db.select({val: sql`1`})
                        .from(serviceProviderCustomers)
                        .where(and(
                            eq(serviceProviderCustomers.customerId, id),
                            eq(serviceProviderCustomers.serviceProviderId, user.serviceProviderId!)
                        ))
                    )
                )).returning();
                
                if (!customerResult) {
                    throw ({status: StatusCodes.NOT_FOUND, error: 'Müşteri bulunamadı.'})
                }
                
                const userResult = await trx.update(users).set({
                    phone,
                    email,
                }).where(eq(users.id, customerResult.userId!))

                if (userResult.rowCount === 0) {
                    throw ({ status: StatusCodes.NOT_FOUND, message: 'Kullanıcı bulunamadı.' });
                }
                
                const userProfileResult = await trx.update(userProfiles).set({
                    fullName,
                    address,
                    avatar,
                    title,
                    description
                }).where(eq(userProfiles.userId, customerResult.userId!));

                if (userProfileResult.rowCount === 0) {
                    throw ({ status: StatusCodes.NOT_FOUND, message: 'Kullanıcı profili bulunamadı.' });
                }
            })
            
            return res.status(StatusCodes.NO_CONTENT).send();
        } catch (e: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: e});
        }
    }

    static async deleteCustomer(req: Request, res: Response) {
        try {
            const user = req.user!;
            const customerId = req.params.id as string;
            const result = await db.update(serviceProviderCustomers).set({
                isDeleted: true,
            }).where(and(
                eq(serviceProviderCustomers.customerId, customerId),
                eq(serviceProviderCustomers.serviceProviderId, user.serviceProviderId!)
            ))
            
            if (result.rowCount === 0) {
                return res.status(StatusCodes.NOT_FOUND).json({error: 'Müşteri bulunamadı.'});
            }

            return res.status(StatusCodes.NO_CONTENT).send();
        } catch (e: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: e});
        }
    }
}