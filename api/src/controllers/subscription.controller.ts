import {Request, Response} from "express";
import {StatusCodes} from "../enums/status-codes.enum";
import {db} from "../db";
import {and, eq} from "drizzle-orm";
import {serviceProviders, subscriptionPlans, subscriptions} from "../db/schema";
import {mailService} from "../services/mail.service";
import {changeSubscriptionPlanTemplate} from "../templates/mail.template";

export class SubscriptionController {
    static async getSubscriptions(req: Request, res: Response) {
        try {
            
            const result = await db.query.subscriptions.findMany({
                where: eq(subscriptions.isDeleted, false),
                columns: {
                    id: true,
                    startDate: true,
                    endDate: true,
                    isActive: true,
                },
                with: {
                    subscriptionPlan: {
                        columns: {
                            id: true,
                            duration: true,
                            planType: true,
                            name: true,
                        }
                    },
                    serviceProvider: {
                        columns: {
                            id: true,
                            companyName: true,
                            email: true,
                            phone: true,
                        }
                    }
                }
            })
            return res.status(StatusCodes.OK).json(result);
        } catch (e: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: e});
        }
    }

    static async changePlan(req: Request, res: Response) {
        try {
            const { id, planType } = req.body;
            const findPlan = await db.query.subscriptionPlans.findFirst({
                where: and(
                    eq(subscriptionPlans.isDeleted, false),
                    eq(subscriptionPlans.planType, planType),
                ),
            });
            
            if (!findPlan) {
                return res.status(StatusCodes.NOT_FOUND).json({error: 'Plan type bulunamadı.'});
            }
            
            const findServiceProvider = await db.query.subscriptions.findFirst({
                where: and(
                    eq(subscriptions.isDeleted, false),
                    eq(subscriptions.id, id),
                ),
                columns: {
                    serviceProviderId: true,
                    endDate: true,
                },
                with: {
                    serviceProvider: {
                        columns: {
                            companyName: true,
                            email: true
                        }
                    }
                }
            });
            
            if (!findServiceProvider) {
                return res.status(StatusCodes.NOT_FOUND).json({error: 'Firma bilgisi bulunamadı.'})
            }
            
            const result = await db.update(subscriptions).set({
                planId: findPlan.id,
                startDate: new Date(),
                endDate: findPlan.duration === 0 ? null : new Date(Date.now() + findPlan.duration * 24 * 60 * 60 * 1000),
                isActive: true,
            }).where(eq(subscriptions.id, id));
            
            if (result.rowCount === 0) {
                return res.status(StatusCodes.NOT_FOUND).json({error: 'Üyelik tipi değiştirilemedi.'})
            }
            await mailService(findServiceProvider?.serviceProvider?.email!, 'Üyelik planı', changeSubscriptionPlanTemplate(findServiceProvider?.serviceProvider?.companyName!, findServiceProvider?.endDate!));
            return res.status(StatusCodes.CREATED).send();
        } catch (e: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: e});
        }
    }
}