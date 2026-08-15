'use client';

import { Star, CheckCircle, Quote, ThumbsUp } from 'lucide-react';
import { CustomerReview } from '@/types/landing';

interface CustomerReviewsProps {
  reviews: CustomerReview[];
}

export default function CustomerReviews({ reviews }: CustomerReviewsProps) {
  return (
    <section className="py-12 px-4 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold mb-2">
            <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>সন্তুষ্ট গ্রাহকদের মতামত</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            আমাদের কাস্টমারদের ভালোবাসা
          </h2>
          <div className="flex items-center justify-center gap-1 mt-2 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-slate-700 font-bold ml-2 text-sm">৪.৯/৫ (১৫০০+ রিভিউ)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {reviews.map((review, idx) => (
            <div
              key={review.id || idx}
              className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm relative hover:shadow-md transition-shadow"
            >
              <Quote className="w-8 h-8 text-emerald-100 absolute top-4 right-4 pointer-events-none" />

              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4 font-normal">
                "{review.comment}"
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs sm:text-sm">
                <div>
                  <h4 className="font-bold text-slate-900">{review.customerName}</h4>
                  <span className="text-slate-500">{review.location}</span>
                </div>

                <div className="text-right">
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded-md">
                      <CheckCircle className="w-3.5 h-3.5" />
                      ভেরিফাইড ক্রেতা
                    </span>
                  )}
                  <div className="text-slate-400 text-[11px] mt-0.5">{review.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
