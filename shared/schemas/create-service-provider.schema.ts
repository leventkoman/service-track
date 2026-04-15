import {z} from "zod";
import {emailSchema, phoneSchema} from "@sts/schemas/common.schema";

export const createServiceProviderSchema = z.object({
    id: z.string().nullable().optional(),
    email: emailSchema,
    phone: phoneSchema,
    companyName: z.string()
        .max(255, 'Firma ismi 250 karakter olmalı'),
    taxNumber: z.string()
        .max(11, 'Telafon numarası 11 karakter olmalı.'),
    address: z.string(),
    planType: z.string().nullable().optional(),
});

export type CreateServiceProviderValue = z.infer<typeof createServiceProviderSchema>;