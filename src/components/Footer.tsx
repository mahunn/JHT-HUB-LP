import Link from 'next/link';
import Image from 'next/image';
import { Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0b0e17] text-slate-400 py-8 px-4 pb-20 sm:pb-8 relative overflow-hidden">
      <div className="max-w-md mx-auto flex flex-col items-center justify-center text-center">
        {/* Developed by Websy.bd */}
        <a
          href="https://websy.bd"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center justify-center no-underline transition-transform hover:scale-105"
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

        {/* Discreet Admin Access */}
        <div className="mt-4 opacity-30 hover:opacity-100 transition-opacity">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-[10px] text-slate-600 hover:text-slate-400 no-underline"
          >
            <Lock className="w-2.5 h-2.5" />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
