import {Request, Response} from "express";
import {StatusCodes} from "../enums/status-codes.enum";
import {db} from "../db";
import {units} from "../db/schema";
import {eq} from "drizzle-orm";

export class UnitController {
    static async getAllUnits(req: Request, res: Response) {
        try {
            const result = await db.select({
                id: units.id,
                name: units.name,
                code: units.code
            })
                .from(units)
                .where(eq(units.isDeleted, false));

            if (!result.length) {
                return res.status(StatusCodes.OK).json([]);
            }

            return res.status(StatusCodes.OK).json(result)
        } catch (e: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: e});
        }
    }
} 