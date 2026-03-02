import {Request, Response} from "express";
import {StatusCodes} from "../enums/status-codes.enum";
import {db} from "../db";
import {and, asc, eq} from "drizzle-orm";
import {serviceRequestStatuses} from "../db/schema";

export class ServiceRequestController {
    static async getAllStatus(req: Request, res: Response) {
        try {
            const user = req.user!;
            const statusList = await db.query.serviceRequestStatuses.findMany({
                where: and(
                    eq(serviceRequestStatuses.isDeleted, false)
                ),
                orderBy: asc(serviceRequestStatuses.sortOrder),
                columns: {
                    createdAt: false,
                    updatedAt: false
                }
            });
            
            return res.status(StatusCodes.OK).json(statusList)
        } catch (e: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: e});
        }
    }
}