'use client';

import { useState, useEffect } from 'react';
import { Phone, MessageCircle, ShoppingBag } from 'lucide-react';
import { StoreSettings } from '@/types/landing';

interface FloatingActionsProps {
  settings: StoreSettings;
}

export default function FloatingActions({ settings }: FloatingActionsProps) {
  const [showBottomBar, setShowBottomBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show bottom bar after scrolling past 300px
      if (window.scrollY > 300) {
        setShowBottomBar(true);
      } else {
        setShowBottomBar(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToOrder = () => {
    const el = document.getElementById('ordernowyet');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappUrl = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        'আসসালামু আলাইকুম, আমি আতর কম্বো অফারটি সম্পর্কে জানতে ও অর্ডার করতে চাই।'
      )}`
    : '#';

  const telUrl = settings.hotlinePhone ? `tel:${settings.hotlinePhone}` : '#';

  return (
    <>
      {/* Floating WhatsApp and Call Icons on Left / Right Desktop & Mobile */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 z-40 flex flex-col gap-2.5">
        {settings.whatsappNumber && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="হোয়াটসঅ্যাপে চ্যাট করুন"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-xl flex items-center justify-center transition-all hover:scale-110 border-2 border-white"
          >
            <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
          </a>
        )}

        {settings.hotlinePhone && (
          <a
            href={telUrl}
            title="হটলাইনে সরাসরি কল করুন"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white shadow-xl flex items-center justify-center transition-all hover:scale-110 border-2 border-white"
          >
            <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
        )}
      </div>

      {/* Sticky Bottom Order Bar on Mobile */}
      {showBottomBar && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 shadow-2xl flex items-center gap-2">
          {settings.hotlinePhone && (
            <a
              href={telUrl}
              className="px-3.5 py-3 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs flex items-center gap-1.5 flex-shrink-0"
            >
              <Phone className="w-4 h-4 text-emerald-700" />
              <span>কল করুন</span>
            </a>
          )}

          <button
            onClick={scrollToOrder}
            className="btn-pulse-order flex-1 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-extrabold py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 text-base"
          >
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            <span>অর্ডার করুন (ক্যাশ অন ডেলিভারি)</span>
          </button>
        </div>
      )}
    </>
  );
}
