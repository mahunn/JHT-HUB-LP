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
    <section className="py-8 px-4 bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-xl relative">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              আস্থা রাখুন আস্থায় থাকুন
            </h2>
            <p className="text-slate-600 mt-1 text-xs sm:text-sm font-medium">
              আপনার সন্তুষ্টি ও নিরাপত্তাই আমাদের প্রথম অগ্রাধিকার
            </p>
          </div>

          {/* Guarantee Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {trustBadges.map((badge, idx) => {
              const IconComponent = iconMap[badge.iconName] || CheckCircle2;
              return (
                <div
                  key={badge.id || idx}
                  className="flex items-start gap-3.5 p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/60 hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-0.5">{badge.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{badge.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 10 Pcs Free Delivery Highlight */}
          <div className="mt-6 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-700 text-white text-center font-bold text-sm sm:text-base shadow-md flex items-center justify-center gap-2">
            <Truck className="w-5 h-5 text-amber-300 flex-shrink-0" />
            <span>১০পিছ আতর কম্বো — সাথে সারা বাংলাদেশ ডেলিভারি চার্জ সম্পূর্ণ ফ্রি!</span>
          </div>
        </div>
      </div>
    </section>
  );
}
