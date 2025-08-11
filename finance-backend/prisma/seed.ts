import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function main() {
  // Buat beberapa user demo
  const users = [
    { id: 'u1', email: 'demo@example.com', name: 'Demo User' },
    { id: 'u2', email: 'john@example.com', name: 'John Doe' },
    { id: 'u3', email: 'jane@example.com', name: 'Jane Smith' },
  ];

  for (const userData of users) {
    await db.user.upsert({
      where: { email: userData.email },
      update: { name: userData.name },
      create: { 
        id: userData.id, 
        email: userData.email, 
        name: userData.name, 
        passwordHash: 'demo-password' 
      },
    });
  }

  // Buat kategori untuk setiap user
  const categories = [
    { name: 'Gaji', type: 'INCOME' },
    { name: 'Bonus', type: 'INCOME' },
    { name: 'Makan', type: 'EXPENSE' },
    { name: 'Transportasi', type: 'EXPENSE' },
    { name: 'Tagihan', type: 'EXPENSE' },
    { name: 'Hiburan', type: 'EXPENSE' },
    { name: 'Belanja', type: 'EXPENSE' },
    { name: 'Investasi', type: 'EXPENSE' },
  ];

  for (const userData of users) {
    for (const cat of categories) {
      await db.category.upsert({
        where: { userId_name_type: { userId: userData.id, name: cat.name, type: cat.type as any } },
        update: {},
        create: { userId: userData.id, name: cat.name, type: cat.type as any },
      });
    }
  }

  // Buat tag untuk setiap user
  const tags = ['proyek-a', 'kuliah', 'rumah', 'kerja', 'liburan', 'kesehatan'];

  for (const userData of users) {
    for (const tagName of tags) {
      await db.tag.upsert({
        where: { userId_name: { userId: userData.id, name: tagName } },
        update: {},
        create: { userId: userData.id, name: tagName },
      });
    }
  }

  // Buat transaksi sample dengan data harian yang fluktuatif
  const demoTransactions = [
    // User 1 - Demo User - Data harian fluktuatif
    {
      userId: 'u1',
      amount: 5000000,
      type: 'INCOME',
      occurredAt: new Date('2025-08-01'),
      notes: 'Gaji bulanan',
      categoryName: 'Gaji',
      tags: ['kerja']
    },
    {
      userId: 'u1',
      amount: 150000,
      type: 'EXPENSE',
      occurredAt: new Date('2025-08-01'),
      notes: 'Makan siang',
      categoryName: 'Makan',
      tags: ['kerja']
    },
    {
      userId: 'u1',
      amount: 50000,
      type: 'EXPENSE',
      occurredAt: new Date('2025-08-02'),
      notes: 'Parkir',
      categoryName: 'Transportasi',
      tags: ['kerja']
    },
    {
      userId: 'u1',
      amount: 200000,
      type: 'EXPENSE',
      occurredAt: new Date('2025-08-03'),
      notes: 'Belanja mingguan',
      categoryName: 'Belanja',
      tags: ['rumah']
    },
    {
      userId: 'u1',
      amount: 300000,
      type: 'EXPENSE',
      occurredAt: new Date('2025-08-04'),
      notes: 'Nonton film',
      categoryName: 'Hiburan',
      tags: ['liburan']
    },
    {
      userId: 'u1',
      amount: 100000,
      type: 'EXPENSE',
      occurredAt: new Date('2025-08-05'),
      notes: 'Makan malam',
      categoryName: 'Makan',
      tags: ['kerja']
    },
    {
      userId: 'u1',
      amount: 500000,
      type: 'INCOME',
      occurredAt: new Date('2025-08-06'),
      notes: 'Bonus proyek',
      categoryName: 'Bonus',
      tags: ['kerja']
    },
    {
      userId: 'u1',
      amount: 250000,
      type: 'EXPENSE',
      occurredAt: new Date('2025-08-07'),
      notes: 'Tagihan listrik',
      categoryName: 'Tagihan',
      tags: ['rumah']
    },
    {
      userId: 'u1',
      amount: 80000,
      type: 'EXPENSE',
      occurredAt: new Date('2025-08-08'),
      notes: 'Bensin',
      categoryName: 'Transportasi',
      tags: ['kerja']
    },
    {
      userId: 'u1',
      amount: 120000,
      type: 'EXPENSE',
      occurredAt: new Date('2025-08-09'),
      notes: 'Makan siang',
      categoryName: 'Makan',
      tags: ['kerja']
    },
    {
      userId: 'u1',
      amount: 400000,
      type: 'EXPENSE',
      occurredAt: new Date('2025-08-10'),
      notes: 'Belanja bulanan',
      categoryName: 'Belanja',
      tags: ['rumah']
    },

    // User 2 - John Doe - Data harian yang berbeda
    {
      userId: 'u2',
      amount: 3000000,
      type: 'INCOME',
      occurredAt: new Date('2025-08-01'),
      notes: 'Gaji freelance',
      categoryName: 'Gaji',
      tags: ['proyek-a']
    },
    {
      userId: 'u2',
      amount: 100000,
      type: 'EXPENSE',
      occurredAt: new Date('2025-08-02'),
      notes: 'Kopi pagi',
      categoryName: 'Makan',
      tags: ['kerja']
    },
    {
      userId: 'u2',
      amount: 150000,
      type: 'EXPENSE',
      occurredAt: new Date('2025-08-03'),
      notes: 'Ojek online',
      categoryName: 'Transportasi',
      tags: ['kerja']
    },
    {
      userId: 'u2',
      amount: 500000,
      type: 'INCOME',
      occurredAt: new Date('2025-08-04'),
      notes: 'Bayaran proyek',
      categoryName: 'Gaji',
      tags: ['proyek-a']
    },
    {
      userId: 'u2',
      amount: 200000,
      type: 'EXPENSE',
      occurredAt: new Date('2025-08-05'),
      notes: 'Makan siang',
      categoryName: 'Makan',
      tags: ['kerja']
    },
    {
      userId: 'u2',
      amount: 300000,
      type: 'EXPENSE',
      occurredAt: new Date('2025-08-06'),
      notes: 'Investasi saham',
      categoryName: 'Investasi',
      tags: ['kerja']
    },
    {
      userId: 'u2',
      amount: 80000,
      type: 'EXPENSE',
      occurredAt: new Date('2025-08-07'),
      notes: 'Parkir',
      categoryName: 'Transportasi',
      tags: ['kerja']
    },
    {
      userId: 'u2',
      amount: 120000,
      type: 'EXPENSE',
      occurredAt: new Date('2025-08-08'),
      notes: 'Makan malam',
      categoryName: 'Makan',
      tags: ['kerja']
    },
    {
      userId: 'u2',
      amount: 400000,
      type: 'INCOME',
      occurredAt: new Date('2025-08-09'),
      notes: 'Bayaran proyek',
      categoryName: 'Gaji',
      tags: ['proyek-a']
    },
    {
      userId: 'u2',
      amount: 180000,
      type: 'EXPENSE',
      occurredAt: new Date('2025-08-10'),
      notes: 'Tagihan internet',
      categoryName: 'Tagihan',
      tags: ['rumah']
    },

    // User 3 - Jane Smith - Data harian yang stabil
    {
      userId: 'u3',
      amount: 4000000,
      type: 'INCOME',
      occurredAt: new Date('2025-08-01'),
      notes: 'Gaji tetap',
      categoryName: 'Gaji',
      tags: ['kerja']
    },
    {
      userId: 'u3',
      amount: 80000,
      type: 'EXPENSE',
      occurredAt: new Date('2025-08-01'),
      notes: 'Sarapan',
      categoryName: 'Makan',
      tags: ['kerja']
    },
    {
      userId: 'u3',
      amount: 120000,
      type: 'EXPENSE',
      occurredAt: new Date('2025-08-02'),
      notes: 'Makan siang',
      categoryName: 'Makan',
      tags: ['kerja']
    },
    {
      userId: 'u3',
      amount: 60000,
      type: 'EXPENSE',
      occurredAt: new Date('2025-08-03'),
      notes: 'Transportasi',
      categoryName: 'Transportasi',
      tags: ['kerja']
    },
    {
      userId: 'u3',
      amount: 100000,
      type: 'EXPENSE',
      occurredAt: new Date('2025-08-04'),
      notes: 'Makan malam',
      categoryName: 'Makan',
      tags: ['kerja']
    },
    {
      userId: 'u3',
      amount: 150000,
      type: 'EXPENSE',
      occurredAt: new Date('2025-08-05'),
      notes: 'Belanja kecil',
      categoryName: 'Belanja',
      tags: ['rumah']
    },
    {
      userId: 'u3',
      amount: 500000,
      type: 'INCOME',
      occurredAt: new Date('2025-08-06'),
      notes: 'Bonus kinerja',
      categoryName: 'Bonus',
      tags: ['kerja']
    },
    {
      userId: 'u3',
      amount: 90000,
      type: 'EXPENSE',
      occurredAt: new Date('2025-08-07'),
      notes: 'Makan siang',
      categoryName: 'Makan',
      tags: ['kerja']
    },
    {
      userId: 'u3',
      amount: 200000,
      type: 'EXPENSE',
      occurredAt: new Date('2025-08-08'),
      notes: 'Tagihan air',
      categoryName: 'Tagihan',
      tags: ['rumah']
    },
    {
      userId: 'u3',
      amount: 110000,
      type: 'EXPENSE',
      occurredAt: new Date('2025-08-09'),
      notes: 'Makan malam',
      categoryName: 'Makan',
      tags: ['kerja']
    },
    {
      userId: 'u3',
      amount: 180000,
      type: 'EXPENSE',
      occurredAt: new Date('2025-08-10'),
      notes: 'Belanja bulanan',
      categoryName: 'Belanja',
      tags: ['rumah']
    }
  ];

  for (const txData of demoTransactions) {
    // Cari kategori
    const category = await db.category.findFirst({
      where: { userId: txData.userId, name: txData.categoryName }
    });

    // Cari tags
    const tagIds = [];
    for (const tagName of txData.tags) {
      const tag = await db.tag.findFirst({
        where: { userId: txData.userId, name: tagName }
      });
      if (tag) tagIds.push(tag.id);
    }

    // Buat transaksi
    const transaction = await db.transaction.create({
      data: {
        userId: txData.userId,
        amount: txData.amount,
        type: txData.type as any,
        occurredAt: txData.occurredAt,
        categoryId: category?.id || null,
        notes: txData.notes,
      }
    });

    // Tambahkan tags
    if (tagIds.length > 0) {
      await db.transactionTag.createMany({
        data: tagIds.map(tagId => ({
          transactionId: transaction.id,
          tagId
        })),
        skipDuplicates: true
      });
    }
  }

  console.log('Seed OK - Created users:', users.map(u => u.email));
  console.log('Created daily transactions for August 2025 (10 days of data)');
}

main().finally(() => db.$disconnect());
