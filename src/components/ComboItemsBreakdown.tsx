'use client';

import Image from 'next/image';
import { Gift, Sparkles, Check, ShoppingBag, Flame } from 'lucide-react';

interface ComboItem {
  id: string;
  name: string;
  weight: string;
  isFree?: boolean;
  image: string;
  tag: string;
  description: string;
  features: string[];
}

const comboItems: ComboItem[] = [
  {
    id: 'ilish',
    name: 'ইলিশ মাছের স্পেশাল আচার',
    weight: '২০০ গ্রাম',
    isFree: false,
    image: '/images/ilish_achar.jpg',
    tag: 'মূল আকর্ষণ 🐟',
    description: 'তাজা নদীর রূপালী ইলিশের খাঁটি টুকরো, কাঠের ঘানিভাঙা খাঁটি সরিষার তেল, আস্ত শুকনা মরিচ ও ঐতিহ্যবাহী স্পেশাল মশলায় জারণকৃত।',
    features: [
      'পদ্মা-মেঘনার তাজা ইলিশ মাছের বড় টুকরো',
      'ঘানিভাঙা খাঁটি সরিষার তেলের ঝাঁঝালো স্বাদ',
      'কোনো কেমিক্যাল বা কৃত্রিম রঙ নেই',
      'গরম ধোঁয়া ওঠা ভাতের সাথে অমৃত স্বাদ'
    ]
  },
  {
    id: 'gorur',
    name: 'গরুর মাংসের চুক্কা আচার',
    weight: '১০০ গ্রাম',
    isFree: true,
    image: '/images/gorur_achar.jpg',
    tag: 'সম্পূর্ণ ফ্রি উপহার 🎁',
    description: 'হাড় ছাড়া সলিড ফ্রেশ গরুর মাংসের আঁশে আঁশে সুস্বাদু আচারি মশলা। মাংসের টুকরোগুলো অত্যন্ত নরম ও তুলতুলে, চুক্কা স্বাদে ভরপুর।',
    features: [
      '১০০% হাড় ছাড়া সলিড গরুর মাংস',
      'মাংসের আঁশে আঁশে মশলার পারফেক্ট স্বাদ',
      'মুখে দিলেই গলে যাওয়ার মতো তুলতুলে নরম',
      'খিচুড়ি, পোলাও কিংবা রুটি-পরোটার সাথে দুর্দান্ত'
    ]
  },
  {
    id: 'chingri',
    name: 'মচমচে চিংড়ি শুঁটকি বালাচাও',
    weight: '১০০ গ্রাম',
    isFree: true,
    image: '/images/chingri_balachao.jpg',
    tag: 'সম্পূর্ণ ফ্রি উপহার 🎁',
    description: 'কক্সবাজারের খাঁটি ছোট চিংড়ি শুঁটকি, মুচমুচে ভাজা পেঁয়াজ বেরেস্তা, রসুন কুচি ও স্পেশাল শুকনা মরিচ ফ্লেক্স দিয়ে তৈরি ঐতিহ্যবাহী বালাচাও।',
    features: [
      'কক্সবাজারের প্রিমিয়াম ছোট চিংড়ি শুঁটকি',
      'একদম মচমচে ক্রাঞ্চি ও লোভনীয় টেস্ট',
      'এক চামচ গরম ভাতে নিলেই মন জুড়িয়ে যাবে',
      'দীর্ঘদিন এয়ারটাইট জারে মুচমুচে থাকে'
    ]
  }
];

export default function ComboItemsBreakdown() {
  const scrollToOrder = () => {
    const el = document.getElementById('ordernowyet');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 px-3 sm:px-4 bg-gradient-to-b from-white via-amber-50/30 to-white">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-extrabold mb-3">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>স্পেশাল ৩-ইন-১ কম্বো অফার</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            এই প্যাকে আপনি যা যা পাচ্ছেন
          </h2>

          <p className="text-sm sm:text-base font-bold text-slate-600 mt-2 max-w-xl mx-auto">
            ২০০ গ্রাম ইলিশের আচার অর্ডার করলে বাকি ২টি আইটেম (২০০ গ্রাম) সম্পূর্ণ ফ্রিতে পৌঁছে যাবে আপনার ঠিকানায়!
          </p>
        </div>

        {/* 3 Food Item Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {comboItems.map((item, idx) => (
            <div
              key={item.id}
              className={`rounded-3xl overflow-hidden bg-white border-2 transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col ${
                item.isFree
                  ? 'border-emerald-300 ring-2 ring-emerald-500/20'
                  : 'border-amber-300 ring-2 ring-amber-500/20'
              }`}
            >
              {/* Image with Tag */}
              <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  unoptimized
                />

                {/* Free Badge */}
                <div
                  className={`absolute top-3 left-3 text-xs font-black px-3 py-1.5 rounded-xl shadow-md ${
                    item.isFree
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-500 text-slate-950'
                  }`}
                >
                  {item.tag}
                </div>

                {/* Weight Tag */}
                <div className="absolute bottom-3 right-3 bg-slate-950/85 backdrop-blur-sm text-amber-300 text-xs sm:text-sm font-black px-3 py-1 rounded-lg border border-amber-400/30">
                  পরিমাণ: {item.weight}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                      আইটেম #{idx + 1}
                    </span>
                    {item.isFree && (
                      <span className="text-[11px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                        সম্পূর্ণ ফ্রি! 🎁
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-slate-900 mb-2">
                    {item.name}
                  </h3>

                  <p className="text-xs text-slate-600 mb-4 leading-relaxed font-medium">
                    {item.description}
                  </p>

                  {/* Bullet points */}
                  <ul className="space-y-2 mb-4 text-xs font-semibold text-slate-700">
                    {item.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Bottom status */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">পরিমাণ:</span>
                  <span className="text-sm font-black text-emerald-700">{item.weight}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Simple & Clean Order Action */}
        <div className="text-center mt-8">
          <button
            onClick={scrollToOrder}
            className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white font-black text-base sm:text-lg px-8 py-4 rounded-2xl shadow-xl shadow-emerald-800/25 transition-all duration-300 active:scale-95"
          >
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            <span>এই কম্বো অর্ডার করতে চাই (৳৭৯৯)</span>
          </button>
          <p className="text-xs text-slate-500 mt-2 font-bold">
            সারা বাংলাদেশে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি
          </p>
        </div>
      </div>
    </section>
  );
}
