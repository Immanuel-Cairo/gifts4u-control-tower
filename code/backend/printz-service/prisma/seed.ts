import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./data/database.sqlite',
});
const prisma = new PrismaClient({ adapter });

const PRINTZ_USER_ID = 'printz-medewerker-1';

async function main() {
  console.log('Starting database seed...');

  // History wordt via onDelete: Cascade automatisch mee verwijderd
  await prisma.printJob.deleteMany();

  // Order 1001: een mok en een T-shirt, elk met een eigen foto, dus twee printopdrachten
  await prisma.printJob.create({
    data: {
      orderId: 'order-1001',
      itemId: 'item-1001-1',
      sku: 'MUG-WHITE-330',
      designUrl: 'https://example.com/designs/item-1001-1.png',
      status: 'RECEIVED',
      receivedAt: new Date('2026-11-17T09:00:00Z'),
      statusHistory: {
        create: [
          { status: 'RECEIVED', changedAt: new Date('2026-11-17T09:00:00Z'), changedById: PRINTZ_USER_ID },
        ],
      },
    },
  });

  await prisma.printJob.create({
    data: {
      orderId: 'order-1001',
      itemId: 'item-1001-2',
      sku: 'TSHIRT-BLACK-M',
      designUrl: 'https://example.com/designs/item-1001-2.png',
      status: 'PRINTING',
      receivedAt: new Date('2026-11-17T09:00:00Z'),
      printingStartedAt: new Date('2026-11-18T10:30:00Z'),
      statusHistory: {
        create: [
          { status: 'RECEIVED', changedAt: new Date('2026-11-17T09:00:00Z'), changedById: PRINTZ_USER_ID },
          { status: 'PRINTING', changedAt: new Date('2026-11-18T10:30:00Z'), changedById: PRINTZ_USER_ID },
        ],
      },
    },
  });

  // Order 1002: een mok die klaar is om te verzenden
  await prisma.printJob.create({
    data: {
      orderId: 'order-1002',
      itemId: 'item-1002-1',
      sku: 'MUG-WHITE-330',
      designUrl: 'https://example.com/designs/item-1002-1.png',
      status: 'READY_TO_SHIP',
      receivedAt: new Date('2026-11-15T08:00:00Z'),
      printingStartedAt: new Date('2026-11-16T09:00:00Z'),
      readyAt: new Date('2026-11-16T15:00:00Z'),
      statusHistory: {
        create: [
          { status: 'RECEIVED', changedAt: new Date('2026-11-15T08:00:00Z'), changedById: PRINTZ_USER_ID },
          { status: 'PRINTING', changedAt: new Date('2026-11-16T09:00:00Z'), changedById: PRINTZ_USER_ID },
          { status: 'QUALITY_CHECK', changedAt: new Date('2026-11-16T14:00:00Z'), changedById: PRINTZ_USER_ID },
          { status: 'READY_TO_SHIP', changedAt: new Date('2026-11-16T15:00:00Z'), changedById: PRINTZ_USER_ID },
        ],
      },
    },
  });

  console.log('Database seeded successfully.');
  console.log('Created 3 print jobs.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
