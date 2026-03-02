import {NextFunction, Request, Response} from "express";
import {StatusCodes} from "../enums/status-codes.enum";

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({error: 'Yetkisiz işlem'});
        }
        
        if (!roles.some(r => req.user?.roles.includes(r))) {
            return res.status(StatusCodes.FORBIDDEN).json({error: 'Bu işlem için yetkiniz yok.'})
        }
        return next();
    }
}