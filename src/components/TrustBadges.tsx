'use client';

import { Banknote, CheckCircle2, RotateCcw, Truck, ShieldCheck, HeartHandshake, BadgeCheck } from 'lucide-react';
import { TrustBadge } from '@/types/landing';

interface TrustBadgesProps {
  trustBadges: TrustBadge[];
}

const iconMap: Record<string, any> = {
  Banknote,
  CheckCircle2,
  RotateCcw,
  Truck,
  ShieldCheck,
  HeartHandshake,
};

const colorMap = [
  { bg: 'bg-emerald-50', icon: 'bg-gradient-to-br from-emerald-600 to-emerald-700', shadow: 'shadow-emerald-600/20' },
  { bg: 'bg-blue-50', icon: 'bg-gradient-to-br from-blue-600 to-blue-700', shadow: 'shadow-blue-600/20' },
  { bg: 'bg-amber-50', icon: 'bg-gradient-to-br from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' },
  { bg: 'bg-purple-50', icon: 'bg-gradient-to-br from-purple-600 to-purple-700', shadow: 'shadow-purple-600/20' },
  { bg: 'bg-rose-50', icon: 'bg-gradient-to-br from-rose-500 to-rose-600', shadow: 'shadow-rose-500/20' },
  { bg: 'bg-teal-50', icon: 'bg-gradient-to-br from-teal-500 to-teal-600', shadow: 'shadow-teal-500/20' },
];

export default function TrustBadges({ trustBadges }: TrustBadgesProps) {
  return (
    <section className="py-14 px-4 bg-white relative overflow-hidden">
      {/* Subtle background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-50/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/60 text-slate-600 text-xs font-bold uppercase tracking-widest mb-3">
            <BadgeCheck className="w-3 h-3 text-emerald-600" />
            আমাদের প্রতিশ্রুতি
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            আস্থা রাখুন আস্থায় থাকুন
          </h2>
          <p className="text-slate-500 mt-1.5 text-sm font-medium max-w-sm mx-auto">
            আপনার সন্তুষ্টি ও নিরাপত্তাই আমাদের প্রথম অগ্রাধিকার
          </p>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {trustBadges.map((badge, idx) => {
            const IconComponent = iconMap[badge.iconName] || CheckCircle2;
            const colors = colorMap[idx % colorMap.length];
            return (
              <div
                key={badge.id || idx}
                className="group flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100/80 transition-all duration-300 card-hover"
              >
                <div className={`w-10 h-10 rounded-xl ${colors.icon} text-white flex items-center justify-center flex-shrink-0 shadow-md ${colors.shadow}`}>
                  <IconComponent className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm mb-0.5 group-hover:text-slate-900 transition-colors">{badge.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Free delivery banner */}
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-600 text-white text-center font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-700/20">
          <Truck className="w-5 h-5 flex-shrink-0" />
          <span>১০পিছ আতর কম্বো — সারা বাংলাদেশ ডেলিভারি চার্জ ফ্রি!</span>
        </div>
      </div>
    </section>
  );
}
