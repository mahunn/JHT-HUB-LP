'use client';

import { Sparkles, Crown, Compass, Droplet } from 'lucide-react';
import { ScentItem } from '@/types/landing';

interface ScentsBreakdownProps {
  scents: ScentItem[];
}

export default function ScentsBreakdown({ scents }: ScentsBreakdownProps) {
  const arabianScents = scents.filter((s) => s.category === 'arabian');
  const perfumeScents = scents.filter((s) => s.category === 'perfume');

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs sm:text-sm mb-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>এক্সক্লুসিভ কালেকশন</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            যেসব প্রিমিয়াম সুবাস আপনি পাবেন
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base font-medium">
            প্রতিটি আতর ১০০% অ্যালকোহল মুক্ত, দীর্ঘস্থায়ী এবং মন মাতানো সুবাসে ভরপুর
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Arabian Type Scents */}
          <div className="bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 border-2 border-amber-300/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-amber-200">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                <Crown className="w-6 h-6 text-amber-100" />
              </div>
              <div>
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">রাজকীয় সুবাস</span>
                <h3 className="text-xl font-bold text-slate-900">এরাবিয়ান টাইপ আতর</h3>
              </div>
            </div>

            <div className="space-y-3">
              {arabianScents.map((scent, idx) => (
                <div
                  key={scent.id || idx}
                  className="flex items-start gap-3 p-3 bg-white rounded-xl border border-amber-200/70 shadow-sm hover:border-amber-400 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{scent.name}</h4>
                    {scent.notes && <p className="text-xs text-slate-500 font-medium">{scent.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Perfume Type Scents */}
          <div className="bg-gradient-to-br from-blue-50/70 via-white to-blue-50/30 border-2 border-blue-300/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-blue-200">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <Compass className="w-6 h-6 text-blue-100" />
              </div>
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">মডার্ন ও ট্রেন্ডি</span>
                <h3 className="text-xl font-bold text-slate-900">পারফিউম টাইপ আতর</h3>
              </div>
            </div>

            <div className="space-y-3">
              {perfumeScents.map((scent, idx) => (
                <div
                  key={scent.id || idx}
                  className="flex items-start gap-3 p-3 bg-white rounded-xl border border-blue-200/70 shadow-sm hover:border-blue-400 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{scent.name}</h4>
                    {scent.notes && <p className="text-xs text-slate-500 font-medium">{scent.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mid-page quick order trigger */}
        <div className="text-center mt-8">
          <a
            href="#ordernowyet"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold px-6 py-3 rounded-full shadow-md hover:from-emerald-700 hover:to-green-700 transition-all text-base"
          >
            <Droplet className="w-4 h-4 text-amber-300" />
            <span>কম্বোটি নিজের করতে ক্লিক করুন</span>
          </a>
        </div>
      </div>
    </section>
  );
}
