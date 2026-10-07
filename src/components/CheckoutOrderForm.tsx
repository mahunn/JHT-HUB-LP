'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { ProductData } from '@/types/landing';
import { trackInitiateCheckout, trackPurchase } from '@/lib/pixel';

interface CheckoutOrderFormProps {
  product: ProductData;
}

export default function CheckoutOrderForm({ product }: CheckoutOrderFormProps) {
  const router = useRouter();

  const singlePkg = product.packages?.[0] || {
    id: 'combo-special',
    name: 'Ilish Achar Combo Pack (3 Items)',
    banglaName: 'স্পেশাল ৩-ইন-১ আচার কম্বো',
    subtitle: 'ইলিশ আচার (২০০ গ্রাম) + গরুর আচার ও বালাচাও ফ্রি (২০০ গ্রাম)',
    quantity: 1,
    regularPrice: 1450,
    offerPrice: 799,
    badge: 'ধামাকা অফার 🔥',
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
        captureLead(phone, customerName, address, quantity);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [phone, customerName, address, quantity]);

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

      // Trigger tracking pixels safely & deduplicated
      trackPurchase({
        orderId: data.order.id,
        name: singlePkg.banglaName,
        price: grandTotal,
        currency: 'BDT',
        quantity,
      });

      router.push(`/order-success/${data.order.id}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।');
      setIsSubmitting(false);
    }
  };

  return (
    <section id="order" className="py-10 sm:py-16 px-3 sm:px-4 bg-[#f8fdf9] scroll-mt-6 font-['Anek_Bangla','Hind_Siliguri',sans-serif]">
      <div className="max-w-2xl mx-auto">
        {/* Warning / Order Notice Header (like bilashfood) */}
        <div id="form" className="text-center mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-[#064e3b] via-[#15803d] to-[#064e3b] text-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg border border-emerald-700/50">
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-snug mb-2">
              অর্ডার কনফার্ম করতে<br />তথ্যগুলো সঠিকভাবে দিনঃ
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 font-semibold mb-1">
              &ldquo;নিশ্চিতভাবে পার্সেল নেওয়ার ইচ্ছা থাকলে তবেই অর্ডারটি করুন, অপ্রয়োজনীয় অর্ডার আমাদের ক্ষতির কারণ হয়।&rdquo;
            </p>
            <p className="text-xs sm:text-sm text-amber-300 font-bold">
              ( ২ থেকে ৪ দিনে সারা বাংলাদেশে হোম ডেলিভারি পাবেন ইনশাআল্লাহ )
            </p>
          </div>
        </div>

        {/* Clean Checkout Form */}
        <form
          onSubmit={handleSubmit}
          onFocus={() => {
            trackInitiateCheckout({
              name: singlePkg.banglaName,
              price: grandTotal,
              quantity,
            });
          }}
          className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xl border border-[#e5e7eb]"
        >
          {/* Error Message */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-700 text-xs sm:text-sm font-bold animate-shake">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Customer Details Inputs */}
          <div className="space-y-4 mb-6">
            {/* Name */}
            <div>
              <label htmlFor="customerName" className="block text-sm font-bold text-[#14532d] mb-1.5">
                নামঃ <span className="text-red-500">*</span>
              </label>
              <input
                id="customerName"
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                className="w-full px-4 py-3 text-sm sm:text-base border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#15803d] focus:border-[#15803d] transition-all bg-white"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-[#14532d] mb-1.5">
                ফোন নাম্বারঃ <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="ফোন নাম্বার লিখুন (যেমন: 017XXXXXXXX)"
                className="w-full px-4 py-3 text-sm sm:text-base border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#15803d] focus:border-[#15803d] transition-all bg-white"
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-bold text-[#14532d] mb-1.5">
                সম্পুর্ন ঠিকানাঃ <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="জেলা, থানা এবং বাসার সম্পূর্ণ ঠিকানা লিখুন"
                className="w-full px-4 py-3 text-sm sm:text-base border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#15803d] focus:border-[#15803d] transition-all bg-white resize-none"
              />
            </div>
          </div>

          {/* Shipping Methods Box */}
          <div className="mb-6 p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
            <div className="text-xs font-bold text-[#15803d] uppercase tracking-wider mb-1">
              Shipping (ডেলিভারি)
            </div>
            <div className="flex items-center justify-between text-sm sm:text-base font-extrabold text-[#14532d]">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#15803d] inline-block" />
                সারা বাংলাদেশ ফ্রি হোম ডেলিভারি
              </span>
              <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-xs font-black">
                ৳০ (ফ্রি)
              </span>
            </div>
          </div>

          {/* Order Summary Table (like bilashfood / CartFlows) */}
          <div className="mb-6">
            <h3 className="text-base font-extrabold text-[#14532d] mb-3">
              Your Order (অর্ডারের বিবরণ)
            </h3>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 text-sm">
              {/* Product 1: Main Ilish Achar */}
              <div className="p-3 sm:p-4 flex items-center justify-between gap-3 bg-white">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-emerald-200 flex-shrink-0 bg-slate-50 shadow-xs">
                    <Image
                      src="/images/ilish_achar_real.jpg"
                      alt="ইলিশের আচার"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-extrabold text-slate-900 leading-tight text-sm">
                        ১. ইলিশ মাছের স্পেশাল আচার
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-[#15803d] px-1.5 py-0.2 rounded font-bold">
                        মূল পণ্য
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-semibold mt-0.5">
                      পরিমাণ: {quantity * 200} গ্রাম ({quantity}টি বড় জার)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white shadow-xs">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-7 h-7 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="w-7 text-center font-black text-slate-900 text-xs">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                      className="w-7 h-7 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-baseline gap-1.5 flex-shrink-0">
                    <span className="text-xs text-rose-500 line-through font-bold">
                      ৳{(singlePkg.regularPrice || 1200) * quantity}
                    </span>
                    <span className="font-extrabold text-[#15803d] text-base">
                      ৳{subtotal}
                    </span>
                  </div>
                </div>
              </div>

              {/* Product 2: Free Gorur Achar */}
              <div className="p-3 sm:p-4 flex items-center justify-between gap-3 bg-amber-50/40 border-t border-slate-200">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-amber-300 flex-shrink-0 bg-white shadow-xs">
                    <Image
                      src="/images/gorur_achar_real.jpg"
                      alt="গরুর মাংসের আচার"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-extrabold text-slate-900 leading-tight text-sm">
                        ২. গরুর মাংসের চুক্কা আচার
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.2 rounded font-black">
                        ১০০% ফ্রি 🎁
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-semibold mt-0.5">
                      পরিমাণ: {quantity * 100} গ্রাম • তুলতুলে নরম চুক্কা মাংস
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-slate-400 line-through font-bold">
                    ৳{250 * quantity}
                  </span>
                  <span className="text-xs font-black text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full shadow-2xs">
                    ৳০ (ফ্রি)
                  </span>
                </div>
              </div>

              {/* Product 3: Free Chingri Balachao */}
              <div className="p-3 sm:p-4 flex items-center justify-between gap-3 bg-amber-50/40 border-t border-slate-200">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-amber-300 flex-shrink-0 bg-white shadow-xs">
                    <Image
                      src="/images/chingri_balachao_real.jpg"
                      alt="চিংড়ি বালাচাও"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-extrabold text-slate-900 leading-tight text-sm">
                        ৩. মচমচে চিংড়ি শুঁটকি বালাচাও
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.2 rounded font-black">
                        ১০০% ফ্রি 🎁
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-semibold mt-0.5">
                      পরিমাণ: {quantity * 100} গ্রাম • ক্রিস্পি ভাজা রসুন ও পেঁয়াজ
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-slate-400 line-through font-bold">
                    ৳{200 * quantity}
                  </span>
                  <span className="text-xs font-black text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full shadow-2xs">
                    ৳০ (ফ্রি)
                  </span>
                </div>
              </div>

              {/* 3-in-1 Package Value Banner */}
              <div className="px-3.5 py-2.5 bg-gradient-to-r from-emerald-50 via-amber-50 to-emerald-50 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs font-black text-[#14532d]">
                <span className="flex items-center gap-1.5">
                  <span>📦</span>
                  <span>মোট ৩টি স্পেশাল জার ({quantity * 400} গ্রাম) একসাথে পাচ্ছেন</span>
                </span>
                <span className="text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                  🎁 ২টি জার সম্পূর্ণ ফ্রি!
                </span>
              </div>

              {/* Subtotal Row */}
              <div className="p-3 sm:px-4 flex items-center justify-between text-slate-600 font-bold">
                <span>Subtotal</span>
                <span>৳{subtotal}</span>
              </div>

              {/* Shipping Row */}
              <div className="p-3 sm:px-4 flex items-center justify-between text-slate-600 font-bold">
                <span>Shipment</span>
                <span className="text-[#15803d] font-extrabold">ফ্রি হোম ডেলিভারি (৳০)</span>
              </div>

              {/* Total Row */}
              <div className="p-3.5 sm:px-4 flex items-center justify-between bg-emerald-50/50 text-base sm:text-lg font-black text-[#14532d]">
                <div>
                  <span>Total</span>
                  <span className="block text-[11px] text-rose-600 font-black">
                    (সরাসরি {(singlePkg.regularPrice || 1200) * quantity - grandTotal} টাকা সেভ!)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-rose-400 line-through font-bold mr-1.5">
                    ৳{(singlePkg.regularPrice || 1200) * quantity}
                  </span>
                  <span className="text-[#15803d] text-xl font-black">৳{grandTotal}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Notice */}
          <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 font-extrabold text-slate-900 text-sm sm:text-base">
              <input
                type="radio"
                id="cod"
                name="payment_method"
                checked
                readOnly
                className="w-4 h-4 text-[#15803d] accent-[#15803d]"
              />
              <label htmlFor="cod" className="cursor-pointer">
                Cash on delivery (ক্যাশ অন ডেলিভারি)
              </label>
            </div>
            <p className="mt-1 text-xs text-slate-600 ml-6 font-semibold">
              পণ্য হাতে পেয়ে চেক করে ডেলিভারি ম্যানকে টাকা পরিশোধ করবেন। কোনো অগ্রিম পেমেন্টের ঝামেলা নেই।
            </p>
          </div>

          {/* Place Order Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full min-h-[58px] py-4 px-6 rounded-2xl bg-gradient-to-r from-[#15803d] via-[#166534] to-[#14532d] hover:from-[#166534] hover:to-[#064e3b] text-white text-lg sm:text-xl font-extrabold shadow-xl shadow-emerald-800/30 hover:shadow-2xl hover:shadow-emerald-800/40 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {/* Animated Shine Effect */}
            <span
              className="absolute top-0 -left-[100%] w-[70%] h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-[20deg] animate-[orderShine_3.5s_infinite]"
              aria-hidden="true"
            />

            {isSubmitting ? (
              <span className="relative z-10 flex items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                অর্ডার প্রসেস হচ্ছে...
              </span>
            ) : (
              <span className="relative z-10">
                অর্ডার কনফার্ম করুন &nbsp;&nbsp;৳{grandTotal}
              </span>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
