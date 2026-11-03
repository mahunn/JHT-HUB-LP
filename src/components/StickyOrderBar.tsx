'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { ProductData } from '@/types/landing';

interface StickyOrderBarProps {
  product: ProductData;
}

export default function StickyOrderBar({ product }: StickyOrderBarProps) {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const defaultPackage = product?.packages?.find((p) => p.isDefault) || product?.packages?.[0];
  const offerPrice = defaultPackage ? defaultPackage.offerPrice : 799;
  const regularPrice = defaultPackage ? (defaultPackage.regularPrice || 1200) : 1200;
  const savings = regularPrice > offerPrice ? regularPrice - offerPrice : 0;

  useEffect(() => {
    const handleScroll = () => {
      const orderSection = document.getElementById('order') || document.getElementById('form');
      if (orderSection) {
        const rect = orderSection.getBoundingClientRect();
        // When the checkout section comes into view (top <= 75% of window height)
        // and while the user is still within the order form, hide the sticky bar
        if (rect.top <= window.innerHeight * 0.75 && rect.bottom >= 120) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('order') || document.getElementById('form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside
      aria-label="অর্ডার বার"
      className={`fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-8px_30px_-5px_rgba(0,0,0,0.15)] transition-all duration-300 font-['Anek_Bangla',sans-serif] ${
        isVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="max-w-2xl mx-auto px-3 py-2 sm:px-4 sm:py-2.5 flex items-center justify-between gap-3">
        {/* Left Side: Pricing Showcase matching reference */}
        <div className="flex flex-col justify-center leading-tight select-none">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 font-bold">
            <span>রেগুলার:</span>
            <span className="line-through text-slate-400">{regularPrice}৳</span>
            {savings > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black">
                সাশ্রয় {savings}৳
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xs sm:text-sm font-extrabold text-slate-800">অফার:</span>
            <span className="text-xl sm:text-2xl font-black text-rose-600 tracking-tight">
              {offerPrice}৳
            </span>
          </div>
        </div>

        {/* Right Side: Big Prominent Order Button */}
        <a
          href="#order"
          onClick={scrollToOrder}
          className="flex-1 max-w-[210px] sm:max-w-[250px] h-11 sm:h-12 bg-gradient-to-r from-rose-600 via-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 active:scale-95 text-white font-black text-sm sm:text-base rounded-xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer no-underline"
        >
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.5]" />
          <span>এখনই অর্ডার করুন</span>
        </a>
      </div>
    </aside>
  );
}

