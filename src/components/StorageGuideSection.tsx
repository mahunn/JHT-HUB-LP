'use client';

interface StorageItem {
  icon: string;
  title: string;
  description: string;
  isSpecial?: boolean;
}

const storageItems: StorageItem[] = [
  {
    icon: '🥄',
    title: 'সবসময় শুকনো চামচ ব্যবহার করুন',
    description: 'প্রতিবার আচার তোলার সময় অবশ্যই একদম শুকনো ও পরিষ্কার চামচ ব্যবহার করুন।',
  },
  {
    icon: '🫙',
    title: 'আচার তেলের নিচে ডুবিয়ে রাখুন',
    description: 'আচারের উপরিভাগ সবসময় খাঁটি সরিষার তেলের নিচে ডুবিয়ে রাখতে হবে।',
  },
  {
    icon: '🌡️',
    title: 'শুষ্ক ও স্বাভাবিক স্থানে রাখুন',
    description: 'আচার সবসময় শুষ্ক, আলো-বাতাসযুক্ত স্বাভাবিক তাপমাত্রায় সংরক্ষণ করুন।',
  },
  {
    icon: '❄️',
    title: 'আচার ফ্রিজে রাখতে পারেন',
    description: 'ফ্রিজে রাখলে আচার দীর্ঘদিন সতেজ থাকবে এবং আসল স্বাদ অক্ষুণ্ণ থাকবে।',
  },
  {
    icon: '🚫',
    title: 'বালাচাও ফ্রিজে রাখবেন না',
    description: 'চিংড়ি বালাচাও কখনোই ফ্রিজে রাখবেন না। এয়ারটাইট জারে স্বাভাবিক তাপমাত্রায় মুচমুচে থাকবে।',
    isSpecial: true,
  },
];

export default function StorageGuideSection() {
  return (
    <section className="w-full max-w-3xl mx-auto py-10 sm:py-14 px-3 sm:px-4 box-border font-['Anek_Bangla','Hind_Siliguri',sans-serif] text-[#14532d]">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <span className="inline-block px-4 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-[#15803d] text-xs font-bold mb-2">
          গুরুত্বপূর্ণ নির্দেশনা
        </span>
        <h2 className="m-0 text-[#14532d] text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight">
          সংরক্ষণ ও সতর্কতা
        </h2>
      </div>

      {/* Storage Items List */}
      <div className="w-full divide-y divide-[#e5e7eb] border-y border-[#e5e7eb]">
        {storageItems.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-3.5 sm:gap-4 py-4 sm:py-4.5 px-2 transition-colors ${
              item.isSpecial ? 'bg-amber-50/50' : 'hover:bg-emerald-50/30'
            }`}
          >
            {/* Icon */}
            <div
              className={`flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xl sm:text-2xl shadow-sm border ${
                item.isSpecial
                  ? 'bg-amber-100/80 border-amber-300/80 text-amber-800'
                  : 'bg-emerald-50 border-emerald-200 text-[#15803d]'
              }`}
            >
              {item.icon}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <h3
                className={`m-0 mb-0.5 text-base sm:text-lg font-extrabold leading-tight ${
                  item.isSpecial ? 'text-[#b45309]' : 'text-[#14532d]'
                }`}
              >
                {item.title}
              </h3>
              <p className="m-0 text-[#4b5563] text-xs sm:text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
