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
    })),
    solution: z.string()
        .optional()
        .nullable(),
    totalAmount: z.number().optional().nullable(),
    items: z.array(z.object({
        id: z.string(),
        itemName: z.string(),
        quantity: z.string(),
        unitPrice: z.string(),
        itemPrice: z.string(),
        lineTotal: z.string(),
        unit: z.object({
            id: z.string(),
            name: z.string(),
            code: z.string()
        }).optional(),
        vatRate: z.object({
            id: z.string(),
            name: z.string(),
            rate: z.string()
        }).optional(),
        vatRatePrice: z.string(),
    })).optional(),
}).transform((data) => ({
    id: data.id,
    problem: data.problem,
    serviceRequestStatusId: data.serviceRequestsStatus.id,
    serviceProviderId: data.serviceProvider.id,
    customerId: data.customer.id,
    employeeIds: data.employees.map(e => e.id),
    solution: data.solution,
    totalAmount: data.totalAmount,
    items: data.items?.map(item => ({
        id: item.id,
        itemName: item.itemName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        itemPrice: item.itemPrice,
        lineTotal: item.lineTotal,
        unitId: item.unit?.id ?? '',
        vatRateId: item.vatRate?.id ?? '',
        vatRatePrice: item.vatRatePrice ?? '',
    })) ?? [],
}));

export const serviceItemSchema = z.object({
    id: z.string().optional(),
    itemName: z.string().min(1, 'Kalem adı zorunlu'),
    quantity: z.string().min(1, 'Miktar en az 1 olmalı'),
    unitPrice: z.string(),
    itemPrice: z.string(),
    lineTotal: z.string(),
    unitId: z.string().min(1, 'Birim seçiniz'),
    vatRateId: z.string().min(1, 'KDV oranı seçiniz'),
    vatRatePrice: z.string(),
});

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
    solution: z.string()
        .optional()
        .nullable(),
    items: z.array(serviceItemSchema).optional(),
    totalAmount: z.number().optional().nullable()
})

export type CreateServiceRequestValues = z.infer<typeof createServiceRequestSchema>;
export type ServiceItemValues = z.infer<typeof serviceItemSchema>;