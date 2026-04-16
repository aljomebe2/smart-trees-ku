import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { slugify } from '@/lib/slug';
import { generateQrPng } from '@/lib/qr';

export const dynamic = 'force-dynamic';

const createSchema = z.object({
  commonName: z.string().min(1).max(200),
  scientificName: z.string().min(1).max(200),
  benefits: z.string().min(1),
  category: z.string().min(1).max(100),
  imageUrl: z.string().url().optional().nullable(),
  environmentalFact: z.string().max(500).optional().nullable(),
  visible: z.boolean().optional().default(true),
});

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const trees = await prisma.tree.findMany({
      orderBy: { commonName: 'asc' },
      include: { _count: { select: { scans: true, donations: true } } },
    });
    return NextResponse.json(trees);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    let slug = slugify(parsed.data.commonName);
    let existing = await prisma.tree.findUnique({ where: { slug } });
    let n = 0;
    while (existing) {
      n += 1;
      slug = `${slugify(parsed.data.commonName)}-${n}`;
      existing = await prisma.tree.findUnique({ where: { slug } });
    }
    const qrCodeUrl = await generateQrPng(slug, baseUrl);
    const tree = await prisma.tree.create({
      data: {
        ...parsed.data,
        slug,
        qrCodeUrl,
        imageUrl: parsed.data.imageUrl || null,
        environmentalFact: parsed.data.environmentalFact || null,
      },
    });
    return NextResponse.json(tree);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
