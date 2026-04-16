import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const exportCsv = searchParams.get('export') === 'csv';

    const where: { createdAt?: { gte?: Date; lte?: Date } } = {};
    if (from) where.createdAt = { ...where.createdAt, gte: new Date(from) };
    if (to) where.createdAt = { ...where.createdAt, lte: new Date(to) };

    const donations = await prisma.donation.findMany({
      where: Object.keys(where).length ? where : undefined,
      orderBy: { createdAt: 'desc' },
      include: { tree: { select: { commonName: true, slug: true } } },
    });

    if (exportCsv) {
      const header = 'id,amount,donor_name,donor_email,tree,tree_slug,created_at\n';
      const rows = donations.map(
        (d) =>
          `${d.id},${d.amount},${escapeCsv(d.donorName)},${escapeCsv(d.donorEmail)},${escapeCsv(d.tree?.commonName)},${d.tree?.slug ?? ''},${d.createdAt.toISOString()}`
      );
      const csv = header + rows.join('\n');
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="donations-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    return NextResponse.json(donations);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

function escapeCsv(val: string | null | undefined): string {
  if (val == null) return '';
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`;
  return s;
}
