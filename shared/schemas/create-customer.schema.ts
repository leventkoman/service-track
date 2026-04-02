import {z} from "zod";
import {emailSchema, phoneSchema} from "@sts/schemas/common.schema";

export const createCustomerSchema = z.object({
    id: z.string().nullable().optional(),
    customerType: z.enum(['individual', 'corporate']),
    title: z.string()
        .max(50, {message: 'Unvan en fazla 50 karakter olmalı'}),
    fullName: z.string()
        .min(3, { message: 'En az 3 karakter girmelisiniz.' })
        .max(255, {message: 'İsim soyisim en fazla 255 karakter olmalı'}),
    phone: phoneSchema,
    email: emailSchema,
    address: z.string()
        .min(3, { message: 'En az 3 karakter girmelisiniz.' })
        .max(255, {message: 'Adres en fazla 255 karakter olmalı'}),
    note: z.string()
        .max(255, {message: 'Not en fazla 255 karakter olmalı'}),
    description: z.string()
        .max(500, {message: 'Açıklama en fazla 500 karakter olmalı'}),
    avatar: z.string(),
});

export type CreateCustomerValue = z.infer<typeof createCustomerSchema>;