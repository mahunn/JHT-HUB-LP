'use client';

import { useState } from 'react';
import Image from 'next/image';

interface OfferItem {
  id: string;
  name: string;
  weight: string;
  badge: string;
  badgeType: 'main' | 'free';
  tag: string;
  tagType: 'main' | 'free';
  description: string;
  image: string;
  alt: string;
}

const items: OfferItem[] = [
  {
    id: 'ilish',
    name: 'ইলিশের আচার',
    weight: '২০০ গ্রাম',
    badge: '২০০ গ্রাম',
    badgeType: 'main',
    tag: 'মূল পণ্য',
    tagType: 'main',
    description: 'ঘরোয়া স্বাদের খাঁটি ইলিশের আচার',
    image: '/images/ilish_achar_real.jpg',
    alt: 'ইলিশের আচার ২০০ গ্রাম',
  },
  {
    id: 'gorur',
    name: 'গরুর মাংসের আচার',
    weight: '১০০ গ্রাম (ফ্রি)',
    badge: '১০০% ফ্রি 🎁',
    badgeType: 'free',
    tag: 'সম্পূর্ণ ফ্রি উপহার',
    tagType: 'free',
    description: 'তুলতুলে নরম গরুর চুক্কা মাংসের আচার',
    image: '/images/gorur_achar_real.jpg',
    alt: 'গরুর মাংসের আচার ১০০ গ্রাম',
  },
  {
    id: 'chingri',
    name: 'চিংড়ি বালাচাও',
    weight: '১০০ গ্রাম (ফ্রি)',
    badge: '১০০% ফ্রি 🎁',
    badgeType: 'free',
    tag: 'সম্পূর্ণ ফ্রি উপহার',
    tagType: 'free',
    description: 'মুচমুচে ফ্রেশ স্বাদের চিংড়ি বালাচাও',
    image: '/images/chingri_balachao_real.jpg',
    alt: 'চিংড়ি বালাচাও ১০০ গ্রাম',
  },
];

export default function ComboItemsBreakdown() {
  const [activeLightboxImg, setActiveLightboxImg] = useState<{ src: string; alt: string } | null>(null);

  const openLightbox = (src: string, alt: string) => {
    setActiveLightboxImg({ src, alt });
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };

  const closeLightbox = () => {
    setActiveLightboxImg(null);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  };

  return (
    <section className="w-full max-w-5xl mx-auto py-10 sm:py-14 px-3 sm:px-4 box-border font-['Anek_Bangla','Hind_Siliguri',sans-serif] text-[#14532d]">
      {/* Header */}
      <div className="text-center mb-7 sm:mb-9">
        <span className="inline-block px-3.5 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-[#15803d] text-xs font-bold mb-2">
          বিশেষ অফার প্যাকেজ
        </span>
        <h2 className="m-0 text-[#14532d] text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight">
          যা যা পাচ্ছেন
        </h2>
        <p className="mt-1.5 text-[#4b5563] text-xs sm:text-sm font-semibold">
          ইলিশের আচারের সাথে থাকছে দারুণ দুটি স্পেশাল উপহার
        </p>
      </div>

      {/* 3 Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
          >
            {/* Image Container with Badge */}
            <div
              className="relative w-full aspect-[4/3] overflow-hidden bg-slate-50 cursor-zoom-in"
              onClick={() => openLightbox(item.image, item.alt)}
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />

              {/* Corner Weight / Free Badge */}
              <div
                className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-md z-10 ${
                  item.badgeType === 'main'
                    ? 'bg-[#15803d]'
                    : 'bg-[#d97706]'
                }`}
              >
                {item.badge}
              </div>
            </div>

            {/* Content Area */}
            <div className="p-3.5 sm:p-4 text-center flex-1 flex flex-col justify-between">
              <div>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold mb-1.5 ${
                    item.tagType === 'main'
                      ? 'bg-emerald-50 text-[#15803d]'
                      : 'bg-amber-50 text-[#b45309]'
                  }`}
                >
                  {item.tag}
                </span>

                <h3 className="m-0 mb-1 text-[#14532d] text-lg sm:text-xl font-extrabold leading-snug">
                  {item.name}
                </h3>

                <p className="m-0 mx-auto text-[#6b7280] text-xs sm:text-[13px] leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Weight Pill Button */}
              <div className="mt-3">
                <span
                  className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 min-h-[34px] rounded-full text-sm font-extrabold whitespace-nowrap shadow-sm border ${
                    item.tagType === 'main'
                      ? 'bg-emerald-50/80 text-[#15803d] border-emerald-200/80'
                      : 'bg-amber-50/80 text-[#b45309] border-amber-200/80'
                  }`}
                >
                  <span className="text-sm">{item.tagType === 'main' ? '⚖' : '🎁'}</span>
                  <span>{item.weight}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Image Lightbox Modal */}
      {activeLightboxImg && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[999999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close"
            className="fixed top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white text-2xl flex items-center justify-center cursor-pointer transition-transform hover:rotate-90 z-[1000000]"
          >
            ✕
          </button>

          <div
            className="relative max-w-[92vw] max-h-[88vh] aspect-auto overflow-hidden rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeLightboxImg.src}
              alt={activeLightboxImg.alt}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </section>
  );
}
