import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./data/database.sqlite',
});
const prisma = new PrismaClient({ adapter });

const WEB_SHOP_USER_ID = 'webshop-systeem';

async function main() {
  console.log('Starting database seed...');

  // Historie wordt via onDelete: Cascade automatisch mee verwijderd
  await prisma.order.deleteMany();

  // B2B-order met prioriteit en beloofde leverdatum
  await prisma.order.create({
    data: {
      orderNumber: '1001',
      customerType: 'B2B',
      sku: 'MUG-WHITE-330',
      quantity: 100,
      promisedDeliveryDate: new Date('2026-12-15T00:00:00Z'),
      receivedAt: new Date('2026-11-27T09:00:00Z'),
      statusHistory: {
        create: [
          { status: 'RECEIVED', changedAt: new Date('2026-11-27T09:00:00Z'), changedById: WEB_SHOP_USER_ID },
        ],
      },
    },
  });

  // B2C-order met één orderregel
  await prisma.order.create({
    data: {
      orderNumber: '1002',
      customerType: 'B2C',
      sku: 'TSHIRT-BLACK-M',
      quantity: 1,
      promisedDeliveryDate: new Date('2026-12-05T00:00:00Z'),
      receivedAt: new Date('2026-11-27T10:30:00Z'),
      statusHistory: {
        create: [
          { status: 'RECEIVED', changedAt: new Date('2026-11-27T10:30:00Z'), changedById: WEB_SHOP_USER_ID },
        ],
      },
    },
  });

  console.log('Database seeded successfully.');
  console.log('Created 2 orders.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
