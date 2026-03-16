import {NextFunction, Request, Response} from "express";
import {db} from "../db";
import { users} from "../db/schema";
import {and, eq} from "drizzle-orm";
import {StatusCodes} from "../enums/status-codes.enum";
import {comparePassword, generateToken, userProfileFields} from "../helpers/utils";
import type {LoginUser} from "@sts/models/login-user";
import type {LoginResponse} from "@sts/models/login-response";

export class AuthController {
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const {phone, password} = req.body;
            const user = await db.query.users.findFirst({
                where: and(
                    eq(users.isActive, true),
                    eq(users.isDeleted, false),
                    eq(users.phone, phone)
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
            if (!match) return res.status(StatusCodes.BAD_REQUEST).json({message: "Invalid phone or password. Please try again."});
            
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
}