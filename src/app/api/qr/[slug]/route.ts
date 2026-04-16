import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateQrBuffer } from '@/lib/qr';

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const tree = await prisma.tree.findFirst({
      where: { slug },
      select: { id: true },
    });

    if (!tree) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    const buffer = await generateQrBuffer(slug, baseUrl);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `inline; filename="qr-${slug}.png"`,
      },
    });
    

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}