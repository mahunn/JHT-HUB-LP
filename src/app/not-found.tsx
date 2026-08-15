import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 text-center">
      <div className="max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-2 font-mono">404</h2>
        <p className="text-sm text-slate-600 mb-6">দুঃখিত! পেইজটি খুঁজে পাওয়া যায়নি।</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow"
        >
          <Home className="w-4 h-4" />
          <span>হোমপেইজে ফিরে যান</span>
        </Link>
      </div>
    </div>
  );
}
