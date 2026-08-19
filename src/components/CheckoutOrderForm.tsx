'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Check, ShieldCheck, MapPin, Phone, User, FileText, Loader2, Truck, CreditCard, Package } from 'lucide-react';
import { ProductData, ComboPackage } from '@/types/landing';

interface CheckoutOrderFormProps {
  product: ProductData;
}

export default function CheckoutOrderForm({ product }: CheckoutOrderFormProps) {
  const router = useRouter();

  // Sort packages ascending by price for display
  const sortedPackages = [...product.packages].sort((a, b) => a.offerPrice - b.offerPrice);

  const defaultPkg = product.packages.find((p) => p.id === 'combo-10') || product.packages.find((p) => p.isDefault) || product.packages[0] || {
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
    if (phone.replace(/[^0-9]/g, '').length >= 10) {
      captureLead(phone, customerName, address, pkg);
    }
  };

  const updateQuantity = (change: number) => {
    const newQty = Math.max(1, Math.min(20, quantity + change));
    setQuantity(newQty);
    if (phone.replace(/[^0-9]/g, '').length >= 10) {
      captureLead(phone, customerName, address, selectedPkg, newQty);
    }
  };

  // Real-time silent lead capture when customer enters phone number
  const captureLead = async (
    phoneVal?: string,
    nameVal?: string,
    addrVal?: string,
    pkgVal?: ComboPackage,
    qtyVal?: number
  ) => {
    const currentPhone = (phoneVal !== undefined ? phoneVal : phone).replace(/[^0-9]/g, '');
    if (!currentPhone || currentPhone.length < 10) return;

    try {
      const activePkg = pkgVal || selectedPkg;
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: currentPhone,
          customerName: (nameVal !== undefined ? nameVal : customerName).trim() || undefined,
          address: (addrVal !== undefined ? addrVal : address).trim() || undefined,
          cityZone,
          selectedPackage: {
            id: activePkg.id,
            name: activePkg.name,
            banglaName: activePkg.banglaName,
            price: activePkg.offerPrice,
          },
          quantity: qtyVal || quantity,
          source: 'checkout_form',
        }),
      });
    } catch {
      // Silent catch
    }
  };

  // Debounced auto-capture as user types phone
  useEffect(() => {
    const clean = phone.replace(/[^0-9]/g, '');
    if (clean.length >= 11) {
      const timer = setTimeout(() => {
        captureLead(phone, customerName, address);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [phone, customerName, address, cityZone]);

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
    <section id="ordernowyet" className="py-14 px-4 bg-gradient-to-b from-slate-50 via-white to-slate-50 scroll-mt-10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-50/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-50/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Section Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-3">
            <CreditCard className="w-3 h-3" />
            ক্যাশ অন ডেলিভারি
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            অর্ডার করতে নিচের ফর্মটি পূরণ করুন
          </h2>
          <p className="text-slate-500 mt-2 text-sm font-medium max-w-md mx-auto">
            পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধ করবেন। অগ্রিম ১ টাকাও দিতে হবে না।
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
          {/* Step 1: Package Selection */}
          <div className="mb-8">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 text-white font-bold flex items-center justify-center text-xs shadow-md shadow-emerald-600/20">
                ১
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                প্যাকেজ নির্বাচন করুন
              </h3>
            </div>

            <div className="space-y-3">
              {sortedPackages.map((pkg) => {
                const isSelected = selectedPkg.id === pkg.id;
                const isDefault = pkg.isDefault;
                const savingsPercent = Math.round(((pkg.regularPrice - pkg.offerPrice) / pkg.regularPrice) * 100);
                const savingsAmount = pkg.regularPrice - pkg.offerPrice;

                return (
                  <div
                    key={pkg.id}
                    onClick={() => handlePackageSelect(pkg)}
                    className={`relative cursor-pointer transition-all duration-300 rounded-2xl overflow-hidden ${
                      isSelected
                        ? 'shadow-lg ring-2 ring-emerald-500'
                        : 'hover:shadow-md border border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    {/* "BEST VALUE" top ribbon for the default/recommended package */}
                    {isDefault && (
                      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white text-[10px] font-extrabold text-center py-1 tracking-wider uppercase flex items-center justify-center gap-1">
                        <span>⭐</span> সবচেয়ে জনপ্রিয় — সেরা মূল্য <span>⭐</span>
                      </div>
                    )}

                    <div className={`p-4 flex items-center gap-3 ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-50/80 to-white'
                        : 'bg-white'
                    }`}>
                      {/* Accent bar on left when selected */}
                      {isSelected && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-emerald-600" />
                      )}

                      {/* Radio circle */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-600 scale-110 shadow-md shadow-emerald-600/30'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                      </div>

                      {/* Package Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`font-extrabold text-sm ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>
                            {pkg.banglaName}
                          </h4>
                          {pkg.badge && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isDefault
                                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm shadow-amber-400/30'
                                : 'bg-red-50 text-red-600 border border-red-200'
                            }`}>
                              {pkg.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{pkg.subtitle}</p>
                      </div>

                      {/* Pricing block */}
                      <div className="text-right flex-shrink-0 ml-2">
                        <div className="flex items-center gap-1.5 justify-end mb-0.5">
                          <span className="text-[11px] text-slate-400 line-through">৳{pkg.regularPrice}</span>
                          <span className="text-[9px] font-extrabold text-white bg-gradient-to-r from-red-500 to-rose-500 px-1.5 py-0.5 rounded-full shadow-sm leading-none">
                            -{savingsPercent}%
                          </span>
                        </div>
                        <span className={`text-xl font-black ${isSelected ? 'text-emerald-700' : 'text-slate-800'}`}>
                          ৳{pkg.offerPrice}
                        </span>
                        <p className="text-[9px] font-bold text-emerald-600 mt-0.5">
                          সেভ ৳{savingsAmount}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quantity Selector */}
            <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100/60 border border-slate-100 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-600 flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-600" />
                পরিমাণ:
              </span>
              <div className="flex items-center gap-0 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => updateQuantity(-1)}
                  className="w-10 h-10 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-lg transition-all active:scale-95 border-r border-slate-200"
                >
                  −
                </button>
                <span className="w-10 text-center font-extrabold text-slate-900 text-sm">{quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(1)}
                  className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold flex items-center justify-center text-lg transition-all shadow-inner active:scale-95"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Step 2: Customer Details */}
          <div className="mb-8">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 text-white font-bold flex items-center justify-center text-xs shadow-md shadow-emerald-600/20">
                ২
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                ডেলিভারি তথ্য দিন
              </h3>
            </div>

            <div className="space-y-4">
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  আপনার নাম <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    onBlur={() => {
                      if (phone.replace(/[^0-9]/g, '').length >= 10) {
                        captureLead(phone, customerName, address);
                      }
                    }}
                    placeholder="আপনার পুরো নাম লিখুন"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 transition-all hover:border-slate-300"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  মোবাইল নাম্বার <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={() => {
                      if (phone.replace(/[^0-9]/g, '').length >= 10) {
                        captureLead(phone, customerName, address);
                      }
                    }}
                    placeholder="017XXXXXXXX"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 transition-all hover:border-slate-300"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onBlur={() => {
                      if (phone.replace(/[^0-9]/g, '').length >= 10) {
                        captureLead(phone, customerName, address);
                      }
                    }}
                    placeholder="বাড়ি, রোড, এলাকা/গ্রাম, থানা ও জেলা"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 transition-all resize-none hover:border-slate-300"
                  />
                </div>
              </div>

              {/* Delivery Zone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  ডেলিভারি এলাকা <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <label
                    className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all duration-300 text-sm ${
                      cityZone === 'dhaka'
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-md shadow-emerald-100/50'
                        : 'border-slate-100 bg-white hover:border-slate-200'
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
                      <span className="text-xs font-bold">ঢাকার ভিতরে</span>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      cityZone === 'dhaka' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {product.freeDeliveryDhaka || product.deliveryChargeDhaka === 0 ? 'ফ্রী' : `৳${product.deliveryChargeDhaka}`}
                    </span>
                  </label>

                  <label
                    className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all duration-300 text-sm ${
                      cityZone === 'outside'
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-md shadow-emerald-100/50'
                        : 'border-slate-100 bg-white hover:border-slate-200'
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
                      <span className="text-xs font-bold">ঢাকার বাইরে</span>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      cityZone === 'outside' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {product.freeDeliveryOutside || product.deliveryChargeOutside === 0 ? 'ফ্রী' : `৳${product.deliveryChargeOutside}`}
                    </span>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] text-slate-400 font-medium mb-1.5">
                  নোট (ঐচ্ছিক)
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="যেমন: বিকাল ৪টার পরে ডেলিভারি"
                    className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50/80 border border-slate-200 rounded-xl text-slate-700 placeholder:text-slate-400 transition-all hover:border-slate-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mb-6 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-5 border border-slate-200/50">
            <h4 className="font-extrabold text-slate-800 text-sm mb-3.5 pb-2.5 border-b border-slate-200 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-emerald-600" />
              অর্ডার সারাংশ
            </h4>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between items-center text-slate-600">
                <span>{selectedPkg.banglaName} × {quantity}</span>
                <span className="font-bold text-slate-800">৳{subtotal}</span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  ডেলিভারি
                </span>
                <span className="font-bold text-emerald-700">
                  {deliveryCharge === 0 ? 'ফ্রি' : `৳${deliveryCharge}`}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="font-extrabold text-slate-900">সর্বমোট</span>
                <span className="text-xl font-extrabold text-gradient">৳{grandTotal}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200/60 rounded-xl flex items-center gap-2.5 text-xs font-bold text-emerald-800">
              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>পেমেন্ট: ক্যাশ অন ডেলিভারি — পণ্য হাতে পেয়ে টাকা দিন</span>
            </div>
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 active:from-emerald-900 active:to-emerald-800 text-white font-extrabold text-base py-4 rounded-2xl shadow-xl shadow-emerald-700/20 transition-all duration-300 flex items-center justify-center gap-2.5 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.99]'
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

          <p className="text-center text-[11px] text-slate-400 mt-3 flex items-center justify-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>আপনার তথ্যের সম্পূর্ণ গোপনীয়তা বজায় রাখা হবে</span>
          </p>
        </form>
      </div>
    </section>
  );
}
