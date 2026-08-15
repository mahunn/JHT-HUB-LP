'use client';

import { ShieldCheck, Clock, Sparkles, Gift, Heart, Droplets, Award, CheckCircle2 } from 'lucide-react';
import { ProductFeature } from '@/types/landing';

interface FeaturesGridProps {
  features: ProductFeature[];
}

const iconMap: Record<string, any> = {
  ShieldCheck,
  Clock,
  Sparkles,
  Gift,
  Heart,
  Droplets,
  Award,
  CheckCircle2,
};

export default function FeaturesGrid({ features }: FeaturesGridProps) {
  return (
    <section className="py-12 px-4 bg-emerald-900 text-white relative overflow-hidden">
      {/* Background Islamic Pattern Accent */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <span className="text-amber-400 font-bold text-sm tracking-wider uppercase">কেন আমাদের আতর সেরা?</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold mt-1 text-white">
            প্রিমিয়াম কোয়ালিটির অনন্য বৈশিষ্ট্য
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {features.map((feature, idx) => {
            const IconComponent = iconMap[feature.iconName] || Sparkles;
            return (
              <div
                key={feature.id || idx}
                className="bg-emerald-950/60 border border-emerald-700/50 rounded-2xl p-5 sm:p-6 backdrop-blur-sm hover:border-amber-400/60 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-emerald-950 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-emerald-100/80 leading-relaxed font-normal">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
