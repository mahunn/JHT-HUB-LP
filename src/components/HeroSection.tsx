'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, ShieldCheck, Truck, CheckCircle, RotateCcw, Star } from 'lucide-react';
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
    <section className="pt-5 pb-10 px-4 bg-gradient-to-b from-white via-white to-slate-50/50">
      <div className="max-w-3xl mx-auto">
        {/* Brand Logo — no redundant text */}
        <div className="flex items-center justify-center mb-5 animate-fade-up">
          <div className="relative w-40 h-16 sm:w-48 sm:h-20 drop-shadow-sm">
            <Image
              src="/logo.png"
              alt={product.brandName || 'JHT HUB'}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Headlines */}
        <div className="text-center mb-6 animate-fade-up delay-100" style={{ opacity: 0 }}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-2.5 tracking-tight">
            {product.headlinePre}{' '}
            <span className="text-gradient">{product.headlineHighlight}</span>
          </h1>
          <p className="text-base sm:text-lg font-semibold text-slate-500 mb-4 max-w-lg mx-auto">
            {product.headlinePost}
          </p>
          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-700 to-emerald-600 text-white font-bold px-5 py-2 rounded-full text-sm shadow-lg shadow-emerald-700/20">
            <Truck className="w-4 h-4" />
            {product.freeDeliveryHeadline}
          </span>
        </div>

        {/* Product Image Gallery */}
        <div className="mb-6 animate-scale-in delay-200" style={{ opacity: 0 }}>
          <div className="relative aspect-square w-full max-w-md mx-auto rounded-2xl overflow-hidden bg-slate-100 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/50">
            <Image
              src={selectedImage || product.mainBannerImage}
              alt={product.productName}
              fill
              className="object-cover"
              priority
            />
            {product.packages[0] && (
              <div className="absolute bottom-3 right-3 bg-gradient-to-r from-emerald-700 to-emerald-600 text-white text-sm font-extrabold px-4 py-2 rounded-xl shadow-lg backdrop-blur-sm">
                মাত্র ৳{product.packages[0].offerPrice}
              </div>
            )}
            {/* Decorative corner accent */}
            <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-br-3xl" />
          </div>

          {/* Thumbnails */}
          {product.galleryImages && product.galleryImages.length > 1 && (
            <div className="flex items-center justify-center gap-2.5 mt-4">
              {product.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${
                    selectedImage === img
                      ? 'border-emerald-600 shadow-lg shadow-emerald-600/20 scale-105'
                      : 'border-slate-200 opacity-50 hover:opacity-100 hover:border-slate-300'
                  }`}
                >
                  <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Stock indicator */}
        <div className="max-w-md mx-auto mb-6 animate-fade-up delay-300" style={{ opacity: 0 }}>
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              স্টক সীমিত — দ্রুত অর্ডার করুন
            </span>
            <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-full">আর {product.stockCount} টি বাকি</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 h-full rounded-full w-[22%] transition-all" />
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mb-7 animate-fade-up delay-400" style={{ opacity: 0 }}>
          <button
            onClick={scrollToOrder}
            className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 active:from-emerald-900 active:to-emerald-800 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-xl shadow-emerald-700/25 transition-all duration-300 w-full sm:w-auto animate-pulse-glow"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>অর্ডার করতে চাই</span>
          </button>
          <p className="text-[11px] text-slate-400 mt-2.5 font-medium flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            অগ্রিম কোনো টাকা লাগবে না • পণ্য হাতে পেয়ে মূল্য দিন
          </p>
        </div>

        {/* Trust Highlights */}
        <div className="grid grid-cols-2 gap-2.5 max-w-md mx-auto animate-fade-up delay-500" style={{ opacity: 0 }}>
          {[
            { icon: ShieldCheck, text: '১০০% হালাল ও খাঁটি', color: 'text-emerald-600 bg-emerald-50' },
            { icon: Truck, text: 'ফ্রী হোম ডেলিভারি', color: 'text-blue-600 bg-blue-50' },
            { icon: CheckCircle, text: 'দেখে নেওয়ার সুযোগ', color: 'text-amber-600 bg-amber-50' },
            { icon: RotateCcw, text: 'সহজ রিটার্ন সুবিধা', color: 'text-purple-600 bg-purple-50' },
          ].map(({ icon: Icon, text, color }, idx) => (
            <div key={idx} className="flex items-center gap-2.5 py-2.5 px-3.5 rounded-xl bg-white border border-slate-100 shadow-sm text-xs sm:text-sm font-semibold text-slate-700 card-hover">
              <div className={`w-7 h-7 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
