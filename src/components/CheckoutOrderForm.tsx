'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Check, ShieldCheck, MapPin, Phone, User, FileText, Loader2, Sparkles, Truck } from 'lucide-react';
import { ProductData, ComboPackage } from '@/types/landing';

interface CheckoutOrderFormProps {
  product: ProductData;
}

export default function CheckoutOrderForm({ product }: CheckoutOrderFormProps) {
  const router = useRouter();

  // Find default package
  const defaultPkg = product.packages.find((p) => p.isDefault) || product.packages[0] || {
    id: 'combo-10',
    name: '10 Pcs Attar Combo',
    banglaName: '১০ পিস মেগা কম্বো',
    subtitle: '১০টি ভিন্ন ভিন্ন প্রিমিয়াম ফ্লেভারের আতর',
    quantity: 10,
    regularPrice: 990,
    offerPrice: 490,
  };

  const [selectedPkg, setSelectedPkg] = useState<ComboPackage>(defaultPkg);
  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [cityZone, setCityZone] = useState<'dhaka' | 'outside'>('dhaka');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Delivery fee calculation
  const deliveryCharge =
    cityZone === 'dhaka'
      ? product.freeDeliveryDhaka
        ? 0
        : product.deliveryChargeDhaka
      : product.freeDeliveryOutside
      ? 0
      : product.deliveryChargeOutside;

  const subtotal = selectedPkg.offerPrice * quantity;
  const grandTotal = subtotal + deliveryCharge;

  // Track InitiateCheckout on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ((window as any).fbq) {
        (window as any).fbq('track', 'InitiateCheckout', {
          content_name: selectedPkg.banglaName || selectedPkg.name,
          value: grandTotal,
          currency: 'BDT',
        });
      }
      if ((window as any).ttq) {
        (window as any).ttq.track('InitiateCheckout', {
          content_name: selectedPkg.banglaName || selectedPkg.name,
          value: grandTotal,
          currency: 'BDT',
        });
      }
    }
  }, []);

  const handlePackageSelect = (pkg: ComboPackage) => {
    setSelectedPkg(pkg);
    setErrorMessage('');
  };

  const updateQuantity = (change: number) => {
    setQuantity((prev) => Math.max(1, Math.min(20, prev + change)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (!customerName.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার নাম লিখুন।');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 11) {
      setErrorMessage('অনুগ্রহ করে একটি সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন (যেমন: 017XXXXXXXX)।');
      return;
    }

    if (!address.trim() || address.trim().length < 5) {
      setErrorMessage('অনুগ্রহ করে আপনার বিস্তারিত ঠিকানা (বাড়ি/এলাকা, থানা, জেলা) লিখুন।');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: customerName.trim(),
        phone: cleanPhone,
        address: address.trim(),
        cityZone,
        selectedPackage: {
          id: selectedPkg.id,
          name: selectedPkg.name,
          banglaName: selectedPkg.banglaName,
          price: selectedPkg.offerPrice,
        },
        quantity,
        subtotal,
        deliveryCharge,
        total: grandTotal,
        notes: notes.trim(),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'অর্ডার সাবমিট করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }

      // Track Purchase in Pixels
      if (typeof window !== 'undefined') {
        if ((window as any).fbq) {
          (window as any).fbq('track', 'Purchase', {
            content_name: selectedPkg.banglaName || selectedPkg.name,
            content_type: 'product',
            value: grandTotal,
            currency: 'BDT',
            num_items: quantity,
          });
        }
        if ((window as any).ttq) {
          (window as any).ttq.track('CompletePayment', {
            content_name: selectedPkg.banglaName || selectedPkg.name,
            value: grandTotal,
            currency: 'BDT',
            quantity,
          });
        }
      }

      // Redirect to Order Success Page
      router.push(`/order-success/${data.order.id}`);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'নেটওয়ার্ক সমস্যার কারণে অর্ডার সম্পন্ন করা যায়নি।');
      setIsSubmitting(false);
    }
  };

  return (
    <section id="ordernowyet" className="py-14 px-4 bg-gradient-to-b from-slate-50 via-emerald-50/40 to-slate-100 relative scroll-mt-10">
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs sm:text-sm mb-2 shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>ক্যাশ অন ডেলিভারি অর্ডার ফর্ম</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            অর্ডার করতে নিচের ফর্মটি পূরণ করুন
          </h2>
          <p className="text-slate-600 mt-1.5 text-sm sm:text-base font-medium">
            পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধ করবেন। অগ্রিম ১ টাকাও দিতে হবে না।
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 sm:p-8 shadow-2xl border-2 border-emerald-600/30">
          {/* Step 1: Package Selection */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
              <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                ১
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                যেকোনো একটি প্যাকেজ নির্বাচন করুন
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {product.packages.map((pkg) => {
                const isSelected = selectedPkg.id === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => handlePackageSelect(pkg)}
                    className={`relative p-4 rounded-2xl cursor-pointer transition-all border-2 flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/40 shadow-md scale-[1.01]'
                        : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50/70'
                    }`}
                  >
                    {/* Badge */}
                    {pkg.badge && (
                      <span className="absolute -top-3 right-3 bg-red-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow">
                        {pkg.badge}
                      </span>
                    )}

                    <div>
                      {/* Radio & Name */}
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-base sm:text-lg">{pkg.banglaName}</h4>
                      </div>

                      <p className="text-xs text-slate-500 font-medium pl-8 mb-3">{pkg.subtitle}</p>
                    </div>

                    {/* Price and Regular Price */}
                    <div className="pt-2 border-t border-slate-200/60 flex items-baseline justify-between pl-8">
                      <div>
                        <span className="text-xs text-slate-400 line-through mr-2">৳{pkg.regularPrice}</span>
                        <span className="text-lg font-extrabold text-emerald-700">৳{pkg.offerPrice}</span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        {pkg.quantity} পিস
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quantity Selector */}
            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between max-w-md">
              <span className="text-sm font-bold text-slate-700">প্যাকেজের সংখ্যা (পরিমাণ):</span>
              <div className="flex items-center gap-3 bg-white border border-slate-300 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => updateQuantity(-1)}
                  className="w-8 h-8 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-lg transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-slate-900 text-base">{quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(1)}
                  className="w-8 h-8 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center text-lg transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Step 2: Customer Delivery Details */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
              <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                ২
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                আপনার ডেলিভারি তথ্য দিন
              </h3>
            </div>

            <div className="space-y-4">
              {/* Customer Name */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">
                  আপনার নাম লিখুন <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="আপনার পুরো নাম লিখুন"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">
                  আপনার মোবাইল নাম্বার লিখুন <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX (১১ ডিজিটের নাম্বার)"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">
                  আপনার সম্পূর্ণ ঠিকানা (গ্রাম/এলাকা, থানা, জেলা) <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute top-3.5 left-3.5 pointer-events-none text-slate-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="বাড়ি নং, রোড নং, এলাকা/গ্রাম, থানা ও জেলার নাম লিখুন"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Delivery Zone Selection */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  ডেলিভারি এলাকা নির্বাচন করুন <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                      cityZone === 'dhaka'
                        ? 'border-emerald-600 bg-emerald-50/80 font-bold text-emerald-900'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 font-medium text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="cityZone"
                        value="dhaka"
                        checked={cityZone === 'dhaka'}
                        onChange={() => setCityZone('dhaka')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>ঢাকা সিটির ভিতরে</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-200/70 px-2 py-0.5 rounded">
                      {product.freeDeliveryDhaka || product.deliveryChargeDhaka === 0
                        ? 'ফ্রী ডেলিভারি'
                        : `৳${product.deliveryChargeDhaka}`}
                    </span>
                  </label>

                  <label
                    className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                      cityZone === 'outside'
                        ? 'border-emerald-600 bg-emerald-50/80 font-bold text-emerald-900'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 font-medium text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="cityZone"
                        value="outside"
                        checked={cityZone === 'outside'}
                        onChange={() => setCityZone('outside')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>ঢাকা সিটির বাইরে (সারা দেশ)</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-200/70 px-2 py-0.5 rounded">
                      {product.freeDeliveryOutside || product.deliveryChargeOutside === 0
                        ? 'ফ্রী ডেলিভারি'
                        : `৳${product.deliveryChargeOutside}`}
                    </span>
                  </label>
                </div>
              </div>

              {/* Special Note (Optional) */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  স্পেশাল নোট বা ডেলিভারি নির্দেশনা (ঐচ্ছিক):
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="যেমন: বিকাল ৪টার পরে ডেলিভারি দিবেন"
                    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-normal focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Order Summary Table */}
          <div className="mb-6 bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200">
            <h4 className="font-bold text-slate-900 text-base mb-3 pb-2 border-b border-slate-200">
              আপনার অর্ডারের বিবরণ (Order Summary)
            </h4>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center text-slate-700">
                <span>
                  {selectedPkg.banglaName} × {quantity}
                </span>
                <span className="font-bold">৳{subtotal}</span>
              </div>

              <div className="flex justify-between items-center text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  ডেলিভারি চার্জ:
                </span>
                <span className="font-bold text-emerald-700">
                  {deliveryCharge === 0 ? 'ফ্রি (৳০)' : `৳${deliveryCharge}`}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-300/80 flex justify-between items-center text-base sm:text-lg font-extrabold text-slate-900">
                <span>সর্বমোট প্রদেয় মূল্য:</span>
                <span className="text-emerald-700 text-xl font-mono font-black">৳{grandTotal}</span>
              </div>
            </div>

            {/* Payment Method Banner */}
            <div className="mt-4 p-3 bg-emerald-100/70 border border-emerald-300 rounded-xl flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div className="text-xs sm:text-sm font-bold text-emerald-950">
                পেমেন্ট পদ্ধতি: <span className="text-emerald-800 underline">ক্যাশ অন ডেলিভারি</span> (পণ্য হাতে পেয়ে মূল্য পরিশোধ করবেন)
              </div>
            </div>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-300 text-red-700 text-sm font-bold text-center animate-shake">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Glowing Place Order Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`btn-pulse-order w-full bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-700 hover:to-green-800 text-white font-extrabold text-lg sm:text-2xl py-4 sm:py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 border-2 border-emerald-400/50 ${
              isSubmitting ? 'opacity-80 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-white" />
                <span>অর্ডার প্রসেসিং হচ্ছে...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-6 h-6 text-amber-300 animate-bounce" />
                <span>অর্ডার নিশ্চিত করুন — ৳{grandTotal}</span>
              </>
            )}
          </button>

          <p className="text-center text-xs text-slate-500 mt-3 font-medium flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>আপনার তথ্যের সম্পূর্ণ গোপনীয়তা বজায় রাখা হবে</span>
          </p>
        </form>
      </div>
    </section>
  );
}
