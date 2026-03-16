export type RoleTypes = 'super_admin' | 'admin' | 'employee' | 'customer';

export const roleLabels: Record<RoleTypes, string> = {
    admin: 'Yönetici',
    employee: 'Çalışan',
    customer: 'Müşteri',
    super_admin: ""
};