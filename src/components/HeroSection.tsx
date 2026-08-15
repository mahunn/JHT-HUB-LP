'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, Flame, ShieldCheck, Truck, RefreshCw, CheckCircle } from 'lucide-react';
import { ProductData } from '@/types/landing';

interface HeroSectionProps {
  product: ProductData;
}

export default function HeroSection({ product }: HeroSectionProps) {
  const [selectedImage, setSelectedImage] = useState(product.mainBannerImage || product.galleryImages[0]);

  const scrollToOrder = () => {
    const el = document.getElementById('ordernowyet');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-6 pb-12 px-4 bg-gradient-to-b from-emerald-50/50 via-white to-slate-50 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-200/50 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Brand Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-800 font-semibold text-sm mb-4 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span>{product.brandName}</span>
        </div>

        {/* Dynamic Headlines matching reference site */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-2">
          <span className="text-emerald-700">{product.headlinePre} </span>
          <span className="text-red-600 underline decoration-amber-400 decoration-wavy decoration-2">
            {product.headlineHighlight}
          </span>
        </h1>

        <p className="text-lg sm:text-2xl font-bold text-blue-700 mb-2">
          {product.headlinePost}
        </p>

        <div className="inline-block bg-amber-500 text-slate-950 font-bold px-4 py-1 rounded-lg text-sm sm:text-base mb-6 shadow-sm">
          {product.freeDeliveryHeadline}
        </div>

        {/* Product Visual Gallery */}
        <div className="my-6 max-w-xl mx-auto bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-slate-200">
          <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 group">
            <Image
              src={selectedImage || product.mainBannerImage}
              alt={product.productName}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
            {/* Discount Badge on top of image */}
            <div className="absolute top-3 left-3 bg-red-600 text-white text-xs sm:text-sm font-extrabold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
              <Flame className="w-4 h-4 text-amber-300 animate-bounce" />
              <span>ধামাকা অফার</span>
            </div>
            
            {product.packages[0] && (
              <div className="absolute bottom-3 right-3 bg-emerald-700/95 text-white backdrop-blur-sm text-sm sm:text-base font-extrabold px-3.5 py-1.5 rounded-xl shadow-lg border border-emerald-400/40">
                মাত্র ৳{product.packages[0].offerPrice}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.galleryImages && product.galleryImages.length > 1 && (
            <div className="flex items-center justify-center gap-2 sm:gap-3 mt-3 overflow-x-auto py-1">
              {product.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === img
                      ? 'border-emerald-600 ring-2 ring-emerald-400 scale-105'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Gallery thumbnail ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Stock Scarcity Bar */}
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-xl p-3 mb-6">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-red-700 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-red-600 animate-pulse" />
              স্টক সীমিত! দ্রুত অর্ডার করুন
            </span>
            <span>আর মাত্র {product.stockCount} টি কম্বো বাকি!</span>
          </div>
          <div className="w-full bg-red-200 h-2.5 rounded-full overflow-hidden">
            <div className="bg-red-600 h-full rounded-full transition-all duration-1000 w-[78%]" />
          </div>
        </div>

        {/* High Converting Glowing CTA Button */}
        <div className="mb-8">
          <button
            onClick={scrollToOrder}
            className="btn-pulse-order inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-700 hover:to-green-800 text-white font-bold text-xl sm:text-2xl px-8 sm:px-12 py-4 sm:py-5 rounded-full shadow-2xl transition-all duration-300 border-2 border-emerald-400/50 group"
          >
            <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>অর্ডার করতে চাই</span>
          </button>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            🔒 অগ্রিম কোনো টাকা লাগবে না • পণ্য হাতে পেয়ে মূল্য দিন
          </p>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-4 border-t border-slate-200/80">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2.5 justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-slate-700">১০০% হালাল ও খাঁটি</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2.5 justify-center">
            <Truck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-slate-700">ফ্রী হোম ডেলিভারি</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2.5 justify-center">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-slate-700">দেখে নেওয়ার সুযোগ</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2.5 justify-center">
            <RefreshCw className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-slate-700">সহজ রিটার্ন সুবিধা</span>
          </div>
        </div>
      </div>
    </section>
  );
}
