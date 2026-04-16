'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type Tree = {
  id: string;
  commonName: string;
  scientificName: string;
  category: string;
  slug: string;
  visible: boolean;
  imageUrl: string | null;
  qrCodeUrl: string | null;
  _count: { scans: number; donations: number };
};

export default function AdminTreesPage() {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/trees', { credentials: 'include' })
      .then((r) => r.json())
      .then(setTrees)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const remove = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/trees/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) setTrees((prev) => prev.filter((t) => t.id !== id));
    else alert('Failed to delete.');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-slate-500">Loading…</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Trees</h1>
        <Link href="/admin/trees/new" className="btn-primary">
          Add tree
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="p-3 font-medium text-slate-700">Tree</th>
              <th className="p-3 font-medium text-slate-700">Category</th>
              <th className="p-3 font-medium text-slate-700">Scans</th>
              <th className="p-3 font-medium text-slate-700">Visible</th>
              <th className="p-3 font-medium text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trees.map((t) => (
              <tr key={t.id} className="border-b border-slate-100">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-slate-100">
                      {t.imageUrl ? (
                        <Image
                          src={t.imageUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center text-lg">
                          🌳
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-primary">{t.commonName}</p>
                      <p className="text-xs italic text-slate-500">
                        {t.scientificName}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-3">{t.category}</td>
                <td className="p-3">{t._count.scans}</td>
                <td className="p-3">
                  <span
                    className={
                      t.visible
                        ? 'text-accent-teal font-medium'
                        : 'text-slate-400'
                    }
                  >
                    {t.visible ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/trees/${t.id}/edit`}
                      className="text-accent-teal hover:underline"
                    >
                      Edit
                    </Link>
                    <a
                      href={`/tree/${t.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-teal hover:underline"
                    >
                      View
                    </a>
                    <a
                      href={`/api/qr/${t.slug}`}
                      download={`qr-${t.slug}.png`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-teal hover:underline"
                    >
                      QR
                    </a>
                    <button
                      type="button"
                      className="text-red-600 hover:underline"
                      onClick={() => remove(t.id, t.commonName)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {trees.length === 0 && (
          <p className="p-8 text-center text-slate-500">No trees yet.</p>
        )}
      </div>
    </div>
  );
}
