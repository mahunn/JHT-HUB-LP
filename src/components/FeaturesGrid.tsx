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
    </section>
  );
}
