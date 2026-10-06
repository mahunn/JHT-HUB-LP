'use client';

import Image from 'next/image';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const visualFeatures = [
  {
    image: '/images/feature_mustard_oil.jpg',
    badge: '১০০% খাঁটি তেল',
    title: 'কাঠের ঘানিভাঙা সরিষার তেল',
    sub: 'কোনো কেমিক্যাল বা প্রিজারভেটিভ নেই'
  },
  {
    image: '/images/feature_fresh_ingredients.jpg',
    badge: 'তাজা ও খাঁটি',
    title: 'তাজা মাছ ও প্রিমিয়াম বিফ',
    sub: 'নদীর রূপালী ইলিশ ও হাড় ছাড়া গরুর মাংস'
  },
  {
    image: '/images/feature_hot_khichuri.jpg',
    badge: 'লোভনীয় স্বাদ',
    title: 'গরম ভাত ও খিচুড়ির পারফেক্ট সঙ্গী',
    sub: 'মুখে লেগে থাকার মতো ঘরোয়া মায়ের হাতের স্বাদ'
  },
  {
    image: '/images/feature_delivery_box.jpg',
    badge: '০ টাকা ডেলিভারি',
    title: 'সারা দেশে ফ্রি হোম ডেলিভারি',
    sub: 'নিরাপদ প্যাকেজিং ও ক্যাশ অন ডেলিভারি'
  }
];

import { ProductFeature } from '@/types/landing';

interface FeaturesGridProps {
  features?: ProductFeature[];
}

export default function FeaturesGrid({ features }: FeaturesGridProps = {}) {
  return (
    <section className="py-12 px-3 sm:px-4 bg-emerald-950 text-white relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 font-black text-xs uppercase tracking-wider mb-2 border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>খাঁটি স্বাদের নিশ্চয়তা</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            কেন JHT Food এর আচারই সেরা?
          </h2>
        </div>

        {/* 4 Rich Visual Photo Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {visualFeatures.map((item, idx) => (
            <div
              key={idx}
              className="group bg-emerald-900/50 rounded-2xl overflow-hidden border border-emerald-700/60 shadow-lg hover:border-amber-400/60 transition-all duration-300 flex flex-col"
            >
              {/* Photo Area */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
                {/* Floating Badge */}
                <div className="absolute top-2 left-2 bg-slate-950/85 backdrop-blur-sm text-amber-300 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-md border border-amber-400/30 shadow-xs">
                  {item.badge}
                </div>
              </div>

              {/* Minimal Text Label */}
              <div className="p-3 text-center flex-1 flex flex-col justify-center">
                <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition-colors leading-tight">
                  {item.title}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-emerald-200/70 mt-1 font-medium leading-snug">
                  {item.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
