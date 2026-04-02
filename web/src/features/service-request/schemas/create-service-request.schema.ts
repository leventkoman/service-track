import {z} from "zod";
import {emailSchema, phoneSchema} from "@sts/schemas/common.schema";

export const serviceRequestResponseSchema = z.object({
    id: z.string()
        .optional()
        .nullable(),
    problem: z.string(),
    serviceRequestsStatus: z.object({
        id: z.string(),
        name: z.string(),
        nameLocalized: z.string()
    }),
    serviceProvider: z.object({
       id: z.string(),
       companyName: z.string(), 
    }),
    customer: z.object({
        id: z.string(),
        fullName: z.string(),
    }),
    employees: z.array(z.object({
        id: z.string(),
        email: emailSchema,
        phone: phoneSchema,
        fullName: z.string(),
    }))
}).transform((data) => ({
    id: data.id,
    problem: data.problem,
    serviceRequestStatusId: data.serviceRequestsStatus.id,
    serviceProviderId: data.serviceProvider.id,
    customerId: data.customer.id,
    employeeIds: data.employees.map(e => e.id)
}));

export const createServiceRequestSchema = z.object({
    id: z.string()
        .nullable()
        .optional(),
    problem: z.string()
        .min(3, 'Problem için açıklama giriniz.'),
    serviceRequestStatusId: z.string()
        .min(1, 'Servis kaydının durumunu seçiniz.'),
    serviceProviderId: z.string()
        .min(3, 'Firma ismi en az 3 karakterli olmalı.'),
    customerId: z.string()
        .min(3, 'Müşteri ismi en az 3 karakterli olmalı.'),
    employeeIds: z.array(z.string())
        .min(1, 'En bir tane çelışan seçiniz.'),
})

export type CreateServiceRequestValues = z.infer<typeof createServiceRequestSchema>;