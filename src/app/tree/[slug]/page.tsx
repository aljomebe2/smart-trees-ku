'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { DonationButton } from '@/components/DonationButton';

type Tree = {
  id: string;
  commonName: string;
  scientificName: string;
  benefits: string;
  category: string;
  imageUrl: string | null;
  qrCodeUrl: string | null;
  slug: string;
  environmentalFact: string | null;
  visible: boolean;
};

export default function TreePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [tree, setTree] = useState<Tree | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/trees/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(setTree)
      .catch(() => setTree(null))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!tree?.id) return;
    const deviceType = /Mobile|Android|iPhone/i.test(navigator.userAgent)
      ? 'mobile'
      : 'desktop';
    fetch('/api/scans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ treeId: tree.id, deviceType }),
    }).catch(() => {});
  }, [tree?.id]);

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/tree/${slug}`
      : '';

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent-teal/30 border-t-accent-teal" />
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!tree) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-4">
        <h1 className="text-2xl font-bold text-primary">Tree not found</h1>
        <Link href="/trees" className="btn-primary">
          Browse all trees
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="glass-nav sticky top-0 z-40">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link href="/trees" className="text-sm font-semibold text-primary/80 hover:text-accent-teal">
            ← All trees
          </Link>
          <Link href="/" className="text-sm font-semibold text-primary/80 hover:text-accent-teal">
            Smart Trees
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-6">
        {/* Hero header: category + name + scientific */}
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-teal">
            {tree.category}
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            {tree.commonName}
          </h1>
          <p className="mt-1 text-xl italic text-slate-600">
            {tree.scientificName}
          </p>
        </div>

        {/* Tree image */}
        <div className="overflow-hidden rounded-2xl border border-white/50 bg-white shadow-glass">
          <div className="relative aspect-[16/10] w-full bg-slate-100">
            {tree.imageUrl ? (
              <Image
                src={tree.imageUrl}
                alt={tree.commonName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-6xl text-slate-300">
                🌳
              </div>
            )}
          </div>
        </div>

        {/* Environmental fact highlight */}
        {tree.environmentalFact && (
          <div className="glass-panel mt-8 border-accent-teal/20 bg-accent-teal/5">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent-teal">
              Did you know?
            </p>
            <p className="mt-2 text-slate-700 leading-relaxed">
              {tree.environmentalFact}
            </p>
          </div>
        )}

        {/* Benefits */}
        <div className="glass-panel mt-8">
          <h2 className="text-lg font-bold text-primary">Benefits</h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-700">
            {tree.benefits}
          </p>
        </div>

        {/* Donation CTA + Share (glass card) */}
        <div className="glass-panel mt-8">
          <h2 className="text-lg font-bold text-primary">Support campus initiatives</h2>
          <p className="mt-1 text-sm text-slate-600">
            Optional donations fund greening and social events.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <DonationButton treeId={tree.id} treeName={tree.commonName} />
            {shareUrl && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `${tree.commonName} — Smart Trees`,
                      url: shareUrl,
                      text: `Learn about ${tree.commonName} (${tree.scientificName}) on Smart Trees.`,
                    });
                  } else {
                    navigator.clipboard.writeText(shareUrl);
                    alert('Link copied to clipboard.');
                  }
                }}
              >
                Share / QR
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
