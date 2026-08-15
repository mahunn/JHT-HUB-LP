'use client';

import { BookOpen, Sparkles, Heart } from 'lucide-react';

export default function HadithSection() {
  return (
    <section className="py-8 px-4 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white relative overflow-hidden my-4 rounded-3xl max-w-4xl mx-auto shadow-2xl border-2 border-amber-400/40">
      {/* Decorative Gold Rings */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 text-center space-y-3 px-2 sm:px-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-bold shadow-sm">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>আতর সম্পর্কে নবী (সা.)-এর একটি হাদিস</span>
        </div>

        <blockquote className="text-base sm:text-xl font-bold text-amber-100 leading-relaxed max-w-2xl mx-auto">
          "যে ব্যক্তি ১০ দিরহাম আয় করে, তারপর সে যদি তার থেকে ১ দিরহাম সুগন্ধি ক্রয়ে ব্যয় না করে, তবে সে মূর্খতার কাজ করলো।"
        </blockquote>

        <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-300/90 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-700/50">
          <span>📚 মুসনাদুল ফিরদাউস: ৫৯৫৪</span>
        </div>
      </div>
    </section>
  );
}
