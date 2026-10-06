'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingBag, ShieldCheck, Truck, CheckCircle2, Flame, Gift, Sparkles, Heart } from 'lucide-react';
import { ProductData } from '@/types/landing';

interface HeroSectionProps {
  product: ProductData;
}

export default function HeroSection({ product }: HeroSectionProps) {
  const [selectedImage, setSelectedImage] = useState(product.mainBannerImage || product.galleryImages[0]);

  useEffect(() => {
    if (product.mainBannerImage) {
      setSelectedImage(product.mainBannerImage);
    }
  }, [product.mainBannerImage]);

  const scrollToOrder = () => {
    const el = document.getElementById('ordernowyet');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const defaultPackage = product.packages?.find((p) => p.isDefault) || product.packages?.[0];
  const offerPrice = defaultPackage ? defaultPackage.offerPrice : 799;
  const regularPrice = defaultPackage ? defaultPackage.regularPrice : 1450;
  const discountAmount = regularPrice - offerPrice;

  return (
    <section className="pt-4 pb-10 px-3 sm:px-4 bg-gradient-to-b from-amber-50/40 via-white to-emerald-50/20">
      <div className="max-w-3xl mx-auto">
        {/* Brand Logo */}
        <div className="flex items-center justify-center mb-4">
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

        {/* Catchy Urgency Badge */}
        <div className="text-center mb-3">
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-amber-600 text-white font-extrabold px-4 py-1.5 rounded-full text-xs sm:text-sm shadow-md animate-pulse">
            <Flame className="w-4 h-4 fill-amber-300 text-amber-300" />
            সীমিত সময়ের মেগা অফার — দ্রুত অর্ডার করুন!
          </span>
        </div>

        {/* Main Headlines - Clear Bengali for everyday people */}
        <div className="text-center mb-5">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight">
            ২০০ গ্রাম ইলিশের আচার নিলেই{' '}
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 inline-block mt-1">
              গরু ও চিংড়ি বালাচাও সম্পূর্ণ ফ্রি!
            </span>
          </h1>
        </div>

        {/* Simplified Price & Free Delivery Banner */}
        <div className="my-4 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 rounded-2xl p-3.5 sm:p-4 text-white shadow-lg border border-emerald-600/40 text-center">
          <div className="flex items-center justify-center gap-2.5 mb-1">
            <span className="text-emerald-200/80 text-sm line-through font-semibold">
              ৳{regularPrice}
            </span>
            <span className="text-3xl sm:text-4xl font-black text-amber-300 tracking-tight">
              মাত্র ৳{offerPrice} টাকা
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-100">
            <Truck className="w-4 h-4 text-amber-400 stroke-[2.5]" />
            <span>সারা বাংলাদেশে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি!</span>
          </div>
        </div>

        {/* Product Image Showcase */}
        <div className="mb-6">
          <div className="relative aspect-square w-full max-w-md mx-auto rounded-3xl overflow-hidden bg-slate-100 shadow-2xl shadow-emerald-900/15 border-4 border-white ring-1 ring-slate-200">
            <Image
              src={selectedImage || '/images/combo_banner.jpg'}
              alt="JHT Food Achar Combo"
              fill
              className="object-cover transition-opacity duration-300"
              priority
              unoptimized
            />

            {/* Badge on Image */}
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-amber-600 text-white text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5">
              <Gift className="w-4 h-4 fill-white" />
              <span>১টি কিনলে ২টি ফ্রি!</span>
            </div>

            <div className="absolute bottom-3 right-3 bg-slate-950/85 backdrop-blur-md text-amber-400 text-sm sm:text-base font-black px-4 py-2 rounded-xl shadow-lg border border-amber-400/30">
              মাত্র ৳{offerPrice} <span className="text-xs text-white font-normal">(ডেলিভারি ফ্রি)</span>
            </div>
          </div>

          {/* Gallery Thumbnails */}
          {product.galleryImages && product.galleryImages.length > 1 && (
            <div className="flex items-center justify-center gap-2 sm:gap-3 mt-3.5 px-2">
              {product.galleryImages.map((img, idx) => {
                const labels = ['৩টি কম্বো সেট', 'ইলিশ আচার (২০০ গ্রাম)', 'গরুর আচার (১০০ গ্রাম)', 'চিংড়ি বালাচাও (১০০ গ্রাম)'];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 group ${
                      selectedImage === img
                        ? 'border-emerald-600 ring-2 ring-emerald-500/40 shadow-lg scale-105'
                        : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-emerald-300'
                    }`}
                  >
                    <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover" unoptimized />
                    <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[9px] text-white font-bold py-0.5 text-center truncate px-0.5">
                      {labels[idx] || `ছবি ${idx + 1}`}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Combo Content Cards Summary */}
        <div className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-sm mb-6 max-w-lg mx-auto">
          <h3 className="text-xs sm:text-sm font-black text-slate-800 mb-2.5 text-center flex items-center justify-center gap-1.5 text-emerald-800">
            <Gift className="w-4 h-4 text-emerald-600" />
            এই কম্বো প্যাকে আপনি যা যা পাচ্ছেন:
          </h3>
          <div className="space-y-2 text-xs sm:text-sm font-bold text-slate-700">
            <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/70 border border-amber-100">
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[11px] flex items-center justify-center font-black">১</span>
                ইলিশ মাছের স্পেশাল আচার
              </span>
              <span className="text-emerald-700 font-extrabold bg-white px-2 py-0.5 rounded-md border border-amber-200">
                ২০০ গ্রাম
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/70 border border-emerald-100">
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] flex items-center justify-center font-black">২</span>
                গরুর মাংসের চুক্কা আচার
              </span>
              <span className="text-red-600 font-extrabold bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                ১০০ গ্রাম (ফ্রি 🎁)
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/70 border border-emerald-100">
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] flex items-center justify-center font-black">৩</span>
                মচমচে চিংড়ি শুঁটকি বালাচাও
              </span>
              <span className="text-red-600 font-extrabold bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                ১০০ গ্রাম (ফ্রি 🎁)
              </span>
            </div>
          </div>
          <div className="mt-2 text-center text-[11px] font-bold text-slate-500 pt-1 border-t border-slate-100">
            মোট পরিমাণ: <span className="text-slate-900 font-black">৪০০ গ্রাম</span> • সম্পূর্ণ মূল্য: <span className="text-emerald-700 font-black">৳৭৯৯</span> (ডেলিভারি ফ্রি)
          </div>
        </div>

        {/* Primary Giant CTA Button */}
        <div className="text-center mb-6">
          <button
            onClick={scrollToOrder}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white font-black text-lg sm:text-xl px-10 py-4 sm:py-5 rounded-2xl shadow-xl shadow-emerald-700/30 transition-all duration-300 active:scale-95 animate-pulse-glow"
          >
            <ShoppingBag className="w-6 h-6" />
            <span>অর্ডার করতে এখানে চাপ দিন — ৳৭৯৯</span>
          </button>
          <p className="text-xs text-slate-500 mt-2.5 font-bold flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            অগ্রিম কোনো টাকা দিতে হবে না • ডেলিভারি চার্জ সম্পূর্ণ ফ্রি
          </p>
        </div>

        {/* 4 Trust Highlights for Bangladeshis */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-lg mx-auto">
          {[
            { icon: Truck, title: 'ডেলিভারি চার্জ একদম ফ্রি', desc: 'সারা দেশে ০ টাকা', color: 'text-emerald-700 bg-emerald-100/60' },
            { icon: ShieldCheck, title: 'ক্যাশ অন ডেলিভারি', desc: 'হাতে পেয়ে টাকা দিন', color: 'text-blue-700 bg-blue-100/60' },
            { icon: CheckCircle2, title: 'খুলে দেখে নেওয়ার সুযোগ', desc: '১০০% নিশ্চিত হয়ে নিন', color: 'text-amber-700 bg-amber-100/60' },
            { icon: Heart, title: '১০০% খাঁটি সরিষার তেল', desc: 'কোনো কেমিক্যাল নেই', color: 'text-red-700 bg-red-100/60' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm"
              >
                <div className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0 font-bold`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-slate-800 leading-tight">{item.title}</div>
                  <div className="text-[10px] text-slate-500 font-semibold">{item.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
