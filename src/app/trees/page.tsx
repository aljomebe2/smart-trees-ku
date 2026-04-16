'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PublicNav } from '@/components/PublicNav';

type Tree = {
  id: string;
  commonName: string;
  scientificName: string;
  category: string;
  imageUrl: string | null;
  slug: string;
  environmentalFact: string | null;
};

type Res = {
  trees: Tree[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

export default function TreesPage() {
  const [data, setData] = useState<Res | null>(null);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page) });
    if (category) params.set('category', category);
    if (search.trim()) params.set('search', search.trim());
    fetch(`/api/trees?${params}`)
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          throw new Error(body.error || 'Failed to load trees');
        }
        return r.json();
      })
      .then((json) => {
        if (json && Array.isArray(json.trees)) {
          setData(json as Res);
          setError('');
        } else {
          setData(null);
          setError('Unexpected response from server.');
        }
      })
      .catch((err) => {
        console.error(err);
        setData(null);
        setError('Could not load trees. Please try again later.');
      });
  }, [page, category, search]);

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicNav />

      <main className="section-container">
        <h1 className="text-3xl font-bold text-primary">
          Explore trees
        </h1>
        <p className="mt-2 text-slate-600">
          Search and filter by category. Tap a card to open the tree page.
        </p>

        {/* Search + filter chips */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="relative flex-1 sm:max-w-sm">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden>
              🔍
            </span>
            <input
              type="search"
              placeholder="Search by name..."
              className="input pl-10"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              aria-label="Search trees by name"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => { setCategory(''); setPage(1); }}
              className={!category ? 'chip-active' : 'chip'}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => { setCategory(c); setPage(1); }}
                className={category === c ? 'chip-active' : 'chip'}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="mt-6 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {data && Array.isArray(data.trees) && (
          <>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.trees.map((tree, i) => (
                <Link
                  key={tree.id}
                  href={`/tree/${tree.slug}`}
                  className="card-glass group flex flex-col overflow-hidden"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
                    {tree.imageUrl ? (
                      <Image
                        src={tree.imageUrl}
                        alt={tree.commonName}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-5xl text-slate-300">
                        🌳
                      </div>
                    )}
                    <span className="absolute left-3 top-3 rounded-lg border border-white/50 bg-white/80 px-2.5 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
                      {tree.category}
                    </span>
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-primary group-hover:text-accent-teal">
                    {tree.commonName}
                  </h2>
                  <p className="mt-0.5 text-sm italic text-slate-500">
                    {tree.scientificName}
                  </p>
                  {tree.environmentalFact && (
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
                      {tree.environmentalFact}
                    </p>
                  )}
                </Link>
              ))}
            </div>

            {data.pagination.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <button
                  type="button"
                  className="btn-secondary disabled:opacity-50"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </button>
                <span className="text-sm font-medium text-slate-600">
                  Page {page} of {data.pagination.totalPages}
                </span>
                <button
                  type="button"
                  className="btn-secondary disabled:opacity-50"
                  disabled={page >= data.pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {data && Array.isArray(data.trees) && data.trees.length === 0 && (
          <div className="mt-12 rounded-2xl border border-slate-200 bg-white/80 p-12 text-center backdrop-blur-sm">
            <p className="text-slate-500">No trees found. Try a different search or category.</p>
          </div>
        )}
      </main>
    </div>
  );
}
