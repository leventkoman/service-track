import * as dotenv from 'dotenv';
dotenv.config({ path: 'api/.env' });
import {db} from "./index";
import {roles, serviceRequestStatuses, userStatuses} from "./schema";

async function seed() {
    console.log('Seeding started...');

    await db.insert(userStatuses).values([
        { name: 'pending', nameLocalized: 'Beklemede', sortOrder: 0 },
        { name: 'active', nameLocalized: 'Aktif', sortOrder: 1 },
        { name: 'suspended', nameLocalized: 'Askıya alındı', sortOrder: 2 },
    ]).onConflictDoNothing();
    console.log('✓ userStatuses seeded.');

    await db.insert(roles).values([
        { name: 'super_admin' },
        { name: 'admin' },
        { name: 'employee' },
        { name: 'customer' },
    ]).onConflictDoNothing();
    console.log('✓ roles seeded.');

    await db.insert(serviceRequestStatuses).values([
        { name: 'pending', nameLocalized: 'Beklemede', sortOrder: 1 },
        { name: 'in_progress', nameLocalized: 'Devam Ediyor', sortOrder: 2 },
        { name: 'done', nameLocalized: 'Tamamlandı', sortOrder: 3 },
    ]).onConflictDoNothing();
    console.log('✓ serviceRequestStatuses seeded.');

    console.log('Seeding completed.');
    process.exit(0);
}

seed().catch((e) => {
    console.error('✗ Seeding failed:', e.message);
    process.exit(1);
});