'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface AnnouncementBarProps {
  text?: string;
  active?: boolean;
  countdownHours?: number;
}

export default function AnnouncementBar({
  text = '🎉 আজই অর্ডার করলে সারা বাংলাদেশে ডেলিভারি সম্পূর্ণ ফ্রি!',
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
    <div className="bg-emerald-800 text-white text-xs sm:text-sm py-2.5 px-4 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        <span className="font-medium truncate">{text}</span>

        <div className="flex items-center gap-1.5 text-[11px] font-semibold bg-white/10 px-2.5 py-1 rounded-md flex-shrink-0">
          <Clock className="w-3 h-3 text-emerald-300" />
          <span className="font-mono text-white tracking-wide">
            {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
          </span>
        </div>
      </div>
    </div>
  );
}
