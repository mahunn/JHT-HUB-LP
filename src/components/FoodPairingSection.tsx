'use client';

import Image from 'next/image';

interface PairingItem {
  id: string;
  num: string;
  title: string;
  description: string;
  image: string;
}

const pairingItems: PairingItem[] = [
  {
    id: 'rice',
    num: '০১',
    title: 'গরম ভাতের সাথে',
    description: 'গরম ভাতের সাথে ইলিশের আচার কিংবা বালাচাও—জমে যাবে একদম!',
    image: '/images/pair_rice.jpg',
  },
  {
    id: 'khichuri',
    num: '০২',
    title: 'খিচুড়ির সাথে',
    description: 'গরম খিচুড়ির সাথে ইলিশের আচার বা মাংসের আচার—স্বাদ হবে জমজমাট।',
    image: '/images/pair_khichuri.jpg',
  },
  {
    id: 'muri',
    num: '০৩',
    title: 'মুড়ির সাথে',
    description: 'মুচমুচে মুড়ির সাথে ইলিশের আচার বা বালাচাও—সহজ অথচ অসাধারণ!',
    image: '/images/pair_muri.jpg',
  },
  {
    id: 'pitha',
    num: '০৪',
    title: 'পিঠার সাথে',
    description: 'চিতই পিঠা কিংবা পছন্দের পরোটার সাথে আচারের স্বাদ উপভোগ করুন।',
    image: '/images/pair_pitha.jpg',
  },
];

export default function FoodPairingSection() {
  return (
    <section className="w-full max-w-5xl mx-auto py-10 sm:py-14 px-3 sm:px-4 box-border font-['Anek_Bangla','Hind_Siliguri',sans-serif] text-[#14532d]">
      {/* Header */}
      <div className="text-center mb-7 sm:mb-9">
        <h2 className="m-0 text-[#14532d] text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight">
          ইলিশের আচার ও বালাচাও<br />যেভাবে খেতে পারবেন
        </h2>
        <p className="mt-2 text-[#4b5563] text-xs sm:text-sm font-semibold">
          প্রতিদিনের খাবারে যোগ করুন বাড়তি খাঁটি ঘরোয়া স্বাদ
        </p>
      </div>

      {/* 4 Cards Grid (2x2) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">
        {pairingItems.map((item) => (
          <div
            key={item.id}
            className="group relative bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Image */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-slate-100">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />

              {/* Number Badge */}
              <span className="absolute top-2.5 left-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#15803d] text-white text-xs sm:text-sm font-black flex items-center justify-center shadow-md">
                {item.num}
              </span>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4 text-center">
              <h3 className="m-0 mb-1 text-[#14532d] text-base sm:text-lg md:text-xl font-extrabold leading-tight">
                {item.title}
              </h3>
              <p className="m-0 text-[#6b7280] text-[11px] sm:text-xs md:text-sm leading-relaxed line-clamp-2">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
