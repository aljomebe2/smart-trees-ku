import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const bodySchema = z.object({
  amount: z.number().positive(),
  donorName: z.string().max(200).optional(),
  donorEmail: z.string().email().optional().or(z.literal('')),
  treeId: z.string().optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }
    const data = {
      ...parsed.data,
      donorEmail: parsed.data.donorEmail || null,
      donorName: parsed.data.donorName || null,
      treeId: parsed.data.treeId || null,
    };
    const donation = await prisma.donation.create({ data });
    return NextResponse.json(donation);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
