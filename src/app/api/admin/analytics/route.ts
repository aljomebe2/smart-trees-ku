import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const [totalScans, totalDonations, donationSum, scansByTree, recentScans, recentDonations] = await Promise.all([
      prisma.scan.count(),
      prisma.donation.count(),
      prisma.donation.aggregate({ _sum: { amount: true } }),
      prisma.tree.findMany({
        where: { visible: true },
        select: {
          id: true,
          commonName: true,
          slug: true,
          _count: { select: { scans: true } },
        },
      }),
      prisma.scan.findMany({
        orderBy: { scannedAt: 'desc' },
        take: 15,
        include: { tree: { select: { commonName: true, slug: true } } },
      }),
      prisma.donation.findMany({
        orderBy: { createdAt: 'desc' },
        take: 15,
        include: { tree: { select: { commonName: true, slug: true } } },
      }),
    ]);

    const mostViewedTrees = scansByTree
      .map((t) => ({
        id: t.id,
        commonName: t.commonName,
        slug: t.slug,
        scanCount: t._count.scans,
      }))
      .sort((a, b) => b.scanCount - a.scanCount)
      .slice(0, 10);

    return NextResponse.json({
      totalScans,
      totalDonations,
      totalDonationAmount: donationSum._sum.amount ?? 0,
      mostViewedTrees,
      recentScans,
      recentDonations,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
