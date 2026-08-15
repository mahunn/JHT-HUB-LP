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
      setShowBottomBar(window.scrollY > 400);
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
      {/* Desktop: minimal contact sidebar */}
      <div className="hidden sm:flex fixed bottom-6 right-4 z-40 flex-col gap-2">
        {settings.whatsappNumber && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp"
            className="w-11 h-11 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-md flex items-center justify-center transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
        )}

        {settings.hotlinePhone && (
          <a
            href={telUrl}
            title="Call"
            className="w-11 h-11 rounded-full bg-slate-700 hover:bg-slate-800 text-white shadow-md flex items-center justify-center transition-colors"
          >
            <Phone className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Mobile: clean sticky bottom bar */}
      <div
        className={`sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 p-2.5 shadow-lg transition-transform duration-300 ${
          showBottomBar ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex items-center gap-2">
          {settings.hotlinePhone && (
            <a
              href={telUrl}
              className="px-3 py-2.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1.5 flex-shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>কল</span>
            </a>
          )}

          <button
            onClick={scrollToOrder}
            className="flex-1 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>অর্ডার করুন</span>
          </button>
        </div>
      </div>
    </>
  );
}
