'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 text-center">
      <div className="max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-200 space-y-4">
        <h2 className="text-xl font-bold text-slate-900">কিছু একটা সমস্যা হয়েছে!</h2>
        <p className="text-xs text-slate-500">{error.message || 'অনুগ্রহ করে আবার চেষ্টা করুন।'}</p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
          >
            আবার চেষ্টা করুন
          </button>
          <Link
            href="/"
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs"
          >
            হোমে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
