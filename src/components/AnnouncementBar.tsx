'use client';

import { useState, useEffect } from 'react';
import { Clock, Sparkles } from 'lucide-react';

interface AnnouncementBarProps {
  text?: string;
  active?: boolean;
  countdownHours?: number;
}

export default function AnnouncementBar({
  text = '🎉 ইলিশের আচারে গরু ও বালাচাও ফ্রি!',
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
    <div className="bg-gradient-to-r from-emerald-950 via-emerald-800 to-emerald-950 text-white py-1.5 px-2.5 sm:px-4 sticky top-0 z-40 shadow-sm relative overflow-hidden font-['Anek_Bangla',sans-serif] min-h-[36px] flex items-center">
      {/* Subtle Shimmer */}
      <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-30" />

      <div className="max-w-5xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3 relative z-10 w-full whitespace-nowrap">
        {/* Crisp Text - Never Cropped, Perfectly Sized */}
        <div className="font-black flex items-center gap-1.5 text-[11px] min-[360px]:text-[12px] sm:text-sm text-white drop-shadow-xs whitespace-nowrap">
          <Sparkles className="w-3 h-3 min-[360px]:w-3.5 min-[360px]:h-3.5 text-amber-300 flex-shrink-0 animate-pulse" />
          <span>{text}</span>
        </div>

        {/* Compact Timer Pill */}
        <div className="flex items-center gap-1 text-[10px] min-[360px]:text-[11px] sm:text-xs font-black bg-black/35 backdrop-blur-sm px-2 py-0.5 rounded-full flex-shrink-0 border border-white/20 shadow-xs whitespace-nowrap">
          <Clock className="w-2.5 h-2.5 min-[360px]:w-3 min-[360px]:h-3 text-amber-300" />
          <span className="font-mono text-white tracking-wider font-bold">
            {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
          </span>
        </div>
      </div>
    </div>
  );
}
