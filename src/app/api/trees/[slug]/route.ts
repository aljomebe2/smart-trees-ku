import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const tree = await prisma.tree.findFirst({
      where: { slug, visible: true },
    });
    if (!tree) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(tree);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
