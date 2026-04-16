import Link from 'next/link';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/admin" className="font-semibold text-primary">
            Smart Trees — Admin
          </Link>
          <nav className="flex items-center gap-5" aria-label="Admin">
            <Link
              href="/admin"
              className="text-sm font-medium text-slate-600 transition hover:text-accent-teal"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/trees"
              className="text-sm font-medium text-slate-600 transition hover:text-accent-teal"
            >
              Trees
            </Link>
            <Link
              href="/admin/donations"
              className="text-sm font-medium text-slate-600 transition hover:text-accent-teal"
            >
              Donations
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 transition hover:text-accent-teal"
            >
              View site
            </Link>
            <Link
              href="/api/auth/signout"
              className="text-sm font-medium text-slate-500 transition hover:text-slate-700"
            >
              Sign out
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
}
