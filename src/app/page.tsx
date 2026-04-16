import Link from 'next/link';
import Image from 'next/image';
import { PublicNav } from '@/components/PublicNav';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <PublicNav />

      <main>
        {/* Hero with cover image and gradient overlay */}
        <section className="relative min-h-[85vh] overflow-hidden bg-primary">
          <Image
            src="/images/cover.png"
            alt="Campus green space"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-hero" aria-hidden />
          {/* Organic blobs */}
          <div className="organic-blob left-1/4 top-1/4 h-64 w-64 bg-accent-teal" />
          <div className="organic-blob bottom-1/4 right-1/5 h-80 w-80 bg-accent-blue" />
          <div className="organic-blob right-1/3 top-1/2 h-48 w-48 bg-white" />
          <div className="relative mx-auto flex min-h-[85vh] max-w-4xl flex-col items-center justify-center px-4 py-20 text-center">
            <h1 className="animate-fade-in-up text-4xl font-bold tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
              Discover campus trees at KU!
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/90">
              Scan a QR code on a tree label to learn its name, benefits, and how
              you can support our green campus.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/trees" className="btn-primary">
                Browse all trees
              </Link>
              <Link href="/#how-it-works" className="rounded-xl border-2 border-white/50 bg-white/15 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25">
                How it works
              </Link>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section id="mission" className="relative bg-slate-50 py-20">
          <div className="organic-blob left-0 top-1/2 h-72 w-72 -translate-y-1/2 bg-accent-teal" />
          <div className="section-container relative">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-primary sm:text-4xl">
                Our mission
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-600">
                Smart Trees is a campus initiative that places QR-coded labels on
                trees. We aim to increase environmental awareness, improve campus
                engagement, and offer an optional way to donate toward university
                social and green events—all through a simple scan.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="relative bg-gradient-to-b from-slate-50 to-white py-20">
          <div className="section-container">
            <h2 className="text-center text-3xl font-bold text-primary">
              How it works
            </h2>
            <div className="mt-14 grid gap-8 sm:grid-cols-3">
              {[
                {
                  step: 1,
                  title: 'Find a tree',
                  desc: 'Look for a Smart Trees label with a QR code on campus.',
                },
                {
                  step: 2,
                  title: 'Scan the QR',
                  desc: 'Use your phone camera to scan the code and open the tree page.',
                },
                {
                  step: 3,
                  title: 'Learn & support',
                  desc: 'Read about the tree and optionally donate to campus initiatives.',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="card-glass flex flex-col items-center text-center transition hover:-translate-y-1"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-soft text-xl font-bold text-white shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured trees */}
        <section className="relative bg-white py-20">
          <div className="section-container">
            <h2 className="text-center text-3xl font-bold text-primary">
              Featured trees
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
              A few species you might find on campus.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: 'Roble', sci: 'Quercus spp.', slug: 'roble', cat: 'Forest' },
                { name: 'Aguacate', sci: 'Persea americana', slug: 'aguacate', cat: 'Fruit' },
                { name: 'Malinche', sci: 'Delonix regia', slug: 'malinche-napoleon', cat: 'Ornamental' },
              ].map((t) => (
                <Link
                  key={t.slug}
                  href={`/tree/${t.slug}`}
                  className="card group flex flex-col transition hover:-translate-y-1"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-accent-teal">
                    {t.cat}
                  </span>
                  <span className="mt-2 text-xl font-bold text-primary group-hover:text-accent-teal">
                    {t.name}
                  </span>
                  <span className="mt-0.5 text-sm italic text-slate-500">
                    {t.sci}
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/trees" className="btn-primary">
                View all trees
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-gradient-eco py-16">
          <div className="organic-blob -left-20 top-1/2 h-64 w-64 -translate-y-1/2 bg-white" />
          <div className="relative mx-auto max-w-2xl px-4 text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Support the initiative
            </h2>
            <p className="mt-4 text-white/90">
              Donations help fund campus greening and social events. You can
              donate from any tree page after scanning its QR code.
            </p>
            <Link
              href="/trees"
              className="mt-8 inline-block rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg transition hover:bg-slate-100"
            >
              Explore trees & donate
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-100/80 px-4 py-8 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl text-center text-sm text-slate-500">
          Smart Trees — Campus environmental awareness. No login required to
          explore.
        </div>
      </footer>
    </div>
  );
}
