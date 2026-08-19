'use client';

import { useState } from 'react';
import { Crown, Compass, Sparkles, Star } from 'lucide-react';
import { ScentItem } from '@/types/landing';

interface ScentsBreakdownProps {
  scents: ScentItem[];
}

export default function ScentsBreakdown({ scents }: ScentsBreakdownProps) {
  const arabianScents = scents.filter((s) => s.category === 'arabian');
  const perfumeScents = scents.filter((s) => s.category === 'perfume');

  const [activeTab, setActiveTab] = useState<'arabian' | 'perfume'>('arabian');
  const activeScents = activeTab === 'arabian' ? arabianScents : perfumeScents;

  return (
    <section className="py-10 px-4 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-2">
            <Sparkles className="w-3 h-3" />
            এক্সক্লুসিভ কালেকশন
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            যেসব প্রিমিয়াম সুবাস আপনি পাবেন
          </h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mb-4 p-1 bg-slate-100 rounded-xl max-w-sm mx-auto">
          <button
            onClick={() => setActiveTab('arabian')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all duration-300 ${
              activeTab === 'arabian'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            এরাবিয়ান ({arabianScents.length})
          </button>
          <button
            onClick={() => setActiveTab('perfume')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all duration-300 ${
              activeTab === 'perfume'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            পারফিউম ({perfumeScents.length})
          </button>
        </div>

        {/* Compact Scent Grid */}
        <div className="grid grid-cols-2 gap-2">
          {activeScents.map((scent, idx) => (
            <div
              key={scent.id || idx}
              className={`group flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-slate-100 hover:shadow-md transition-all duration-300 card-hover ${
                activeTab === 'arabian'
                  ? 'hover:border-amber-200/60 hover:shadow-amber-50'
                  : 'hover:border-blue-200/60 hover:shadow-blue-50'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-lg text-white flex items-center justify-center font-extrabold text-[10px] flex-shrink-0 shadow-sm ${
                  activeTab === 'arabian'
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-400/20'
                    : 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-400/20'
                }`}
              >
                {idx + 1}
              </span>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-800 text-xs leading-snug">{scent.name}</h4>
                {scent.notes && (
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{scent.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary line */}
        <p className="text-center text-[11px] text-slate-400 mt-3 font-medium">
          মোট {scents.length}টি প্রিমিয়াম সুবাস • ১০০% অ্যালকোহল মুক্ত
        </p>
      </div>
    </section>
  );
}
