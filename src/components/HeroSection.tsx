'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, ShieldCheck, Truck, CheckCircle, RotateCcw } from 'lucide-react';
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
    <section className="pt-6 pb-10 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        {/* Brand Tag */}
        <div className="text-center mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-xs tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {product.brandName}
          </span>
        </div>

        {/* Headlines */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-2">
            {product.headlinePre}{' '}
            <span className="text-emerald-700">{product.headlineHighlight}</span>
          </h1>
          <p className="text-base sm:text-lg font-semibold text-slate-600 mb-3">
            {product.headlinePost}
          </p>
          <span className="inline-block bg-emerald-700 text-white font-semibold px-4 py-1.5 rounded-lg text-sm">
            {product.freeDeliveryHeadline}
          </span>
        </div>

        {/* Product Image Gallery */}
        <div className="mb-6">
          <div className="relative aspect-square w-full max-w-md mx-auto rounded-2xl overflow-hidden bg-slate-100">
            <Image
              src={selectedImage || product.mainBannerImage}
              alt={product.productName}
              fill
              className="object-cover"
              priority
            />
            {product.packages[0] && (
              <div className="absolute bottom-3 right-3 bg-emerald-700 text-white text-sm font-bold px-3 py-1.5 rounded-lg">
                মাত্র ৳{product.packages[0].offerPrice}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.galleryImages && product.galleryImages.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-3">
              {product.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === img
                      ? 'border-emerald-600 shadow-md'
                      : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Stock indicator */}
        <div className="max-w-md mx-auto mb-5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
            <span>স্টক সীমিত — দ্রুত অর্ডার করুন</span>
            <span className="text-red-600">আর {product.stockCount} টি বাকি</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-red-500 h-full rounded-full w-[22%]" />
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mb-6">
          <button
            onClick={scrollToOrder}
            className="inline-flex items-center justify-center gap-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-lg px-8 py-3.5 rounded-xl shadow-sm transition-colors w-full sm:w-auto"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>অর্ডার করতে চাই</span>
          </button>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">
            🔒 অগ্রিম কোনো টাকা লাগবে না • পণ্য হাতে পেয়ে মূল্য দিন
          </p>
        </div>

        {/* Trust Highlights */}
        <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
          {[
            { icon: ShieldCheck, text: '১০০% হালাল ও খাঁটি' },
            { icon: Truck, text: 'ফ্রী হোম ডেলিভারি' },
            { icon: CheckCircle, text: 'দেখে নেওয়ার সুযোগ' },
            { icon: RotateCcw, text: 'সহজ রিটার্ন সুবিধা' },
          ].map(({ icon: Icon, text }, idx) => (
            <div key={idx} className="flex items-center gap-2 py-2 px-3 rounded-lg bg-slate-50 text-xs sm:text-sm font-medium text-slate-700">
              <Icon className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
