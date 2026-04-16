'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type Analytics = {
  totalScans: number;
  totalDonations: number;
  totalDonationAmount: number;
  mostViewedTrees: { id: string; commonName: string; slug: string; scanCount: number }[];
  recentScans: { id: string; scannedAt: string; tree: { commonName: string; slug: string } }[];
  recentDonations: {
    id: string;
    amount: number;
    donorName: string | null;
    createdAt: string;
    tree: { commonName: string; slug: string } | null;
  }[];
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    fetch('/api/admin/analytics', { credentials: 'include' })
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent-teal/30 border-t-accent-teal" />
        <p className="text-slate-500">Loading analytics…</p>
      </div>
    );
  }

  const chartData = data.mostViewedTrees.map((t) => ({
    name: t.commonName.length > 12 ? t.commonName.slice(0, 12) + '…' : t.commonName,
    scans: t.scanCount,
  }));

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-primary">Analytics</h1>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="card">
          <p className="text-sm font-medium text-slate-500">Total scans</p>
          <p className="mt-1 text-2xl font-semibold text-primary">
            {data.totalScans.toLocaleString()}
          </p>
        </div>
        <div className="card">
          <p className="text-sm font-medium text-slate-500">Total donations</p>
          <p className="mt-1 text-2xl font-semibold text-primary">
            {data.totalDonations.toLocaleString()}
          </p>
        </div>
        <div className="card">
          <p className="text-sm font-medium text-slate-500">Donation amount</p>
          <p className="mt-1 text-2xl font-semibold text-primary">
            ${data.totalDonationAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="card">
          <h2 className="font-semibold text-primary">Most viewed trees</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 24 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="scans" fill="#0c857d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="font-semibold text-primary">Recent scans</h2>
          <ul className="mt-4 space-y-2">
            {data.recentScans.slice(0, 8).map((s) => (
              <li key={s.id} className="flex justify-between text-sm">
                <Link
                  href={`/tree/${s.tree.slug}`}
                  className="text-accent-teal hover:underline"
                >
                  {s.tree.commonName}
                </Link>
                <span className="text-slate-500">
                  {new Date(s.scannedAt).toLocaleString()}
                </span>
              </li>
            ))}
            {data.recentScans.length === 0 && (
              <li className="text-sm text-slate-500">No scans yet.</li>
            )}
          </ul>
        </div>
        <div className="card">
          <h2 className="font-semibold text-primary">Recent donations</h2>
          <ul className="mt-4 space-y-2">
            {data.recentDonations.slice(0, 8).map((d) => (
              <li key={d.id} className="flex justify-between text-sm">
                <span>
                  ${d.amount.toFixed(2)}
                  {d.tree && (
                    <Link
                      href={`/tree/${d.tree.slug}`}
                      className="ml-1 text-accent-teal hover:underline"
                    >
                      ({d.tree.commonName})
                    </Link>
                  )}
                  {d.donorName && ` — ${d.donorName}`}
                </span>
                <span className="text-slate-500">
                  {new Date(d.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
            {data.recentDonations.length === 0 && (
              <li className="text-sm text-slate-500">No donations yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
