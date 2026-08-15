'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { CheckCircle2, MessageCircle, Phone, Home, ShoppingBag, Truck, Clock } from 'lucide-react';
import { useState } from 'react';
import { Order, StoreSettings } from '@/types/landing';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Launch Confetti Celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#15803d', '#f59e0b', '#3b82f6'],
      });
    } catch (e) {
      console.error(e);
    }

    // Fetch order details
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.order);
          setSettings(data.settings);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const whatsappUrl =
    settings?.whatsappNumber && order
      ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
          `আসসালামু আলাইকুম, আমি অর্ডার করেছি!\nঅর্ডার আইডি: ${order.id}\nপ্যাকেজ: ${order.selectedPackage.banglaName} (${order.quantity}টি)\nমোট মূল্য: ৳${order.total}\nনাম: ${order.customerName}\nফোন: ${order.phone}\nঠিকানা: ${order.address}`
        )}`
      : '#';

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/80 via-white to-slate-50 py-10 px-4 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/30 text-center">
        {/* Animated Check Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </div>

        <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs mb-2">
          অর্ডার সফল হয়েছে 🎉
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          ধন্যবাদ! আপনার অর্ডারটি গ্রহণ করা হয়েছে
        </h1>

        <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
          খুব শীঘ্রই আমাদের প্রতিনিধি আপনার নাম্বারে কল করে অর্ডারটি নিশ্চিত করবেন এবং কুরিয়ারে পাঠিয়ে দেওয়া হবে।
        </p>

        {/* Invoice Summary Box */}
        {order ? (
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 text-left mb-6 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">অর্ডার নাম্বার:</span>
              <span className="font-mono font-extrabold text-emerald-700 text-base">{order.id}</span>
            </div>

            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">প্যাকেজ:</span>
                <span className="font-bold text-slate-900">
                  {order.selectedPackage.banglaName} × {order.quantity}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">গ্রাহকের নাম:</span>
                <span className="font-bold text-slate-900">{order.customerName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">মোবাইল নাম্বার:</span>
                <span className="font-mono font-bold text-slate-900">{order.phone}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">ডেলিভারি ঠিকানা:</span>
                <span className="font-medium text-slate-800 text-right max-w-[240px]">{order.address}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">ডেলিভারি চার্জ:</span>
                <span className="font-bold text-emerald-700">
                  {order.deliveryCharge === 0 ? 'ফ্রি' : `৳${order.deliveryCharge}`}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-300 flex justify-between items-center font-extrabold text-base sm:text-lg">
                <span className="text-slate-900">সর্বমোট মূল্য (হাতে পেয়ে দিবেন):</span>
                <span className="text-emerald-700 font-mono text-xl">৳{order.total}</span>
              </div>
            </div>

            {/* Delivery Timeline Notice */}
            <div className="pt-3 border-t border-slate-200 flex items-center gap-2 text-xs font-medium text-slate-600">
              <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>আনুমানিক ডেলিভারি সময়: ঢাকা সিটিতে ২৪-৪৮ ঘণ্টা, ঢাকার বাইরে ২-৩ দিন</span>
            </div>
          </div>
        ) : (
          <div className="py-8 text-slate-400 font-medium">লোড হচ্ছে...</div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {settings?.whatsappNumber && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-base"
            >
              <MessageCircle className="w-5 h-5" />
              <span>হোয়াটসঅ্যাপে তাৎক্ষণিক কনফার্ম করুন</span>
            </a>
          )}

          <div className="flex items-center gap-3">
            {settings?.hotlinePhone && (
              <a
                href={`tel:${settings.hotlinePhone}`}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm border border-slate-200"
              >
                <Phone className="w-4 h-4 text-emerald-700" />
                <span>হটলাইনে কল দিন</span>
              </a>
            )}

            <Link
              href="/"
              className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Home className="w-4 h-4" />
              <span>মূল পেইজে ফিরে যান</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
