import {z} from "zod";
import {emailSchema, passwordSchema, phoneSchema} from "./common.schema";

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});

export const setPasswordSchema = z.object({
    password: passwordSchema,
    confirmPassword: passwordSchema
})
    .refine((p) => p.password === p.confirmPassword, {
    message: 'Şifreler eşleşmiyor',
    path: ['confirmPassword']
});

export const changePasswordSchema = z.object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmNewPassword: passwordSchema
}).refine((p) => p.newPassword === p.confirmNewPassword, {
    message: 'Şifreler eşleşmiyor',
    path: ['confirmNewPassword']
})

export type LoginValues = z.infer<typeof loginSchema>;
export type SetPasswordValues = z.infer<typeof setPasswordSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;