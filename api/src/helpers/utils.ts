import 'dotenv/config'
import bcrypt from 'bcrypt';
import jwt, {JwtPayload} from 'jsonwebtoken';
import {Response} from "express";
import crypto from "crypto";

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export function userProfileFields() {
    return {
        fullName: true,
        address: true,
        title: true,
        avatar: true,
        description: true,
    };
}
export function mapUserInformation(user: any[]) {
    const response = user.map(({userProfile, userRoles, ...user}) => ({
        ...user,
        ...userProfile,
        roles: userRoles.map((ur: any) => ur.role.name)
    }));
    return response;
}

export function generateToken(payload: any): string {
    if (!payload) {
        throw new Error('User does not exist');
    }
    
    return jwt.sign(payload, process.env.JWT_SECRET!, {expiresIn: '1d'});
}

export function verifyToken(token: string): string | JwtPayload {
    return jwt.verify(token, process.env.JWT_SECRET!);
}

export function roleMatch(userRoles: string[], ...allowedRoles: string[]) {
    return userRoles.some(role => allowedRoles.includes(role));
}

export function setAccessTokenCookie(res: Response, token: string): void {
    res.cookie('accessToken', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    })
}

export function generatePasswordToken(): string {
    return crypto.pseudoRandomBytes(32).toString('hex');
}

export function setupPasswordUrl(userId: string, passwordToken: string): string {
    return `${process.env.FRONTEND_URL}/auth/set-password?userId=${userId}&token=${passwordToken}`;
    
}

export function set24Hours(): Date {
    return new Date(Date.now() + 24 * 60 * 60 * 1000);
}