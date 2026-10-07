'use client';

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  {
    icon: '🐟',
    title: 'আসল ইলিশের স্বাদ',
    description: 'বাছাই করা তাজা ইলিশ দিয়ে তৈরি, তাই প্রতিটি কামড়ে পাবেন আসল ইলিশের খাঁটি স্বাদ ও সুবাস।',
  },
  {
    icon: '🏠',
    title: 'ঘরোয়া স্বাদে তৈরি',
    description: 'যত্ন ও পরিচ্ছন্নতার সাথে ঘরোয়া রেসিপিতে কোনো কৃত্রিম কেমিক্যাল বা প্রিজারভেটিভ ছাড়া প্রস্তুত।',
  },
  {
    icon: '🌶️',
    title: 'টক-ঝাল-মশলাদার',
    description: 'কাঠের ঘানিভাঙা খাঁটি সরিষার তেল ও মশলার পারফেক্ট সমন্বয়ে তৈরি দারুণ মুখরোচক স্বাদ।',
  },
  {
    icon: '🍚',
    title: 'সব খাবারের সাথে মানানসই',
    description: 'গরম ভাত, খিচুড়ি, মুড়ি কিংবা পরোটা—যেকোনো খাবারের সাথেই অসাধারণ উপাদেয়।',
  },
];

export default function FeaturesGrid() {
  return (
    <section className="w-full max-w-5xl mx-auto py-10 sm:py-14 px-3 sm:px-4 box-border font-['Anek_Bangla','Hind_Siliguri',sans-serif] text-[#14532d]">
      {/* Header */}
      <div className="text-center mb-7 sm:mb-9">
        <h2 className="m-0 text-[#14532d] text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight">
          কেন সেরা আমাদের ইলিশ আচার?
        </h2>
        <p className="mt-2 text-[#4b5563] text-xs sm:text-sm font-semibold">
          একবার খেলেই বুঝবেন—স্বাদটা কেন এত আলাদা ও অতুলনীয়!
        </p>
      </div>

      {/* 4 Features Grid (2x2) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">
        {features.map((item, idx) => (
          <div
            key={idx}
            className="group flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 sm:gap-4 p-4 sm:p-5 bg-white border border-[#e5e7eb] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            {/* Emoji Icon Container */}
            <div className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-xl sm:text-2xl shadow-sm group-hover:scale-110 transition-transform">
              {item.icon}
            </div>

            {/* Content */}
            <div className="min-w-0">
              <h3 className="m-0 mb-1 text-[#14532d] text-base sm:text-lg font-extrabold leading-snug">
                {item.title}
              </h3>
              <p className="m-0 text-[#6b7280] text-xs sm:text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Big High-Converting Order Now CTA Button (Red Marked Area) */}
      <div className="mt-8 sm:mt-10 text-center max-w-lg mx-auto">
        <a
          href="#order"
          onClick={(e) => {
            e.preventDefault();
            const orderEl = document.getElementById('order');
            if (orderEl) {
              orderEl.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="group relative flex items-center justify-center gap-3.5 w-full min-h-[58px] sm:min-h-[62px] px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#15803d] via-[#166534] to-[#14532d] text-white text-lg sm:text-xl font-black tracking-wide shadow-xl shadow-emerald-900/35 hover:shadow-2xl hover:shadow-emerald-900/50 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 overflow-hidden no-underline"
        >
          {/* Animated Shine Sweep Effect */}
          <span
            className="absolute top-0 -left-[100%] w-[70%] h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-[20deg] animate-[orderShine_3.5s_infinite]"
            aria-hidden="true"
          />
          <span className="relative z-10 flex items-center gap-2">
            <span>এখনই অর্ডার করুন</span>
            <span className="text-amber-300 text-sm sm:text-base font-black bg-black/25 border border-amber-300/40 px-2.5 py-0.5 rounded-lg">
              ৳৭৯৯
            </span>
          </span>
          <b className="relative z-10 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold group-hover:translate-x-1.5 transition-transform">
            →
          </b>
        </a>
        <p className="mt-2.5 text-xs sm:text-sm text-[#166534] font-extrabold flex items-center justify-center flex-wrap gap-2">
          <span>🎁 ১০০ গ্রাম গরুর আচার ও ১০০ গ্রাম বালাচাও ফ্রি</span>
          <span className="text-slate-300">•</span>
          <span>🚚 ফ্রি হোম ডেলিভারি</span>
        </p>
      </div>
    </section>
  );
}
