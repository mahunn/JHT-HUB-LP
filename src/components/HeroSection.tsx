'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Gift } from 'lucide-react';
import { ProductData } from '@/types/landing';

interface HeroSectionProps {
  product: ProductData;
}

interface CarouselSlide {
  id: string;
  shortLabel: string;
  title: string;
  badge: string;
  isFree?: boolean;
  image: string;
  alt: string;
}

const slides: CarouselSlide[] = [
  {
    id: 'combo',
    shortLabel: '৩টি কম্বো একসাথে',
    title: 'স্পেশাল ৩-ইন-১ কম্বো সেট',
    badge: 'ধামাকা অফার • মোট ৪০০ গ্রাম',
    image: '/images/combo_showcase_3items.jpg',
    alt: 'JHT Food স্পেশাল ৩-ইন-১ আচার কম্বো',
  },
  {
    id: 'ilish',
    shortLabel: 'ইলিশ আচার',
    title: 'ইলিশ মাছের স্পেশাল আচার',
    badge: 'মূল পণ্য • ২০০ গ্রাম',
    image: '/images/ilish_achar_real.jpg',
    alt: 'ইলিশ মাছের স্পেশাল আচার ২০০ গ্রাম',
  },
  {
    id: 'gorur',
    shortLabel: 'গরুর আচার (ফ্রি)',
    title: 'গরুর মাংসের চুক্কা আচার',
    badge: 'উপহার • সম্পূর্ণ ফ্রি ১০০ গ্রাম 🎁',
    isFree: true,
    image: '/images/gorur_achar_real.jpg',
    alt: 'গরুর মাংসের চুক্কা আচার ১০০ গ্রাম',
  },
  {
    id: 'chingri',
    shortLabel: 'চিংড়ি বালাচাও (ফ্রি)',
    title: 'মচমচে চিংড়ি বালাচাও',
    badge: 'উপহার • সম্পূর্ণ ফ্রি ১০০ গ্রাম 🎁',
    isFree: true,
    image: '/images/chingri_balachao_real.jpg',
    alt: 'মচমচে চিংড়ি শুঁটকি বালাচাও ১০০ গ্রাম',
  },
];

export default function HeroSection({ product }: HeroSectionProps) {
  const defaultPackage = product.packages?.find((p) => p.isDefault) || product.packages?.[0];
  const offerPrice = defaultPackage ? defaultPackage.offerPrice : 799;
  const regularPrice = defaultPackage ? (defaultPackage.regularPrice || 1200) : 1200;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [isPaused]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40;
    if (distance > minSwipeDistance) {
      goToNext();
    } else if (distance < -minSwipeDistance) {
      goToPrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const scrollToOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('order') || document.getElementById('form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentSlide = slides[currentIndex];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#faf9f5] via-white to-[#fbfaf6] font-['Anek_Bangla',sans-serif] text-[#14532d] px-3 pb-10 sm:pb-14 box-border">
      {/* Subtle Warm Ambient Glow */}
      <div
        className="absolute w-72 h-72 -top-20 -right-20 rounded-full bg-amber-100/40 pointer-events-none blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute w-60 h-60 top-80 -left-20 rounded-full bg-emerald-50/50 pointer-events-none blur-3xl"
        aria-hidden="true"
      />

      <div className="relative max-w-[500px] mx-auto z-10 pt-4">
        {/* Brand Logo */}
        <div className="flex items-center justify-center mb-3">
          <div className="relative w-36 h-16 sm:w-44 sm:h-20 drop-shadow-sm transition-transform hover:scale-105">
            <Image
              src="/logo.png"
              alt="JHT Food"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Top Label */}
        <div className="flex items-center justify-center gap-2 mb-3 text-[#15803d] text-xs font-extrabold tracking-wider">
          <span>অফার</span>
          <i className="w-1.5 h-1.5 bg-[#15803d] rounded-full block" />
          <span>অফার</span>
          <i className="w-1.5 h-1.5 bg-[#15803d] rounded-full block" />
          <span>অফার</span>
        </div>

        {/* Visual Area with Interactive Carousel */}
        <div
          className="relative px-1 pt-1 pb-4 sm:pb-5 select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Clean Upright Frame with Soft Natural Elevation */}
          <div className="relative bg-white p-2 sm:p-2.5 rounded-3xl shadow-[0_18px_50px_-10px_rgba(0,0,0,0.12)] border border-slate-100/90 z-10">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
              {/* Slides */}
              {slides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-all duration-700 ease-out ${
                    idx === currentIndex
                      ? 'opacity-100 scale-100 pointer-events-auto'
                      : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                >
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    priority={idx === 0}
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}

              {/* Floating Top Badge */}
              <div className="absolute top-2.5 left-2.5 z-20">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-extrabold text-white shadow-lg backdrop-blur-md ${
                    currentSlide.isFree
                      ? 'bg-amber-600/90 border border-amber-400/40'
                      : 'bg-[#15803d]/90 border border-emerald-300/40'
                  }`}
                >
                  {currentSlide.isFree && <Gift className="w-3 h-3 text-amber-200" />}
                  <span>{currentSlide.badge}</span>
                </span>
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-2.5 inset-x-2.5 z-20">
                <div className="bg-black/65 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-white/20 text-center shadow-lg">
                  <div className="text-xs sm:text-sm font-extrabold tracking-wide drop-shadow-sm">
                    {currentSlide.title}
                  </div>
                </div>
              </div>

              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={goToPrev}
                aria-label="Previous Slide"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/45 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-110 active:scale-95"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={goToNext}
                aria-label="Next Slide"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/45 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-110 active:scale-95"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-1.5 mt-3 relative z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-6 bg-[#15803d]'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          {/* Quick Item Switcher Pills */}
          <div className="flex items-center justify-center gap-1.5 mt-2.5 relative z-20 flex-wrap px-1">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold transition-all duration-200 border ${
                  idx === currentIndex
                    ? 'bg-[#15803d] text-white border-[#15803d] shadow-sm scale-105'
                    : 'bg-white/90 text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                }`}
              >
                {slide.shortLabel}
              </button>
            ))}
          </div>
        </div>

        {/* ============================================================== */}
        {/* EYE-CATCHING PRICE BANNER CARD (EXACTLY MATCHING USER REFERENCE) */}
        {/* ============================================================== */}
        <div className="mt-4 mb-5 text-center">
          {/* Main Combo Headline */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-[#14532d] text-xs sm:text-sm font-black border border-emerald-300/80 shadow-xs mb-2">
            <Gift className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
            <span>ধামাকা ৩-ইন-১ অফার প্যাকেজ</span>
          </div>

          <h1 className="m-0 text-[#14532d] text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight">
            স্পেশাল ইলিশের আচার কম্বো
          </h1>

          {/* Deep Green Price Box with Red Cross & Yellow Double-Underline */}
          <div className="relative mt-3.5 mx-auto rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#14532d] via-[#166534] to-[#0f3d21] p-4 sm:p-6 text-white shadow-xl shadow-emerald-950/25 border-2 border-emerald-500/40 overflow-hidden">
            {/* Subtle radial sheen */}
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-400/20 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-amber-400/15 rounded-full blur-xl pointer-events-none" />

            {/* Line 1: Previous Price with RED CROSS (Clear & Legible 1200) */}
            <div className="relative z-10 flex items-center justify-center gap-2 text-base sm:text-lg md:text-xl font-bold text-white">
              <span className="tracking-wide text-emerald-100 font-extrabold">পূর্বের মূল্য</span>
              
              {/* Only 1200 has the clean red cross mark */}
              <span className="relative inline-flex items-center justify-center px-2.5 py-0.5 mx-1 font-black">
                {/* 1200 is large, spacious, and 100% clearly readable */}
                <span className="relative z-10 text-2xl sm:text-3xl font-black tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                  {regularPrice}
                </span>

                {/* Elegant, thin red cross that clearly marks without covering the numbers */}
                <svg
                  className="absolute -inset-x-2 -inset-y-2 w-[calc(100%+16px)] h-[calc(100%+16px)] pointer-events-none z-20"
                  viewBox="0 0 100 50"
                  preserveAspectRatio="none"
                >
                  <line
                    x1="8"
                    y1="42"
                    x2="92"
                    y2="8"
                    stroke="#ff3b30"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                  <line
                    x1="8"
                    y1="8"
                    x2="92"
                    y2="42"
                    stroke="#ff3b30"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>

              <span className="tracking-wide text-emerald-100 font-extrabold">টাকা</span>
            </div>

            {/* Line 2: Offer Price with YELLOW DOUBLE UNDERLINE (Maximum Contrast) */}
            <div className="relative z-10 mt-1 sm:mt-2.5 flex items-center justify-center flex-wrap gap-x-2.5 gap-y-1">
              <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                অফার মূল্য
              </span>
              <span className="relative inline-block text-3xl sm:text-4xl md:text-5xl font-black text-[#facc15] px-1 tracking-tight">
                <span>{offerPrice} টাকা</span>
                {/* Authentic Yellow Double Highlight Curve Underline */}
                <svg
                  className="absolute -bottom-2.5 sm:-bottom-3.5 left-0 w-full h-3.5 sm:h-4 text-amber-300 drop-shadow-md pointer-events-none"
                  viewBox="0 0 120 14"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M3 4C35 2.5 75 4.5 117 3.5"
                    stroke="#facc15"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6 10.5C40 9 80 11.5 114 10"
                    stroke="#facc15"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </div>

            {/* Savings Badge */}
            <div className="relative z-10 mt-4 flex items-center justify-center">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-600 text-white text-xs sm:text-sm font-black shadow-md border border-rose-400/50 animate-pulse">
                <span>🔥 সরাসরি ৪০১ টাকা সাশ্রয়!</span>
              </span>
            </div>
          </div>

          {/* ============================================================== */}
          {/* FREE PRODUCTS & FREE DELIVERY SHOWCASE (MAIN PROMINENT HIGHLIGHT) */}
          {/* ============================================================== */}
          <div className="mt-4 mx-auto rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-amber-50/50 border-2 border-emerald-400 p-3.5 sm:p-4 text-left shadow-lg">
            <div className="flex items-center justify-between mb-3 border-b border-emerald-200/90 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg">🎁</span>
                <span className="text-xs sm:text-sm font-black text-[#14532d] uppercase tracking-wide">
                  এই প্যাকেজে যা যা সম্পূর্ণ ফ্রি পাচ্ছেন:
                </span>
              </div>
              <span className="bg-[#15803d] text-white text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                ১০০% বিনামূল্যে
              </span>
            </div>

            {/* Free Items List */}
            <div className="space-y-2">
              {/* Free Item 1: Gorur Achar */}
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-emerald-200/80 shadow-xs hover:border-emerald-400 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center text-sm font-black shrink-0">
                    🎁
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-black text-slate-900 block leading-tight">
                      ১০০ গ্রাম গরুর মাংসের আচার
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold block truncate">
                      হাড় ছাড়া ফ্রেশ গরুর মাংসের তুলতুলে চুক্কা আচার
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-black shrink-0 border border-amber-300 shadow-xs">
                  সম্পূর্ণ ফ্রি
                </span>
              </div>

              {/* Free Item 2: Chingri Balachao */}
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-emerald-200/80 shadow-xs hover:border-emerald-400 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center text-sm font-black shrink-0">
                    🎁
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-black text-slate-900 block leading-tight">
                      ১০০ গ্রাম চিংড়ি শুঁটকি বালাচাও
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold block truncate">
                      মুচমুচে ফ্রেশ ভাজা পেঁয়াজ-রসুন ও স্পেশাল মশলা
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-black shrink-0 border border-amber-300 shadow-xs">
                  সম্পূর্ণ ফ্রি
                </span>
              </div>

              {/* Free Delivery */}
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-emerald-200/80 shadow-xs hover:border-emerald-400 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center text-sm font-black shrink-0">
                    🚚
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-black text-slate-900 block leading-tight">
                      সারা বাংলাদেশে ফ্রি হোম ডেলিভারি
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold block truncate">
                      অগ্রিম ১ টাকাও দিতে হবে না • চেক করে পেমেন্ট
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-[#15803d] text-xs font-black shrink-0 border border-emerald-300 shadow-xs">
                  ০ টাকা (ফ্রি)
                </span>
              </div>
            </div>

            {/* Total Weight Bottom Strip */}
            <div className="mt-3 pt-2.5 border-t border-emerald-200/90 flex items-center justify-between flex-wrap gap-2 text-xs font-black text-[#14532d]">
              <span>মোট প্যাকেজের ওজন:</span>
              <span className="text-[#14532d] bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 shadow-2xs">
                মোট ৪০০ গ্রাম (২০০ গ্রাম কিনলেই ২০০ গ্রাম ফ্রি!)
              </span>
            </div>
          </div>
        </div>

        {/* Order Button */}
        <div className="text-center">
          <a
            href="#order"
            onClick={scrollToOrder}
            className="group relative flex items-center justify-center gap-3.5 w-full min-h-[58px] px-5 py-3 rounded-2xl bg-gradient-to-r from-[#15803d] via-[#166534] to-[#14532d] text-white text-lg sm:text-xl font-extrabold tracking-wide shadow-xl shadow-emerald-800/30 hover:shadow-2xl hover:shadow-emerald-800/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 overflow-hidden no-underline"
          >
            {/* Animated Shine Effect */}
            <span
              className="absolute top-0 -left-[100%] w-[70%] h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-[20deg] animate-[orderShine_3.5s_infinite]"
              aria-hidden="true"
            />
            <span className="relative z-10">এখনই অর্ডার করুন</span>
            <b className="relative z-10 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold group-hover:translate-x-1 transition-transform">
              →
            </b>
          </a>
        </div>
      </div>
    </section>
  );
}
