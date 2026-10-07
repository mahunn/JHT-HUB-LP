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

        {/* Main Offer Title Area */}
        <div className="text-center px-2 mt-2">
          <h1 className="m-0 text-[#14532d] text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
            মাত্র <span className="text-[#15803d]">৳{offerPrice} টাকায়</span>
          </h1>

          <div className="inline-block mt-1 text-[#166534] text-2xl sm:text-3xl font-extrabold leading-tight">
            স্পেশাল ইলিশের আচার কম্বো
          </div>

          {/* Offer Line */}
          <p className="mt-3 mb-6 text-[#374151] text-sm sm:text-base leading-relaxed font-semibold">
            <strong className="text-[#15803d] font-extrabold">গরুর আচার ও চিংড়ি বালাচাও ফ্রি</strong>
            <b className="mx-2 text-[#9ca3af] font-normal">+</b>
            <strong className="text-[#15803d] font-extrabold">ডেলিভারি চার্জ ফ্রি</strong>
          </p>
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
