import {NextFunction, Request, Response} from "express";
import {db} from "../db";
import {users, userStatuses, verificationTokens} from "../db/schema";
import {and, eq, gt, lt} from "drizzle-orm";
import {StatusCodes} from "../enums/status-codes.enum";
import {comparePassword, generateToken, hashPassword, userProfileFields} from "../helpers/utils";
import type {LoginUser} from "@sts/models/login-user";
import type {LoginResponse} from "@sts/models/login-response";
import {UserStatus} from "../enums/user-status.enum";

export class AuthController {
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const {email, password} = req.body;
            const user = await db.query.users.findFirst({
                where: and(
                    eq(users.isActive, true),
                    eq(users.isDeleted, false),
                    eq(users.email, email)
                ),
                columns: {
                    id: true,
                    phone: true,
                    email: true,
                    passwordHash: true,
                },
                with: {
                    userProfile: {
                        columns: {
                            fullName: true,
                            address: true,
                            title: true,
                            avatar: true,
                            description: true,
                        },
                    },
                    userRoles: {
                        with: {
                            role: {
                                columns: {name: true}
                            }
                        }
                    },
                    employeeProfile: {
                        columns: {
                            serviceProviderId: true,
                        }
                    }
                }
            });
            
            if (!user || !user.passwordHash) {
                return res.status(StatusCodes.NOT_FOUND).json({message: "Kayıtlı kullanıcı bulunamadı."});
            }

            const match = await comparePassword(password, user.passwordHash);
            if (!match) return res.status(StatusCodes.BAD_REQUEST).json({message: "Geçersiz mail veya şifre girdiniz."});
            
            const result = await db.update(users).set({
                lastLoginTime: new Date(),
            }).where(eq(users.id, user.id));
            
            if (result.rowCount === 0) {
                return res.status(StatusCodes.NOT_FOUND).json({error: 'Kullanıcı bulunamadı.'})
            }
            
            const { passwordHash, userProfile, employeeProfile, userRoles, ...safeUser } = user
            const userMap: LoginUser = {
                ...safeUser,
                fullName: userProfile?.fullName,
                roles: userRoles.map(ur => ur.role?.name),
                serviceProviderId: employeeProfile?.serviceProviderId ?? null
            }

            const payload = {
                userId: userMap.id,
                phone: userMap.phone,
                email: userMap.email,
                roles: userMap.roles,
                serviceProviderId: user.employeeProfile?.serviceProviderId ?? null,
            }
            const token = generateToken(payload);
            res.cookie('accessToken', token, {
                httpOnly: true,
                sameSite: 'lax',
                secure: false,
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });

            return res.status(StatusCodes.OK).json({user: userMap, token} as LoginResponse);
        } catch (e) {
            return res.status(StatusCodes.BAD_REQUEST).json({message: e});
        }
    }

    static async setPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { token, password, userId } = req.body;
            const now = new Date();

            const findToken = await db.query.verificationTokens.findFirst({
                where: and(
                    eq(verificationTokens.token, token),
                    eq(verificationTokens.userId, userId),
                    eq(verificationTokens.isUsed, false),
                    gt(verificationTokens.expiresAt, now)
                )
            });

            if (!findToken) {
                return res.status(StatusCodes.NOT_FOUND).send({error: 'Token geçerli değil veya süresi bitmiş.'})
            }

            const activeStatus = await db.query.userStatuses.findFirst({
                where: eq(userStatuses.name, UserStatus.ACTIVE)
            });

            await db.transaction(async (trx) => {
                await trx.update(verificationTokens).set({
                    isUsed: true,
                }).where(eq(verificationTokens.token, token));

                await trx.update(users).set({
                    passwordHash: await hashPassword(password),
                    isActive: true,
                    statusId: activeStatus?.id
                }).where(eq(users.id, findToken?.userId as any));
            })

            return res.status(StatusCodes.OK).send({message: 'Şifre başarılı bir şekilde oluşturuldu.'});
        } catch (e: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: e});
        }
    }
    
    static async verifySetPasswordToken(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, token } = req.body;
            const now = new Date();
            const isAccessToken = await db.query.verificationTokens.findFirst({
                where: and(
                    eq(verificationTokens.token, token),
                    eq(verificationTokens.userId, userId),
                    eq(verificationTokens.isUsed, false),
                    gt(verificationTokens.expiresAt, now)
                )
            });
            
            if (!isAccessToken) {
                return res.status(StatusCodes.NOT_FOUND).send({error: 'Token geçerli değil veya süresi bitmiş.'})
            }
            
            return res.status(StatusCodes.OK).send()
        } catch (e) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: e});
        }
    }
    
    static async logout(req: Request, res: Response) {
        try {
            res.clearCookie('accessToken');
            return res.status(StatusCodes.OK).send();
        } catch (e) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: 'Something went wrong, please try again later.'});
        }
    }
}