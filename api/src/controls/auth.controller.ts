import {NextFunction, Request, Response} from "express";
import {db} from "../db";
import { users} from "../db/schema";
import {and, eq} from "drizzle-orm";
import {StatusCodes} from "../enums/status-codes.enum";
import {comparePassword, generateToken, userProfileFields} from "../helpers/utils";

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
                            ...userProfileFields()
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
                return res.status(StatusCodes.NOT_FOUND).json({message: "User not found"});
            }

            const match = await comparePassword(password, user.passwordHash);
            if (!match) return res.status(StatusCodes.BAD_REQUEST).json({message: "Invalid phone or password. Please try again."});
            
            const { passwordHash, userProfile, employeeProfile, userRoles, ...safeUser } = user
            const response = {
                ...safeUser,
                ...userProfile,
                roles: userRoles.map(ur => ur.role?.name)
            }

            const payload = {
                userId: response.id,
                phone: response.phone,
                email: response.email,
                roles: response.roles,
                serviceProviderId: user.employeeProfile?.serviceProviderId ?? null,
            }
            const token = generateToken(payload);
            res.cookie('accessToken', token, {
                httpOnly: true,
                sameSite: 'lax',
                secure: false,
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            })

            return res.status(StatusCodes.OK).json({user: response, token});
        } catch (e) {
            return res.status(StatusCodes.BAD_REQUEST).json({message: e});
        }
    }
}