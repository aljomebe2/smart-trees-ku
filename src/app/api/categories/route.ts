import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await prisma.tree.findMany({
      where: { visible: true },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    const list = categories.map((c) => c.category);
    return NextResponse.json(list);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
