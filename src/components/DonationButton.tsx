'use client';

import { useState } from 'react';

const AMOUNTS = [5, 10, 25, 50, 100];

type Props = { treeId: string; treeName: string };

export function DonationButton({ treeId, treeName }: Props) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'form' | 'thanks'>('form');
  const [amount, setAmount] = useState(10);
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedAmount = customAmount ? parseFloat(customAmount) || 0 : amount;
  const validAmount = selectedAmount > 0;

  const submit = async () => {
    if (!validAmount) {
      setError('Please select or enter an amount.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedAmount,
          donorName: name.trim() || undefined,
          donorEmail: email.trim() || undefined,
          treeId,
        }),
      });
      if (!res.ok) throw new Error('Donation failed');
      setStep('thanks');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setOpen(false);
    setTimeout(() => {
      setStep('form');
      setAmount(10);
      setCustomAmount('');
      setName('');
      setEmail('');
      setError('');
    }, 300);
  };

  return (
    <>
      <button
        type="button"
        className="btn-primary"
        onClick={() => setOpen(true)}
      >
        Donate to support campus events
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="donation-title"
        >
          <div className="animate-fade-in-up w-full max-w-md rounded-2xl border border-white/50 bg-white/90 p-6 shadow-glass-lg backdrop-blur-xl">
            {step === 'thanks' ? (
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-teal/20 text-2xl" aria-hidden>
                  ✓
                </div>
                <h2 id="donation-title" className="mt-4 text-2xl font-bold text-primary">
                  Thank you
                </h2>
                <p className="mt-3 text-slate-600">
                  Your donation of ${selectedAmount.toFixed(2)} will support campus
                  green initiatives and social events. We appreciate your support.
                </p>
                <button
                  type="button"
                  className="btn-primary mt-8 w-full"
                  onClick={close}
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h2 id="donation-title" className="text-xl font-bold text-primary">
                  Donate for {treeName}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Optional. Donations support university social and environmental events.
                </p>

                <div className="mt-6">
                  <p className="text-sm font-semibold text-slate-700">Amount (USD)</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {AMOUNTS.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => {
                          setAmount(a);
                          setCustomAmount('');
                        }}
                        className={`rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition ${
                          !customAmount && amount === a
                            ? 'border-accent-teal bg-accent-teal/15 text-deep-green'
                            : 'border-slate-200 text-slate-700 hover:border-accent-teal/40 hover:bg-accent-teal/5'
                        }`}
                      >
                        ${a}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-slate-500">Other:</span>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="0.00"
                      className="input w-24"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        if (e.target.value) setAmount(0);
                      }}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-slate-700">
                    Name (optional)
                  </label>
                  <input
                    type="text"
                    className="input mt-1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-slate-700">
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    className="input mt-1"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>

                {error && (
                  <p className="mt-4 text-sm text-red-600" role="alert">
                    {error}
                  </p>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    className="btn-secondary flex-1"
                    onClick={close}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-primary flex-1"
                    onClick={submit}
                    disabled={loading || !validAmount}
                  >
                    {loading ? 'Sending…' : `Donate $${selectedAmount.toFixed(2)}`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
