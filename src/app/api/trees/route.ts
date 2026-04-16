import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Robust, zod-free parsing with safe fallbacks
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;

    let page = Number(pageParam ?? 1);
    if (!Number.isFinite(page) || page < 1) page = 1;

    let limit = Number(limitParam ?? 12);
    if (!Number.isFinite(limit) || limit < 1) limit = 12;
    if (limit > 50) limit = 50;

    const skip = (page - 1) * limit;

    const where: {
      visible?: boolean;
      category?: string;
      OR?: Array<{ commonName?: { contains: string }; scientificName?: { contains: string } }>;
    } = {
      visible: true,
    };

    if (category) where.category = category;
    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { commonName: { contains: term } },
        { scientificName: { contains: term } },
      ];
    }

    const [trees, total] = await Promise.all([
      prisma.tree.findMany({
        where,
        orderBy: { commonName: 'asc' },
        skip,
        take: limit,
        select: {
          id: true,
          commonName: true,
          scientificName: true,
          category: true,
          imageUrl: true,
          slug: true,
          environmentalFact: true,
        },
      }),
      prisma.tree.count({ where }),
    ]);

    return NextResponse.json({
      trees,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
