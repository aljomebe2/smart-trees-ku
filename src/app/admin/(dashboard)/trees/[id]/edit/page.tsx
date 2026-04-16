'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type Tree = {
  id: string;
  commonName: string;
  scientificName: string;
  benefits: string;
  category: string;
  imageUrl: string | null;
  qrCodeUrl?: string | null;
  environmentalFact: string | null;
  visible: boolean;
  slug: string;
};

export default function EditTreePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [tree, setTree] = useState<Tree | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    commonName: '',
    scientificName: '',
    benefits: '',
    category: 'ornamental',
    imageUrl: '',
    environmentalFact: '',
    visible: true,
  });

  useEffect(() => {
    fetch(`/api/admin/trees/${id}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        setTree(data);
        setForm({
          commonName: data.commonName,
          scientificName: data.scientificName,
          benefits: data.benefits,
          category: data.category,
          imageUrl: data.imageUrl || '',
          environmentalFact: data.environmentalFact || '',
          visible: data.visible,
        });
      })
      .catch(() => setTree(null));
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/trees/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...form,
          imageUrl: form.imageUrl.trim() || null,
          environmentalFact: form.environmentalFact.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to update');
      router.push('/admin/trees');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const regenerateQr = async () => {
    const res = await fetch(`/api/admin/trees/${id}/qr`, {
      method: 'POST',
      credentials: 'include',
    });
    if (res.ok) {
      const updated = await res.json();
      setTree((t) => (t ? { ...t, qrCodeUrl: updated.qrCodeUrl } : null));
    }
  };

  if (!tree) {
    return (
      <div className="py-12 text-center text-stone-500">
        Loading… or tree not found.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/trees" className="text-forest-600 hover:underline">
          ← Trees
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-forest-800">Edit tree</h1>
      <p className="mt-1 text-sm text-stone-500">Slug: {tree.slug}</p>

      <form onSubmit={submit} className="mt-6 max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700">
            Common name *
          </label>
          <input
            type="text"
            required
            className="input mt-1"
            value={form.commonName}
            onChange={(e) => setForm((f) => ({ ...f, commonName: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">
            Scientific name *
          </label>
          <input
            type="text"
            required
            className="input mt-1"
            value={form.scientificName}
            onChange={(e) =>
              setForm((f) => ({ ...f, scientificName: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">
            Category *
          </label>
          <select
            className="input mt-1"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          >
            <option value="fruit">Fruit</option>
            <option value="ornamental">Ornamental</option>
            <option value="forest">Forest</option>
            <option value="palm">Palm</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">
            Benefits *
          </label>
          <textarea
            required
            rows={5}
            className="input mt-1"
            value={form.benefits}
            onChange={(e) => setForm((f) => ({ ...f, benefits: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">
            Image URL
          </label>
          <input
            type="url"
            className="input mt-1"
            value={form.imageUrl}
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">
            Environmental fact
          </label>
          <input
            type="text"
            className="input mt-1"
            value={form.environmentalFact}
            onChange={(e) =>
              setForm((f) => ({ ...f, environmentalFact: e.target.value }))
            }
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="visible"
            checked={form.visible}
            onChange={(e) =>
              setForm((f) => ({ ...f, visible: e.target.checked }))
            }
          />
          <label htmlFor="visible" className="text-sm text-stone-700">
            Visible on public catalog
          </label>
        </div>
        <div>
          <button
            type="button"
            className="btn-secondary"
            onClick={regenerateQr}
          >
            Regenerate QR code
          </button>
        </div>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving…' : 'Save'}
          </button>
          <Link href="/admin/trees" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
