import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdWithFallback } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const userId = getUserIdWithFallback(req);
  const cats = await prisma.category.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  });

  const data = cats.map(c => ({
    id: c.id,
    userId: c.userId,
    name: c.name,
    type: c.type, // 'INCOME' | 'EXPENSE'
    createdAt: c.createdAt.toISOString(),
  }));

  return NextResponse.json(data);
}
