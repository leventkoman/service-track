import {NextFunction, Request, Response} from "express";
import {db} from "../db";
import {
    employeeProfiles,
    roles,
    userProfiles,
    userRoles,
    users, userStatuses,
    verificationTokens
} from "../db/schema";
import {roles as roleSchema} from "../db/schema";
import {and, eq, exists, inArray, ne, notExists, sql} from "drizzle-orm";
import {StatusCodes} from "../enums/status-codes.enum";
import {
    generatePasswordToken,
    mapUserInformation,
    roleMatch, set24Hours,
    setupPasswordUrl,
    userProfileFields
} from "../helpers/utils";
import {Role} from "../enums/role.enum";
import {mailService} from "../services/mail.service";
import {passwordSetupTemplate} from "../templates/mail.template";
import {UserStatus} from "../enums/user-status.enum";

// Todo: add user status active, pending, inactive, deleted, locked.
export class UserController {
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user!;
            const isSuperAdmin = roleMatch(user.roles, Role.SUPER_ADMIN);

            const userList = await db.query.users.findMany({
                where: and(
                    // eq(users.isActive, true),
                    eq(users.isDeleted, false),
                    isSuperAdmin ?
                        ne(users.id, user.userId) : undefined,
                    notExists(
                        db.select({val: sql`1`})
                            .from(userRoles)
                            .innerJoin(roles, eq(userRoles.roleId, roles.id))
                            .where(
                                and(
                                    eq(roles.name, Role.CUSTOMER),
                                    eq(userRoles.userId, users.id),
                                )
                            )
                    ),
                    !isSuperAdmin ?
                        exists(
                            db.select({val: sql`1`})
                                .from(employeeProfiles)
                                .where(
                                    and(
                                        eq(employeeProfiles.employeeId, users.id),
                                        eq(employeeProfiles.serviceProviderId, user.serviceProviderId!),
                                    )
                                )
                        ) : undefined
                ),
                columns: {
                    id: true,
                    phone: true,
                    email: true,
                    lastLoginTime: true
                },
                with: {
                    userProfile: {
                        columns: {
                            id: false,
                            userId: false,
                            isDeleted: false,
                            createdAt: false,
                            updatedAt: false,
                        }
                    },
                    userRoles: {
                        columns: {
                            userId: false,
                            roleId: false,
                        },
                        with: {
                            role: {
                                columns: {
                                    name: true
                                }
                            }
                        }
                    },
                    status: {
                        columns: {
                            name: true,
                            nameLocalized: true,
                        }
                    }
                }
            });

            const response = mapUserInformation(userList);

            return res.status(StatusCodes.OK).json(response);
        } catch (e) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: e});
        }
    }

    static async getByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user!;
            const id = req.params.id as string;
            const isSuperAdmin = roleMatch(user.roles, Role.SUPER_ADMIN);
            const isAdmin = roleMatch(user.roles, Role.ADMIN);

            if (user.userId !== id) {
                // if (isSuperAdmin) {
                //     if (isAdmin) {
                //         const employee = await db.query.employeeProfiles.findFirst({
                //             where: and(
                //                 eq(employeeProfiles.employeeId, id),
                //                 eq(employeeProfiles.serviceProviderId, user.serviceProviderId!)
                //             )
                //         });
                //         if (!employee) {
                //             return res.status(StatusCodes.UNAUTHORIZED).json({error: 'Yetkisiz işlem'});
                //         }
                //     } else {
                //         return res.status(StatusCodes.UNAUTHORIZED).json({error: 'Yetkisiz işlem'});
                //     }
                // }
                const employee = await db.query.employeeProfiles.findFirst({
                    where: and(
                        eq(employeeProfiles.employeeId, id),
                        eq(employeeProfiles.serviceProviderId, user.serviceProviderId!)
                    )
                });
            }

            const userDetail = await db.query.users.findMany({
                where: and(
                    eq(users.isDeleted, false),
                    // eq(users.isActive, true),
                    eq(users.id, id),
                ),
                columns: {
                    id: true,
                    phone: true,
                    email: true,
                },
                with: {
                    userProfile: {
                        columns: {
                            ...userProfileFields()
                        }
                    },
                    userRoles: {
                        with: {
                            role: {
                                columns: {
                                    name: true,
                                }
                            }
                        }
                    }
                }
            });

            if (userDetail.length === 0) return res.status(StatusCodes.NOT_FOUND).json({error: 'Kullanıcı bulunamadı.'});
            const [response] = mapUserInformation(userDetail);

            return res.status(StatusCodes.OK).json(response)
        } catch (e: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: e.message ?? e});
        }
    }

    static async createUser(req: Request, res: Response) {
        try {
            const user = req.user!;
            const {email, phone, fullName, address, title, avatar, description} = req.body;

            const isExist = await db.query.users.findFirst({
                where: eq(users.phone, phone),
                columns: {
                    phone: true,
                }
            });

            if (isExist) return res.status(StatusCodes.CONFLICT).json({error: 'Kullanıcı zaten sistemde mevcut.'});

            const isSuperAdmin = roleMatch(user.roles, Role.SUPER_ADMIN);
            const isAdmin = roleMatch(user.roles, Role.ADMIN);

            const roleIds = await db.query.roles.findMany({
                where: inArray(roleSchema.name, isSuperAdmin ? ['admin', 'employee'] : ['employee']),
                columns: {id: true}
            });
            if (!roleIds.length) return res.status(StatusCodes.BAD_REQUEST).json({error: 'Geçersiz rol.'});
            let passwordToken = '';
            let newUserId = '';
            const pendingStatus = await db.query.userStatuses.findFirst({
                where: eq(userStatuses.name, UserStatus.PENDING),
                columns: {id: true}
            })

            await db.transaction(async (trx) => {
                const [newUser] = await trx.insert(users).values({
                    email,
                    phone,
                    passwordHash: null,
                    isActive: false,
                    statusId: pendingStatus?.id
                }).returning();

                if (!newUser) throw new Error('Kullanıcı oluşturulamadı.')

                await trx.insert(userProfiles).values({
                    fullName,
                    address,
                    title,
                    avatar,
                    description,
                    userId: newUser?.id
                });

                await trx.insert(userRoles).values(
                    roleIds.map((role) => ({
                        userId: newUser.id,
                        roleId: role.id
                    }))
                )

                if (isAdmin) {
                    await trx.insert(employeeProfiles).values({
                        serviceProviderId: user.serviceProviderId!,
                        employeeId: newUser.id
                    })
                }

                const token = generatePasswordToken();
                
                passwordToken = token;
                newUserId = newUser.id;
                
                await trx.insert(verificationTokens).values({
                    token,
                    userId: newUser.id,
                    expiresAt: set24Hours(),
                });
            });

            const setupUrl = setupPasswordUrl(newUserId, passwordToken)
            await mailService(email, 'Hesabınızı aktivite edin', passwordSetupTemplate(fullName, setupUrl));

            return res.status(StatusCodes.CREATED).json({message: 'Kullanıcı başarılı bir şekide oluşturuldu.'});
        } catch (e: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: e?.message ?? e});
        }
    }

    static async deleteUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user!;
            const id = req.params.id as string;
            const isAdmin = roleMatch(user.roles, Role.ADMIN);
            const isSuperAdmin = roleMatch(user.roles, Role.SUPER_ADMIN);
            // Todo: If the customer logs into the system, add a control within the customer's account.
            if (user.userId === id && !isAdmin) {
                return res.status(StatusCodes.UNAUTHORIZED).json({error: 'Yetkisiz işlem.'})
            }

            await db.transaction(async (trx) => {
                const userResult = await trx.update(users).set({
                    isDeleted: true,
                    isActive: false
                }).where(and(
                    eq(users.id, id),
                    !isSuperAdmin ? exists(
                        db.select({val: sql`1`})
                            .from(employeeProfiles)
                            .where(and(
                                eq(employeeProfiles.employeeId, user.userId),
                                eq(employeeProfiles.serviceProviderId, user.serviceProviderId!),
                            ))
                    ) : undefined
                ));

                if (userResult.rowCount === 0) {
                    throw ({status: StatusCodes.NOT_FOUND, message: 'Kullanıcı bulunamadı.'})
                }

                await trx.update(userProfiles).set({
                    isDeleted: true,
                }).where(eq(userProfiles.id, user.userId))

                await trx.delete(userRoles).where(eq(userRoles.userId, id));
            });

            return res.status(StatusCodes.NO_CONTENT).send()
        } catch (e: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: e.message ?? e});
        }
    }

    static async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user!;
            const requestBody = req.body;

            // Todo: add role control for super admin and admin. Otherwise each users update own profile. 
            // if (user.userId !== requestBody.id) {
            //     return res.status(StatusCodes.UNAUTHORIZED).json({error: 'Yetkisiz işlem.'});
            // }

            await db.transaction(async (trx) => {
                const userResult = await trx.update(users).set({
                    phone: requestBody.phone,
                    email: requestBody.email,
                }).where(eq(users.id, requestBody.id));

                if (userResult.rowCount === 0) {
                    throw ({status: StatusCodes.NOT_FOUND, message: `User not found.`});
                }

                const profileResult = await trx.update(userProfiles).set({
                    fullName: requestBody.fullName,
                    address: requestBody.address,
                    title: requestBody.title,
                    avatar: requestBody.avatar,
                    description: requestBody.description,
                }).where(eq(userProfiles.userId, requestBody.id));

                if (profileResult.rowCount === 0) {
                    throw ({status: StatusCodes.NOT_FOUND, message: `User profile not found.`});
                }
            });

            return res.status(StatusCodes.NO_CONTENT).send();
        } catch (e: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: e.message ?? e});
        }
    }

    static async getActiveStatusUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user!;
            const isSuperAdmin = roleMatch(user.roles, Role.SUPER_ADMIN);

            const userList = await db.query.users.findMany({
                where: and(
                    eq(users.isActive, true),
                    eq(users.isDeleted, false),
                    !isSuperAdmin ?
                        exists(
                            db.select({val: sql`1`})
                                .from(employeeProfiles)
                                .where(
                                    and(
                                        eq(employeeProfiles.employeeId, users.id),
                                        eq(employeeProfiles.serviceProviderId, user.serviceProviderId!),
                                    )
                                )
                        ) : undefined
                ),
                columns: {
                    id: true,
                },
                with: {
                    userProfile: {
                        columns: {
                            fullName: true,
                        }
                    }
                }
            });

            const response = userList.map((user) => ({
                id: user.id,
                fullName: user.userProfile.fullName,
            }))

            return res.status(StatusCodes.OK).json(response);
        } catch (e: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: e.message ?? e});
        }
    }
    
    static async resendPasswordMail(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id as string;
            const resendMailUser = await db.query.verificationTokens.findFirst({
                where: eq(verificationTokens.userId, userId),
                columns: {
                    id: true
                },
                with: {
                    user: {
                        columns: {
                            email: true
                        },
                        with: {
                            userProfile: {
                                columns: {
                                    fullName: true
                                }
                            }
                        }
                    }
                }
            });
            
            if (!resendMailUser) {
                return res.status(StatusCodes.NOT_FOUND).send({error: 'Kullanıcı bulunamadı.'});
            }
            
            const [updateToken] = await db.update(verificationTokens).set({
                token: generatePasswordToken(),
                userId,
                expiresAt: set24Hours(),
            }).where(eq(verificationTokens.userId, userId)).returning();
            
            if (!updateToken) {
                return res.status(StatusCodes.NOT_FOUND).json({error: 'Kullanıcı bulunamadı.'})
            }
            
            const setupUrl = setupPasswordUrl(updateToken?.userId!, updateToken?.token)
            await mailService(resendMailUser?.user?.email!, 'Hesabınızı aktivite edin', passwordSetupTemplate(resendMailUser?.user?.userProfile?.fullName!, setupUrl));
            
            return res.status(StatusCodes.OK).send();
        } catch (e: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: e.message ?? e});
        }
    }

    // Todo: create exist phone and exist email endpoints.
}