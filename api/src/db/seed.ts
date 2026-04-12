import * as dotenv from 'dotenv';
dotenv.config({ path: 'api/.env' });
import {db} from "./index";
import {roles, serviceRequestStatuses, units, userStatuses, vatRates} from "./schema";

async function seed() {
    console.log('Seeding started...');

    await db.insert(userStatuses).values([
        { name: 'pending', nameLocalized: 'Beklemede', sortOrder: 0 },
        { name: 'active', nameLocalized: 'Aktif', sortOrder: 1 },
        { name: 'suspended', nameLocalized: 'Askıya alındı', sortOrder: 2 },
    ]).onConflictDoNothing();
    console.log('✓ user statuses seeded.');

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
    console.log('✓ service request statuses seeded.');
    
    await db.insert(units).values([
        { name: 'Gün', code: 'DAY' },
        { name: 'Ay', code: 'MON' },
        { name: 'Yıl', code: 'YR' },
        { name: 'Saat', code: 'H' },
        { name: 'Dakika', code: 'MIN' },
        { name: 'Saniye', code: 'SEC' },
        { name: 'Adet', code: 'PCS' },
        { name: 'Paket', code: 'PK' },
        { name: 'Kutu', code: 'BOX' },
        { name: 'Miligram', code: 'MG' },
        { name: 'Gram', code: 'G' },
        { name: 'Kilogram', code: 'KG' },
        { name: 'Litre', code: 'L' },
        { name: 'Ton', code: 'TON' },
        { name: 'Net Ton', code: 'NTON' },
        { name: 'Gross Ton', code: 'GTON' },
        { name: 'Milimetre', code: 'MM' },
        { name: 'Santimetre', code: 'CM' },
        { name: 'Metre', code: 'M' },
        { name: 'Kilometre', code: 'KM' },
        { name: 'Mililitre', code: 'ML' },
        { name: 'Milimetreküp', code: 'MM3' },
        { name: 'Santimetrekare', code: 'CM2' },
        { name: 'Santimetreküp', code: 'CM3' },
        { name: 'Metrekare', code: 'M2' },
        { name: 'Metreküp', code: 'M3' },
        { name: 'İmalat Fiyat', code: 'IMF' },
        { name: 'İskonto Oranı', code: 'DISC' },
        { name: 'Kilojul', code: 'KJ' },
        { name: 'Santilitre', code: 'CL' },
        { name: 'Ondalık (10 hane)', code: 'DEC10' },
        { name: 'Karat', code: 'CT' },
        { name: 'Kilowatt Saat', code: 'KWH' },
        { name: 'Megawatt Saat', code: 'MWH' },
        { name: 'Ton Başına Taşıma Kapasitesi', code: 'TPTC' },
        { name: 'Brüt Kalori', code: 'GCAL' },
        { name: 'Mal/Hizmet Tutarı', code: 'AMT' },
        { name: '1000 Litre', code: '1000L' },
        { name: 'Top', code: 'BALL' },
        { name: 'Saf Alkol Litre', code: 'PAL' },
        { name: 'Hesap', code: 'ACC' },
        { name: 'Kilogram Metrekare', code: 'KG_M2' },
        { name: 'Vergiler Dahil Tutar', code: 'TAXINC' },
        { name: 'Hücre Adet', code: 'CELL' },
        { name: 'Ödeme', code: 'PAY' },
        { name: 'Çift', code: 'PR' },
        { name: 'Ondalık (2 hane)', code: 'DEC2' },
        { name: '1000 Metreküp', code: '1000M3' },
        { name: 'Set', code: 'SET' },
        { name: '1000 Adet', code: '1000PCS' },
        { name: 'Standart Metreküp', code: 'SCM' },
        { name: 'Normal Metreküp', code: 'NCM' },
        { name: 'Milyon BTU', code: 'MMBTU' },
        { name: 'Santimetre (*)', code: 'CMX' },
        { name: 'Düzine', code: 'DOZ' },
        { name: 'E Oluştur / C Temizle', code: 'ACTION' },
        { name: 'Desimetrekare', code: 'DM2' },
        { name: 'Desimetre', code: 'DM' },
        { name: 'Hektar', code: 'HA' },
        { name: 'Metretül', code: 'LM' }
    ]).onConflictDoNothing();
    console.log('✓ units seeded.');

    await db.insert(vatRates).values([
        { rate: "0.00", name: '' },
        { rate: "1.00", name: '1' },
        { rate: "8.00", name: '8' },
        { rate: "10.00", name: '10' },
        { rate: "18.00", name: '18' },
        { rate: "20.00", name: '20' }
    ]).onConflictDoNothing();
    console.log('✓ vat rates seeded.');

    console.log('Seeding completed.');
    process.exit(0);
}

seed().catch((e) => {
    console.error('✗ Seeding failed:', e.message);
    process.exit(1);
});