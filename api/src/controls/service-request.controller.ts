import {NextFunction, Request, Response} from "express";
import {StatusCodes} from "../enums/status-codes.enum";
import {roleMatch} from "../helpers/utils";
import {Role} from "../enums/role.enum";
import {db} from "../db";
import {and, eq} from "drizzle-orm";
import crypto from "crypto";
import {
    serviceItems,
    serviceProviderCustomers,
    serviceRequestEmployees,
    serviceRequests,
    serviceRequestStatuses
} from "../db/schema";
import {ServiceRequestStatus} from "../enums/service-request-status.enum";

export class ServiceRequestController {
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user!;
            const isSuperAdmin = roleMatch(user.roles, Role.SUPER_ADMIN);
            const serviceRequest = await db.query.serviceRequests.findMany({
                where: and(
                    eq(serviceRequests.isDeleted, false),
                    eq(serviceRequests.serviceProviderId, user.serviceProviderId!),
                ),
                columns: {
                    serviceRequestStatusId: false,
                    serviceProviderId: false,
                    customerId: false,
                    createdBy: false,
                },
                with: {
                    serviceRequestsStatus: {
                        columns: {
                            id: true,
                            name: true,
                            nameLocalized: true,
                        }
                    },
                    serviceProvider: {
                        columns: {
                            isDeleted: false,
                            createdAt: false,
                            updatedAt: false,
                            createdBy: false,
                        }
                    },
                    customer: {
                        columns: {
                            customerType: true,
                            note: true,
                            id: true,
                        },
                        with: {
                            users: {
                                columns: {
                                    phone: true,
                                    email: true,
                                },
                                with: {
                                    userProfile: {
                                        columns: {
                                            fullName: true,
                                        }
                                    }
                                }
                            },
                        }
                    },
                    user: {
                        columns: {
                            email: true,
                            phone: true,
                            id: true
                        },
                        with: {
                            userProfile: {
                                columns: {
                                    fullName: true,
                                }
                            }
                        }
                    },
                    serviceRequestEmployee: {
                        columns: {
                            serviceRequestId: false,
                            employeeId: false,
                        },
                        with: {
                            user: {
                                columns: {
                                    email: true,
                                    phone: true,
                                    id: true
                                },
                                with: {
                                    userProfile: {
                                        columns: {
                                            fullName: true,
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
            
            if (!serviceRequest) {
                return res.status(StatusCodes.NOT_FOUND).json({error: "Service kaydı bulunamadı."});
            }
            const response = serviceRequest.map(({customer, user, serviceRequestEmployee, ...safeServiceRequest}) => ({
                ...safeServiceRequest,
                customer: {
                    id: customer?.id,
                    customerType: customer?.customerType,
                    note: customer?.note,
                    email: customer?.users?.email,
                    phone: customer?.users?.phone,
                    ...customer?.users?.userProfile
                },
                createdBy: {
                    id: user?.id,
                    email: user?.email,
                    phone: user?.phone,
                    fullName: user?.userProfile?.fullName
                },
                employees: serviceRequestEmployee.map(({user: demo, ...serviceRequestEmployee}) => ({
                    id: demo?.id,
                    email: demo?.email,
                    phone: demo?.phone,
                    ...demo.userProfile
                }))
            }))
            return res.status(StatusCodes.OK).json(response)
        } catch (e: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: e})
        }
    }
    
    static async getServiceRequestById(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user!;
            const requestId = req.params.id as string;
            const serviceRequest = await db.query.serviceRequests.findFirst({
                where: and(
                    eq(serviceRequests.isDeleted, false),
                    eq(serviceRequests.serviceProviderId, user.serviceProviderId!),
                    eq(serviceRequests.id, requestId)
                ),
                columns: {
                    serviceRequestStatusId: false,
                    serviceProviderId: false,
                    customerId: false,
                    createdBy: false,
                },
                with: {
                    serviceRequestsStatus: {
                        columns: {
                            id: true,
                            name: true,
                            nameLocalized: true,
                        }
                    },
                    serviceProvider: {
                        columns: {
                            isDeleted: false,
                            createdAt: false,
                            updatedAt: false,
                            createdBy: false,
                        }
                    },
                    customer: {
                        columns: {
                            customerType: true,
                            note: true,
                            id: true,
                        },
                        with: {
                            users: {
                                columns: {
                                    phone: true,
                                    email: true,
                                },
                                with: {
                                    userProfile: {
                                        columns: {
                                            fullName: true,
                                        }
                                    }
                                }
                            },
                        }
                    },
                    user: {
                        columns: {
                            email: true,
                            phone: true,
                            id: true,
                        },
                        with: {
                            userProfile: {
                                columns: {
                                    fullName: true,
                                }
                            }
                        }
                    },
                    serviceRequestEmployee: {
                        columns: {
                            serviceRequestId: false,
                            employeeId: false,
                        },
                        with: {
                            user: {
                                columns: {
                                    email: true,
                                    phone: true,
                                    id: true,
                                },
                                with: {
                                    userProfile: {
                                        columns: {
                                            fullName: true,
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
            
            if (!serviceRequest) {
                return res.status(StatusCodes.NOT_FOUND).json({error: 'Service kaydı bulunamadı.'});
            }
            
            const { customer, user: createdBy, serviceRequestEmployee, ...safeServiceRequest } = serviceRequest; 
            const response = {
                ...safeServiceRequest,
                createdBy: {
                    phone: createdBy?.phone,
                    email: createdBy?.email,
                    ...createdBy?.userProfile
                },
                customer: {
                    id: customer?.id,
                    customerType: customer?.customerType,
                    note: customer?.note,
                    phone: customer?.users?.phone,
                    email: customer?.users?.email,
                    ...customer?.users?.userProfile
                },
                employees: serviceRequestEmployee.map(({user, ...serviceRequestEmployee}) => ({
                    id: user?.id,
                    email: user?.email,
                    phone: user?.phone,
                    ...user.userProfile
                }))
            }
            
            return res.status(StatusCodes.OK).json(response);
        } catch (e: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: e})
        }
    }
    
    static async createServiceRequest(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user!;
            const {problem, serviceRequestStatusId, serviceProviderId, customerId, employeeIds} = req.body as {
                serviceNumber: string;
                problem: string;
                serviceRequestStatusId: string;
                serviceProviderId: string;
                customerId: string;
                employeeIds: string[];
            };
            await db.transaction(async (trx) => {
                const isCustomerValid = await trx.query.serviceProviderCustomers.findFirst({
                    where: and(
                        eq(serviceProviderCustomers.customerId, customerId),
                        eq(serviceProviderCustomers.serviceProviderId, user.serviceProviderId!),
                        eq(serviceProviderCustomers.isDeleted, false)
                    )
                });

                if (!isCustomerValid) {
                    throw ({status: StatusCodes.NOT_FOUND, message: 'Müşteri bulunamadı'});
                }
                
                const status = await trx.query.serviceRequestStatuses.findFirst({
                    where: and(
                        eq(serviceRequestStatuses.isDeleted, false),
                        eq(serviceRequestStatuses.id, serviceRequestStatusId)
                    ),
                    columns: {
                        name: true,
                        nameLocalized: true,
                    }
                });
                
                if (status && status.name !== ServiceRequestStatus.Pending) {
                    throw ({status: StatusCodes.NOT_FOUND, message: `Servis kaydı oluştururken kayıt durumu '${status.nameLocalized}' olmalı` });
                }
                
                const date = new Date().getMilliseconds();
                const random = crypto.pseudoRandomBytes(2).toString('hex').toUpperCase();
                const [srResult] = await trx.insert(serviceRequests).values({
                    serviceNumber: `${date}${random}`,
                    problem,
                    serviceRequestStatusId,
                    serviceProviderId,
                    customerId,
                    createdBy: user.userId,
                }).returning();

                if (!srResult) {
                    throw ({status: StatusCodes.NOT_FOUND, message: 'No service provider found.'});
                }

                await trx.insert(serviceRequestEmployees).values(
                    employeeIds.map((employee) => ({
                        serviceRequestId: srResult.id,
                        employeeId: employee
                    }))
                );
            })

            return res.status(StatusCodes.CREATED).send();
        } catch (e: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: e})
        }
    }
    
    static async deleteServiceRequest(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user!;
            const requestId = req.params.id as string;
            await db.transaction(async (trx) => {
                const serviceRequestResult = await trx.update(serviceRequests).set({
                    isDeleted: true
                }).where(and(
                    eq(serviceRequests.id, requestId),
                    eq(serviceRequests.serviceProviderId, user.serviceProviderId!)
                ));
                
                if (serviceRequestResult.rowCount === 0) {
                    throw ({status: StatusCodes.NOT_FOUND, message: 'No service provider found.'});
                }
                
                await trx.update(serviceItems).set({
                    isDeleted: true
                }).where(eq(serviceItems.serviceRequestId, requestId))
                
                await trx.delete(serviceRequestEmployees)
                    .where(and(
                        eq(serviceRequestEmployees.serviceRequestId, requestId),
                    ))
            })
            
            return res.status(StatusCodes.NO_CONTENT).send();
        } catch (e: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: e?.message ?? e});
        }
    }
    
    // service items eklenecek.
    static async updateServiceRequest(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.user!;
            const requestId = req.params.id as string;
            const {problem, serviceRequestStatusId, serviceProviderId, customerId, employeeIds, solution, totalAmount} = req.body as {
                serviceNumber: string;
                problem: string;
                serviceRequestStatusId: string;
                serviceProviderId: string;
                customerId: string;
                employeeIds: string[];
                solution: string;
                totalAmount: string;
            };
            const findStatus = await db.query.serviceRequestStatuses.findFirst({
                where: and(
                    eq(serviceRequestStatuses.isDeleted, false),
                    eq(serviceRequestStatuses.id, serviceRequestStatusId)
                ),
                columns: {
                    name: true,
                    nameLocalized: true,
                }
            });
            
            if (findStatus && findStatus.name !== ServiceRequestStatus.Done) {
                return res.status(StatusCodes.BAD_REQUEST).send({error: `Güncelleme yapabilmek için servis kaydının durumu ${findStatus?.nameLocalized} olmalı.`});
            }
            
            const findRequest = await db.query.serviceRequests.findFirst({
                where: and(
                    eq(serviceRequests.isDeleted, false),
                    eq(serviceRequests.id, serviceRequestStatusId)
                ),
                columns: {
                    completedAt: true
                }
            }) 
            
            if (!findRequest) {
                return res.status(StatusCodes.NOT_FOUND).json({message: 'Servis kaydı bulunamadı.'});
            }
            
            await db.transaction(async (trx) => {
                const serviceRequestResult = await trx.update(serviceRequests).set({
                    problem,
                    solution,
                    serviceRequestStatusId,
                    serviceProviderId,
                    customerId,
                    totalAmount,
                    completedAt: findRequest.completedAt ?? new Date(),
                }).where(and(
                    eq(serviceRequests.id, requestId),
                ));
                
                if (serviceRequestResult.rowCount === 0) {
                    throw ({status: StatusCodes.NOT_FOUND, message: 'No service provider found.'});
                }
                
                await trx.delete(serviceRequestEmployees)
                    .where(eq(serviceRequestEmployees.serviceRequestId, requestId));
                
                if (employeeIds.length > 0) {
                    await trx.insert(serviceRequestEmployees).values(
                        employeeIds.map((employee) => ({
                            serviceRequestId: requestId,
                            employeeId: employee
                        }))
                    )
                }
            })
            
            return res.status(StatusCodes.NO_CONTENT).send();
        } catch (e: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: e})
        }
    }
}