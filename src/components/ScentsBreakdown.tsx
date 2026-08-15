'use client';

import { Crown, Compass } from 'lucide-react';
import { ScentItem } from '@/types/landing';

interface ScentsBreakdownProps {
  scents: ScentItem[];
}

export default function ScentsBreakdown({ scents }: ScentsBreakdownProps) {
  const arabianScents = scents.filter((s) => s.category === 'arabian');
  const perfumeScents = scents.filter((s) => s.category === 'perfume');

  return (
    <section className="py-10 px-4 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-8">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">এক্সক্লুসিভ কালেকশন</p>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            যেসব প্রিমিয়াম সুবাস আপনি পাবেন
          </h2>
          <p className="text-slate-500 mt-1.5 text-sm font-medium max-w-md mx-auto">
            প্রতিটি আতর ১০০% অ্যালকোহল মুক্ত, দীর্ঘস্থায়ী এবং মন মাতানো সুবাসে ভরপুর
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Arabian Scents */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">এরাবিয়ান টাইপ আতর</h3>
                <p className="text-[11px] text-amber-700 font-semibold">রাজকীয় সুবাস</p>
              </div>
            </div>

            <div className="space-y-2">
              {arabianScents.map((scent, idx) => (
                <div
                  key={scent.id || idx}
                  className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-150 hover:border-amber-300 transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 border border-amber-200">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{scent.name}</h4>
                    {scent.notes && <p className="text-[11px] text-slate-400 mt-0.5">{scent.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Perfume Scents */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">পারফিউম টাইপ আতর</h3>
                <p className="text-[11px] text-blue-600 font-semibold">মডার্ন ও ট্রেন্ডি</p>
              </div>
            </div>

            <div className="space-y-2">
              {perfumeScents.map((scent, idx) => (
                <div
                  key={scent.id || idx}
                  className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-150 hover:border-blue-300 transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 border border-blue-200">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{scent.name}</h4>
                    {scent.notes && <p className="text-[11px] text-slate-400 mt-0.5">{scent.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
