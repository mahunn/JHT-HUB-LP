'use client';

import { useState, useEffect } from 'react';
import { Clock, Sparkles } from 'lucide-react';

interface AnnouncementBarProps {
  text?: string;
  active?: boolean;
  countdownHours?: number;
}

export default function AnnouncementBar({
  text = '🎉 ধামাকা অফার: আজই অর্ডার করলে সারা বাংলাদেশে ডেলিভারি সম্পূর্ণ ফ্রি!',
  active = true,
  countdownHours = 12,
}: AnnouncementBarProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: countdownHours,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!active) return null;

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white text-xs sm:text-sm py-2.5 px-4 sticky top-0 z-40 shadow-md animate-gradient relative overflow-hidden">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 animate-shimmer pointer-events-none" />

      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 relative z-10">
        <span className="font-semibold truncate flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
          {text}
        </span>

        <div className="flex items-center gap-1.5 text-[11px] font-bold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full flex-shrink-0 border border-white/10">
          <Clock className="w-3 h-3 text-amber-300" />
          <span className="font-mono text-white tracking-wider">
            {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
          </span>
        </div>
      </div>
    </div>
  );
}
