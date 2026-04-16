import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateQrPng } from '@/lib/qr';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    const tree = await prisma.tree.findUnique({ where: { id } });
    if (!tree) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const qrCodeUrl = await generateQrPng(tree.slug, baseUrl);
    const updated = await prisma.tree.update({
      where: { id },
      data: { qrCodeUrl },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
