'use client';

import { BookOpen, Quote } from 'lucide-react';

export default function HadithSection() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 rounded-3xl p-7 sm:p-10 text-center overflow-hidden shadow-2xl shadow-emerald-900/30">
          {/* Decorative pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:18px_18px]" />
          
          {/* Decorative corner ornaments */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-amber-400/10 to-transparent rounded-br-full" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-amber-400/10 to-transparent rounded-tl-full" />

          <div className="relative z-10 space-y-5">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/20 text-amber-300 text-xs font-bold backdrop-blur-sm">
              <BookOpen className="w-3.5 h-3.5" />
              <span>আতর সম্পর্কে হাদিস</span>
            </div>

            {/* Quote mark */}
            <div className="flex justify-center">
              <Quote className="w-8 h-8 text-amber-400/30 rotate-180" />
            </div>

            <blockquote className="text-base sm:text-lg md:text-xl font-semibold text-emerald-50 leading-relaxed max-w-lg mx-auto">
              যে ব্যক্তি ১০ দিরহাম আয় করে, তারপর সে যদি তার থেকে ১ দিরহাম সুগন্ধি ক্রয়ে ব্যয় না করে, তবে সে মূর্খতার কাজ করলো।
            </blockquote>

            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mx-auto" />

            <p className="text-xs font-semibold text-amber-300/60 tracking-wide">
              📚 মুসনাদুল ফিরদাউস: ৫৯৫৪
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
