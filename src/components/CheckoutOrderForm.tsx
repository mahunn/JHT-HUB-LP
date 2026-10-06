'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, User, Phone, MapPin, Loader2, ShieldCheck, Truck } from 'lucide-react';
import { ProductData } from '@/types/landing';

interface CheckoutOrderFormProps {
  product: ProductData;
}

export default function CheckoutOrderForm({ product }: CheckoutOrderFormProps) {
  const router = useRouter();

  const singlePkg = product.packages?.[0] || {
    id: 'combo-special',
    name: 'Ilish Achar Combo Pack (3 Items)',
    banglaName: 'স্পেশাল ৩-ইন-১ আচার কম্বো (৪০০ গ্রাম)',
    subtitle: 'ইলিশ আচার (২০০ গ্রাম) + গরুর আচার (১০০ গ্রাম ফ্রি) + চিংড়ি বালাচাও (১০০ গ্রাম ফ্রি)',
    quantity: 1,
    regularPrice: 1450,
    offerPrice: 799,
    badge: 'সেরা অফার 🔥',
    isDefault: true,
    image: '/images/combo_banner.jpg',
  };

  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const subtotal = singlePkg.offerPrice * quantity;
  const grandTotal = subtotal; // Delivery charge is always 0 (Free)

  // Real-time silent lead capture for incomplete checkouts
  const captureLead = async (phoneVal?: string, nameVal?: string, addrVal?: string, qtyVal?: number) => {
    let currentPhone = (phoneVal !== undefined ? phoneVal : phone).replace(/[^0-9]/g, '');
    if (currentPhone.startsWith('8801')) {
      currentPhone = currentPhone.substring(2);
    }
    if (!currentPhone || currentPhone.length < 10) return;

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: currentPhone,
          customerName: (nameVal !== undefined ? nameVal : customerName).trim() || undefined,
          address: (addrVal !== undefined ? addrVal : address).trim() || undefined,
          cityZone: 'dhaka',
          selectedPackage: {
            id: singlePkg.id,
            name: singlePkg.name,
            banglaName: singlePkg.banglaName,
            price: singlePkg.offerPrice,
          },
          quantity: qtyVal || quantity,
          source: 'checkout_form',
        }),
      });
    } catch {
      // Silent catch
    }
  };

  useEffect(() => {
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('8801')) {
      clean = clean.substring(2);
    }
    if (clean.length >= 11) {
      const timer = setTimeout(() => {
        captureLead(phone, customerName, address);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [phone, customerName, address]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('আপনার নাম লিখুন');
      return;
    }

    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('8801')) {
      cleanPhone = cleanPhone.substring(2);
    }

    if (!cleanPhone || cleanPhone.length < 11 || !cleanPhone.startsWith('01')) {
      setErrorMessage('সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন (যেমন: 017XXXXXXXX)');
      return;
    }

    if (!address.trim() || address.trim().length < 5) {
      setErrorMessage('আপনার সম্পূর্ণ ঠিকানা (জেলা, থানা ও এলাকা) লিখুন');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: customerName.trim(),
        phone: cleanPhone,
        address: address.trim(),
        cityZone: 'dhaka',
        selectedPackage: {
          id: singlePkg.id,
          name: singlePkg.name,
          banglaName: singlePkg.banglaName,
          price: singlePkg.offerPrice,
        },
        quantity,
        subtotal,
        deliveryCharge: 0,
        total: grandTotal,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'অর্ডার সম্পন্ন হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }

      router.push(`/order-success/${data.order.id}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।');
      setIsSubmitting(false);
    }
  };

  return (
    <section id="ordernowyet" className="py-10 px-3 sm:px-4 bg-slate-50 scroll-mt-6">
      <div className="max-w-xl mx-auto">
        {/* Simple Section Header */}
        <div className="text-center mb-5">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            অর্ডার করতে নিচের তথ্য দিন
          </h2>
          <p className="text-xs sm:text-sm font-bold text-emerald-700 mt-1">
            ক্যাশ অন ডেলিভারি • সারা বাংলাদেশে ডেলিভারি চার্জ ফ্রি!
          </p>
        </div>

        {/* Clean, Simple Order Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-5 sm:p-7 shadow-xl border border-slate-200"
        >
          {/* Single Package Card */}
          <div className="flex items-center gap-3 p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 mb-5">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white border border-emerald-300 flex-shrink-0">
              <Image
                src={singlePkg.image || '/images/combo_banner.jpg'}
                alt={singlePkg.banglaName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight">
                {singlePkg.banglaName}
              </h3>
              <p className="text-[11px] text-slate-600 font-semibold mt-0.5 truncate">
                ইলিশ (২০০ গ্রাম) + গরুর আচার ও বালাচাও ফ্রি (২০০ গ্রাম)
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-lg sm:text-xl font-black text-emerald-700">
                ৳{singlePkg.offerPrice}
              </div>
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                ডেলিভারি ফ্রি
              </span>
            </div>
          </div>

          {/* Quantity Selector (Simple Row) */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200 mb-5">
            <span className="text-xs sm:text-sm font-bold text-slate-700">
              সেট সংখ্যা (পরিমাণ):
            </span>
            <div className="flex items-center bg-white border border-slate-300 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-8 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-sm flex items-center justify-center border-r border-slate-200"
              >
                −
              </button>
              <span className="w-9 text-center font-black text-slate-900 text-sm">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="w-9 h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Simple Inputs (No extra clutter) */}
          <div className="space-y-3.5 mb-5">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                আপনার নাম <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="আপনার নাম লিখুন"
                  className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                মোবাইল নাম্বার <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="জেলা, থানা ও এলাকার নাম লিখুন"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-600 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Minimal Bill Summary */}
          <div className="flex items-center justify-between p-3.5 bg-amber-50 rounded-2xl border border-amber-200 mb-5 text-sm font-bold">
            <span className="text-slate-800">সর্বমোট প্রদেয় বিল:</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-800">
              ৳{grandTotal} <span className="text-xs text-slate-600 font-semibold">(ডেলিভারি চার্জ ০ টাকা)</span>
            </span>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Big Green Order Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-black text-lg py-4 rounded-2xl shadow-xl shadow-emerald-700/25 transition-all flex items-center justify-center gap-2.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>প্রসেস হচ্ছে...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                <span>অর্ডার নিশ্চিত করুন — ৳{grandTotal}</span>
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-slate-500 mt-2.5 font-bold flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            পণ্য হাতে পেয়ে টাকা দিবেন • কোনো অগ্রিম টাকা লাগবে না
          </p>
        </form>
      </div>
    </section>
  );
}
