import { StoreSettings, ProductData } from '@/types/landing';
import Link from 'next/link';
import { Lock, Phone, MessageCircle } from 'lucide-react';

interface FooterProps {
  settings: StoreSettings;
  product: ProductData;
}

export default function Footer({ settings, product }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 px-4 border-t border-slate-800 text-sm">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <h3 className="text-xl font-bold text-white tracking-wide">
          {settings.storeName || product.brandName}
        </h3>

        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          হালাল ও খাঁটি সুবাসের বিশ্বস্ত ঠিকানা। সারা বাংলাদেশে বিশ্বস্ততার সাথে ক্যাশ অন ডেলিভারিতে হোম ডেলিভারি সেবা প্রদান করা হয়।
        </p>

        {/* Contact Info */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs pt-2">
          {settings.hotlinePhone && (
            <span className="flex items-center gap-1 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              হটলাইন: {settings.hotlinePhone}
            </span>
          )}
          {settings.whatsappNumber && (
            <span className="flex items-center gap-1 text-slate-300">
              <MessageCircle className="w-3.5 h-3.5 text-green-400" />
              হোয়াটসঅ্যাপ: {settings.whatsappNumber}
            </span>
          )}
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} {settings.storeName}. All Rights Reserved.
          </div>

          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
              <Lock className="w-3 h-3" />
              <span>Admin Panel</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
