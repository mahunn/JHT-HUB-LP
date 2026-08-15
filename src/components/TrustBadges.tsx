'use client';

import { Banknote, CheckCircle2, RotateCcw, Truck, ShieldCheck, HeartHandshake } from 'lucide-react';
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

export default function TrustBadges({ trustBadges }: TrustBadgesProps) {
  return (
    <section className="py-10 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            আস্থা রাখুন আস্থায় থাকুন
          </h2>
          <p className="text-slate-500 mt-1 text-xs sm:text-sm font-medium">
            আপনার সন্তুষ্টি ও নিরাপত্তাই আমাদের প্রথম অগ্রাধিকার
          </p>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {trustBadges.map((badge, idx) => {
            const IconComponent = iconMap[badge.iconName] || CheckCircle2;
            return (
              <div
                key={badge.id || idx}
                className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 hover:bg-emerald-50/50 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm mb-0.5">{badge.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Free delivery banner */}
        <div className="mt-5 p-3 rounded-xl bg-emerald-700 text-white text-center font-semibold text-sm flex items-center justify-center gap-2">
          <Truck className="w-4 h-4 flex-shrink-0" />
          <span>১০পিছ আতর কম্বো — সারা বাংলাদেশ ডেলিভারি চার্জ ফ্রি!</span>
        </div>
      </div>
    </section>
  );
}
