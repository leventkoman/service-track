import {Request, Response} from "express";
import {StatusCodes} from "../enums/status-codes.enum";
import {db} from "../db";
import {vatRates} from "../db/schema";
import {eq} from "drizzle-orm";

export class VatRateController {
    static async getAll(req: Request, res: Response) {
        try {
            const result = await db.select({
                id: vatRates.id,
                name: vatRates.name,
                rate: vatRates.rate
            })
                .from(vatRates)
                .where(eq(vatRates.isDeleted, false));
            
            if (result.length === 0) {
                return res.status(StatusCodes.OK).json([]);
            }
            
            return res.status(StatusCodes.OK).json(result);
        } catch (e) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: e});
        }
    }
}