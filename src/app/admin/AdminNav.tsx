'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/trees', label: 'Trees' },
  { href: '/admin/donations', label: 'Donations' },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-6">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`text-sm font-medium ${
            pathname === href ? 'text-forest-600' : 'text-stone-600 hover:text-forest-600'
          }`}
        >
          {label}
        </Link>
      ))}
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: '/admin/login' })}
        className="text-sm font-medium text-stone-600 hover:text-stone-800"
      >
        Sign out
      </button>
    </nav>
  );
}
