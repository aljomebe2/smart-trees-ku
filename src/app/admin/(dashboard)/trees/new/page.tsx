'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewTreePage() {
  const router = useRouter();
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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/trees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...form,
          imageUrl: form.imageUrl.trim() || null,
          environmentalFact: form.environmentalFact.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to create');
      router.push('/admin/trees');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tree');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/trees" className="text-forest-600 hover:underline">
          ← Trees
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-forest-800">Add tree</h1>

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
            Benefits (rich text) *
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
            placeholder="https://..."
            value={form.imageUrl}
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">
            Environmental fact (short)
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
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating…' : 'Create tree'}
          </button>
          <Link href="/admin/trees" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
