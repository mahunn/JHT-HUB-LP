import Link from 'next/link';
import Image from 'next/image';
import { Lock, Phone, Facebook } from 'lucide-react';
import { StoreSettings } from '@/types/landing';

interface FooterProps {
  settings?: StoreSettings;
}

export default function Footer({ settings }: FooterProps) {
  const storeName = settings?.storeName || 'JHT Food';
  const hotline = settings?.hotlinePhone || '01522-133748';
  const facebookUrl = settings?.facebookPageUrl?.trim() || '';

  return (
    <footer className="bg-[#0b0e17] text-slate-400 py-8 px-4 pb-20 sm:pb-8 relative overflow-hidden">
      <div className="max-w-md mx-auto flex flex-col items-center justify-center text-center space-y-4">
        {/* Store Info & Hotline */}
        <div className="space-y-1.5">
          <p className="text-sm font-extrabold text-white">
            {storeName}
          </p>
          {hotline && (
            <a
              href={`tel:${hotline.replace(/[^0-9+]/g, '')}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 no-underline transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>হটলাইনঃ {hotline}</span>
            </a>
          )}
          {facebookUrl && (
            <div className="pt-1">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 no-underline transition-colors"
              >
                <Facebook className="w-3.5 h-3.5" />
                <span>আমাদের ফেসবুক পেজ</span>
              </a>
            </div>
          )}
        </div>

        {/* Developed by Websy.bd */}
        <a
          href="https://websy.bd"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center justify-center no-underline transition-transform hover:scale-105 pt-2"
        >
          <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.22em] text-[#64748b] uppercase mb-1.5 font-sans">
            DEVELOPED BY
          </span>
          <div className="relative w-32 h-9 sm:w-36 sm:h-10 my-0.5">
            <Image
              src="/images/websy_logo_white.png"
              alt="Websy"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <span className="text-xs font-semibold text-[#818cf8] group-hover:text-white transition-colors mt-0.5 font-sans">
            websy.bd
          </span>
        </a>

        {/* Copyright */}
        <p className="text-[11px] text-slate-500 font-medium">
          © {new Date().getFullYear()} {storeName}। সর্বস্বত্ব সংরক্ষিত।
        </p>

        {/* Discreet Admin Access */}
        <div className="pt-1 opacity-30 hover:opacity-100 transition-opacity">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-[10px] text-slate-600 hover:text-slate-400 no-underline"
          >
            <Lock className="w-2.5 h-2.5" />
            <span>Admin Panel</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
