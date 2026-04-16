'use client';

import { useEffect, useState } from 'react';

type Donation = {
  id: string;
  amount: number;
  donorName: string | null;
  donorEmail: string | null;
  createdAt: string;
  tree: { commonName: string; slug: string } | null;
};

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const load = (fromVal?: string, toVal?: string) => {
    const params = new URLSearchParams();
    if (fromVal) params.set('from', fromVal);
    if (toVal) params.set('to', toVal);
    fetch(`/api/admin/donations?${params}`, { credentials: 'include' })
      .then((r) => r.json())
      .then(setDonations)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(from, to);
  }, []);

  const applyFilter = () => {
    setLoading(true);
    load(from || undefined, to || undefined);
  };

  const exportCsv = () => {
    const params = new URLSearchParams({ export: 'csv' });
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    window.open(`/api/admin/donations?${params}`, '_blank');
  };

  if (loading && donations.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-slate-500">Loading…</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary">Donations</h1>

      <div className="mt-6 flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            From date
          </label>
          <input
            type="date"
            className="input mt-1 w-40"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            To date
          </label>
          <input
            type="date"
            className="input mt-1 w-40"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <button type="button" className="btn-secondary" onClick={applyFilter}>
          Filter
        </button>
        <button type="button" className="btn-primary" onClick={exportCsv}>
          Export CSV
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="p-3 font-medium text-slate-700">Date</th>
              <th className="p-3 font-medium text-slate-700">Amount</th>
              <th className="p-3 font-medium text-slate-700">Donor</th>
              <th className="p-3 font-medium text-slate-700">Tree</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d) => (
              <tr key={d.id} className="border-b border-slate-100">
                <td className="p-3">
                  {new Date(d.createdAt).toLocaleString()}
                </td>
                <td className="p-3 font-medium">${d.amount.toFixed(2)}</td>
                <td className="p-3">
                  {d.donorName || '—'}
                  {d.donorEmail && (
                    <span className="block text-xs text-slate-500">
                      {d.donorEmail}
                    </span>
                  )}
                </td>
                <td className="p-3">
                  {d.tree ? (
                    <a
                      href={`/tree/${d.tree.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-teal hover:underline"
                    >
                      {d.tree.commonName}
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {donations.length === 0 && (
          <p className="p-8 text-center text-slate-500">No donations in this range.</p>
        )}
      </div>
    </div>
  );
}
