'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Check, ShieldCheck, MapPin, Phone, User, FileText, Loader2, Truck } from 'lucide-react';
import { ProductData, ComboPackage } from '@/types/landing';

interface CheckoutOrderFormProps {
  product: ProductData;
}

export default function CheckoutOrderForm({ product }: CheckoutOrderFormProps) {
  const router = useRouter();

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
      setErrorMessage('অনুগ্রহ করে আপনার বিস্তারিত ঠিকানা (বাড়ি/এলাকা, থানা, জেলা) লিখুন।');
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
        throw new Error(data.error || 'অর্ডার সাবমিট করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }

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

      router.push(`/order-success/${data.order.id}`);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'নেটওয়ার্ক সমস্যার কারণে অর্ডার সম্পন্ন করা যায়নি।');
      setIsSubmitting(false);
    }
  };

  return (
    <section id="ordernowyet" className="py-12 px-4 bg-slate-50 scroll-mt-10">
      <div className="max-w-3xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-6">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">ক্যাশ অন ডেলিভারি</p>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            অর্ডার করতে নিচের ফর্মটি পূরণ করুন
          </h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধ করবেন। অগ্রিম ১ টাকাও দিতে হবে না।
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-slate-200">
          {/* Step 1: Package Selection */}
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                ১
              </span>
              <h3 className="text-base font-bold text-slate-900">
                প্যাকেজ নির্বাচন করুন
              </h3>
            </div>

            <div className="space-y-2.5">
              {product.packages.map((pkg) => {
                const isSelected = selectedPkg.id === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => handlePackageSelect(pkg)}
                    className={`relative p-3.5 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Radio */}
                        <div
                          className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 bg-white'
                          }`}
                          style={{ width: '18px', height: '18px' }}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm">{pkg.banglaName}</h4>
                            {pkg.badge && (
                              <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                {pkg.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{pkg.subtitle}</p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right flex-shrink-0 ml-3">
                        <span className="text-[11px] text-slate-400 line-through block">৳{pkg.regularPrice}</span>
                        <span className="text-base font-extrabold text-emerald-700">৳{pkg.offerPrice}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quantity Selector */}
            <div className="mt-3.5 p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-600">পরিমাণ:</span>
              <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => updateQuantity(-1)}
                  className="w-8 h-8 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-base transition-colors"
                >
                  −
                </button>
                <span className="w-6 text-center font-bold text-slate-900 text-sm">{quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(1)}
                  className="w-8 h-8 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center justify-center text-base transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Step 2: Customer Details */}
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                ২
              </span>
              <h3 className="text-base font-bold text-slate-900">
                ডেলিভারি তথ্য দিন
              </h3>
            </div>

            <div className="space-y-3.5">
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  আপনার নাম <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="আপনার পুরো নাম লিখুন"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-medium placeholder:text-slate-400 transition-all"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
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
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-medium placeholder:text-slate-400 transition-all"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="বাড়ি, রোড, এলাকা/গ্রাম, থানা ও জেলা"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-medium placeholder:text-slate-400 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Delivery Zone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ডেলিভারি এলাকা <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label
                    className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all text-sm ${
                      cityZone === 'dhaka'
                        ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-900'
                        : 'border-slate-200 bg-white hover:bg-slate-50 font-medium text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="cityZone"
                        value="dhaka"
                        checked={cityZone === 'dhaka'}
                        onChange={() => setCityZone('dhaka')}
                        className="accent-emerald-600 w-3.5 h-3.5"
                      />
                      <span className="text-xs">ঢাকার ভিতরে</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700">
                      {product.freeDeliveryDhaka || product.deliveryChargeDhaka === 0 ? 'ফ্রী' : `৳${product.deliveryChargeDhaka}`}
                    </span>
                  </label>

                  <label
                    className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all text-sm ${
                      cityZone === 'outside'
                        ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-900'
                        : 'border-slate-200 bg-white hover:bg-slate-50 font-medium text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="cityZone"
                        value="outside"
                        checked={cityZone === 'outside'}
                        onChange={() => setCityZone('outside')}
                        className="accent-emerald-600 w-3.5 h-3.5"
                      />
                      <span className="text-xs">ঢাকার বাইরে</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700">
                      {product.freeDeliveryOutside || product.deliveryChargeOutside === 0 ? 'ফ্রী' : `৳${product.deliveryChargeOutside}`}
                    </span>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  নোট (ঐচ্ছিক)
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="যেমন: বিকাল ৪টার পরে ডেলিভারি"
                    className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mb-5 bg-slate-50 rounded-xl p-4 border border-slate-100">
            <h4 className="font-bold text-slate-800 text-sm mb-3 pb-2 border-b border-slate-200">
              অর্ডার সারাংশ
            </h4>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center text-slate-600">
                <span>{selectedPkg.banglaName} × {quantity}</span>
                <span className="font-semibold text-slate-800">৳{subtotal}</span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  ডেলিভারি
                </span>
                <span className="font-semibold text-emerald-700">
                  {deliveryCharge === 0 ? 'ফ্রি' : `৳${deliveryCharge}`}
                </span>
              </div>

              <div className="pt-2.5 border-t border-slate-200 flex justify-between items-center font-extrabold text-slate-900">
                <span>সর্বমোট</span>
                <span className="text-lg text-emerald-700">৳{grandTotal}</span>
              </div>
            </div>

            <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <Check className="w-3.5 h-3.5 flex-shrink-0" />
              <span>পেমেন্ট: ক্যাশ অন ডেলিভারি — পণ্য হাতে পেয়ে টাকা দিন</span>
            </div>
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold text-center">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-base py-3.5 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2.5 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>প্রসেসিং...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                <span>অর্ডার নিশ্চিত করুন — ৳{grandTotal}</span>
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-slate-400 mt-2.5 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>আপনার তথ্যের সম্পূর্ণ গোপনীয়তা বজায় রাখা হবে</span>
          </p>
        </form>
      </div>
    </section>
  );
}
