'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Clock, Flame } from 'lucide-react';

interface AnnouncementBarProps {
  text?: string;
  active?: boolean;
  countdownHours?: number;
}

export default function AnnouncementBar({
  text = '🎉 ধামাকা অফার: আজই অর্ডার করলে সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সম্পূর্ণ ফ্রি!',
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
          return { ...prev, minutes: 59, seconds: 59 };
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
    <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-800 text-white text-sm py-2 px-3 shadow-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2 justify-center font-medium">
          <Flame className="w-4 h-4 text-amber-300 animate-pulse hidden sm:inline-block" />
          <span>{text}</span>
        </div>
        
        <div className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/40 text-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-white/90">অফার শেষ হতে বাকি:</span>
          <div className="font-mono text-white flex gap-1">
            <span className="bg-emerald-800/90 px-1.5 py-0.5 rounded">{pad(timeLeft.hours)}</span>:
            <span className="bg-emerald-800/90 px-1.5 py-0.5 rounded">{pad(timeLeft.minutes)}</span>:
            <span className="bg-emerald-800/90 px-1.5 py-0.5 rounded text-amber-300">{pad(timeLeft.seconds)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
