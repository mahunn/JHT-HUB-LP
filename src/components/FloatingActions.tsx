'use client';

import { useState, useEffect } from 'react';
import { Phone, MessageCircle, ShoppingBag, ArrowUp } from 'lucide-react';
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
      {/* Desktop: sleek contact sidebar */}
      <div className="hidden sm:flex fixed bottom-6 right-4 z-40 flex-col gap-2.5">
        {settings.whatsappNumber && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp"
            className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
        )}

        {settings.hotlinePhone && (
          <a
            href={telUrl}
            title="Call"
            className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white shadow-lg shadow-slate-700/30 flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <Phone className="w-4.5 h-4.5" />
          </a>
        )}
      </div>

      {/* Mobile: premium sticky bottom bar */}
      <div
        className={`sm:hidden fixed bottom-0 left-0 right-0 z-50 glass-dark border-t border-white/10 p-3 shadow-2xl transition-all duration-500 ${
          showBottomBar ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {settings.hotlinePhone && (
            <a
              href={telUrl}
              className="px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white font-bold text-xs flex items-center gap-1.5 flex-shrink-0 border border-white/10 hover:bg-white/15 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>কল</span>
            </a>
          )}

          <button
            onClick={scrollToOrder}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm transition-all shadow-lg shadow-emerald-600/30"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>অর্ডার করুন</span>
          </button>
        </div>
      </div>
    </>
  );
}
