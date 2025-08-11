import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdWithFallback } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const userId = getUserIdWithFallback(req);
  const tags = await prisma.tag.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  });

  const data = tags.map(t => ({
    id: t.id,
    userId: t.userId,
    name: t.name,
    createdAt: t.createdAt.toISOString(),
  }));

  return NextResponse.json(data);
}
