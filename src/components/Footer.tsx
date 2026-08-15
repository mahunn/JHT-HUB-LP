import { StoreSettings, ProductData } from '@/types/landing';
import Link from 'next/link';
import { Lock, Phone, MessageCircle } from 'lucide-react';

interface FooterProps {
  settings: StoreSettings;
  product: ProductData;
}

export default function Footer({ settings, product }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-400 py-8 px-4 text-sm pb-20 sm:pb-8">
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <h3 className="text-base font-bold text-white">
          {settings.storeName || product.brandName}
        </h3>

        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          হালাল ও খাঁটি সুবাসের বিশ্বস্ত ঠিকানা। সারা বাংলাদেশে ক্যাশ অন ডেলিভারিতে হোম ডেলিভারি সেবা।
        </p>

        {/* Contact */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
          {settings.hotlinePhone && (
            <span className="flex items-center gap-1 text-slate-400">
              <Phone className="w-3 h-3 text-emerald-500" />
              {settings.hotlinePhone}
            </span>
          )}
          {settings.whatsappNumber && (
            <span className="flex items-center gap-1 text-slate-400">
              <MessageCircle className="w-3 h-3 text-green-500" />
              {settings.whatsappNumber}
            </span>
          )}
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-600">
          <span>&copy; {new Date().getFullYear()} {settings.storeName}</span>
          <Link href="/admin" className="flex items-center gap-1 hover:text-slate-400 transition-colors">
            <Lock className="w-2.5 h-2.5" />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
