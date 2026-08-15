'use client';

import { BookOpen } from 'lucide-react';

export default function HadithSection() {
  return (
    <section className="py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-emerald-900 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden">
          {/* Subtle pattern */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/25 text-amber-300 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>আতর সম্পর্কে হাদিস</span>
            </div>

            <blockquote className="text-base sm:text-lg font-semibold text-emerald-50 leading-relaxed max-w-lg mx-auto">
              &ldquo;যে ব্যক্তি ১০ দিরহাম আয় করে, তারপর সে যদি তার থেকে ১ দিরহাম সুগন্ধি ক্রয়ে ব্যয় না করে, তবে সে মূর্খতার কাজ করলো।&rdquo;
            </blockquote>

            <p className="text-xs font-medium text-amber-300/70">
              📚 মুসনাদুল ফিরদাউস: ৫৯৫৪
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
