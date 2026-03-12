import {z} from "zod";

export const passCriteria = {
    lowerCase: 'Şifre en az 1 küçük harf içermeli.',
    uppercase: 'Şifre en az 1 büyük harf içermeli.',
    specialSymbol: 'Şifre en az 1 karakter özel karakter içermeli.',
    number: 'Şifre en az 1 rakam içermeli.',
    length: 'Şifre en az 8 karakter olmalı.',
}

export const emailSchema = z.email({message: 'Geçersiz email.'});
export const phoneSchema = z.string()
    .min(1, 'Telefon numarası zorunlu.')
    .regex(/^[0-9]+$/, 'Telefon numarası sadece rakam içermeli')
    .length(11, 'Telafon numarası 11 karakter olmalı.');
export const passwordSchema = z.string()
    .superRefine((val, ctx) => {
        if (val.length < 8) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: passCriteria.length });
        }
        if (!/[a-z]/.test(val)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: passCriteria.lowerCase });
        }
        if (!/[A-Z]/.test(val)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: passCriteria.uppercase });
        }
        if (!/[0-9]/.test(val)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: passCriteria.number });
        }
        if (!/[^a-zA-Z0-9]/.test(val)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: passCriteria.specialSymbol });
        }
    });