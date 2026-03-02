import {NextFunction, Request, Response} from "express";
import {StatusCodes} from "../enums/status-codes.enum";
import {verifyToken} from "../helpers/utils";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;
    
    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({error: 'Token bulunamadı'});
    }
    
    try {
        req.user = verifyToken(token) as any;
        return next();
    } catch (e: any) {
        return res.status(StatusCodes.UNAUTHORIZED).json({error: 'Token geçersiz'});
    }
}