'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function PublicNav() {
  const [logoSrc, setLogoSrc] = useState('/images/logo.png');

  return (
    <header className="glass-nav sticky top-0 z-40">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 transition opacity-90 hover:opacity-100">
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
            <Image
              src={logoSrc}
              alt="Smart Trees by KU"
              width={36}
              height={36}
              className="object-contain p-1"
              onError={() => setLogoSrc('/images/logo.jpg')}
            />
          </span>
          <span className="text-lg font-bold text-primary">
            Smart Trees <em className="italic">by KU</em>
          </span>
        </Link>
        <nav className="flex items-center gap-6" aria-label="Main">
          <Link
            href="/trees"
            className="text-sm font-semibold text-primary/80 transition hover:text-accent-teal"
          >
            Explore trees
          </Link>
          <Link
            href="/admin"
            className="text-sm font-semibold text-primary/80 transition hover:text-accent-teal"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
