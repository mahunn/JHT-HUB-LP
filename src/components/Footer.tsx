import { StoreSettings, ProductData } from '@/types/landing';
import Link from 'next/link';
import Image from 'next/image';
import { Lock, Phone, MessageCircle, Heart } from 'lucide-react';

interface FooterProps {
  settings: StoreSettings;
  product: ProductData;
}

export default function Footer({ settings, product }: FooterProps) {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-slate-400 py-10 px-4 text-sm pb-24 sm:pb-10 relative overflow-hidden">
      {/* Subtle decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center space-y-4 relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="relative w-32 h-14 rounded-xl overflow-hidden">
            <Image
              src="/logo.png"
              alt={settings.storeName || product.brandName}
              fill
              className="object-contain"
            />
          </div>
        </div>

        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          হালাল ও খাঁটি সুবাসের বিশ্বস্ত ঠিকানা। সারা বাংলাদেশে ক্যাশ অন ডেলিভারিতে হোম ডেলিভারি সেবা।
        </p>

        {/* Contact */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          {settings.hotlinePhone && (
            <a href={`tel:${settings.hotlinePhone}`} className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition-colors">
              <Phone className="w-3 h-3 text-emerald-500" />
              {settings.hotlinePhone}
            </a>
          )}
          {settings.whatsappNumber && (
            <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-slate-400 hover:text-green-400 transition-colors">
              <MessageCircle className="w-3 h-3 text-green-500" />
              WhatsApp
            </a>
          )}
        </div>

        {/* Divider */}
        <div className="section-divider !bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

        <div className="flex items-center justify-between text-[11px] text-slate-600">
          <span className="flex items-center gap-1">
            &copy; {new Date().getFullYear()} {settings.storeName}
            <Heart className="w-2.5 h-2.5 text-rose-500/50 fill-rose-500/50" />
          </span>
          <Link href="/admin" className="flex items-center gap-1 hover:text-slate-400 transition-colors">
            <Lock className="w-2.5 h-2.5" />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
