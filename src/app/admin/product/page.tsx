'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Save,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  Package,
  Droplet,
  ShieldCheck,
  Star,
  Truck,
  Loader2,
} from 'lucide-react';
import { ProductData, ComboPackage, ScentItem, CustomerReview } from '@/types/landing';

export default function AdminProductPage() {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'general' | 'images' | 'packages' | 'scents' | 'reviews' | 'delivery'>('general');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await fetch('/api/product');
      const data = await res.json();
      if (data.success) {
        setProduct(data.product);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!product) return;
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      const data = await res.json();
      if (data.success) {
        setProduct(data.product);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery: boolean = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && product) {
        if (isGallery) {
          setProduct({
            ...product,
            galleryImages: [...product.galleryImages, data.url],
          });
        } else {
          setProduct({
            ...product,
            mainBannerImage: data.url,
          });
        }
      }
    } catch (e) {
      console.error('Image upload failed', e);
    }
  };

  // Combo Packages helper
  const addPackage = () => {
    if (!product) return;
    const newPkg: ComboPackage = {
      id: `pkg-${Date.now()}`,
      name: 'Custom Combo',
      banglaName: 'নতুন কম্বো প্যাকেজ',
      subtitle: 'বাছাইকৃত প্রিমিয়াম আতর',
      quantity: 5,
      regularPrice: 600,
      offerPrice: 350,
      badge: 'অফার 🔥',
      isDefault: false,
    };
    setProduct({
      ...product,
      packages: [...product.packages, newPkg],
    });
  };

  const removePackage = (id: string) => {
    if (!product) return;
    setProduct({
      ...product,
      packages: product.packages.filter((p) => p.id !== id),
    });
  };

  const updatePackage = (id: string, updates: Partial<ComboPackage>) => {
    if (!product) return;
    setProduct({
      ...product,
      packages: product.packages.map((p) => {
        if (p.id === id) {
          return { ...p, ...updates };
        }
        if (updates.isDefault) {
          return { ...p, isDefault: false };
        }
        return p;
      }),
    });
  };

  // Scents helper
  const addScent = (category: 'arabian' | 'perfume') => {
    if (!product) return;
    const newScent: ScentItem = {
      id: `sc-${Date.now()}`,
      name: category === 'arabian' ? 'নতুন এরাবিয়ান আতর' : 'নতুন পারফিউম আতর',
      category,
      notes: 'মন মাতানো সুবাস',
    };
    setProduct({
      ...product,
      scents: [...product.scents, newScent],
    });
  };

  const removeScent = (id: string) => {
    if (!product) return;
    setProduct({
      ...product,
      scents: product.scents.filter((s) => s.id !== id),
    });
  };

  // Customer Reviews helper
  const addReview = () => {
    if (!product) return;
    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      customerName: 'নতুন গ্রাহক',
      location: 'ঢাকা',
      rating: 5,
      comment: 'খুবই চমৎকার প্রোডাক্ট! ঘ্রাণ অনেকক্ষণ স্থায়ী হয়।',
      date: 'আজকে',
      verified: true,
    };
    setProduct({
      ...product,
      reviews: [...product.reviews, newRev],
    });
  };

  const removeReview = (id: string) => {
    if (!product) return;
    setProduct({
      ...product,
      reviews: product.reviews.filter((r) => r.id !== id),
    });
  };

  if (loading || !product) {
    return (
      <div className="p-8 text-center text-slate-500 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
        <span>লোড হচ্ছে...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header & Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm sticky top-4 z-20">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">ল্যান্ডিং পেইজ ও প্রোডাক্ট এডিটর</h1>
          <p className="text-sm text-slate-500 font-medium">সহজেই পণ্যের নাম, দাম, প্যাকেজ, ছবি ও অফার পরিবর্তন করুন</p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              সফলভাবে সেভ হয়েছে!
            </span>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-sm transition-all shadow flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>পরিবর্তন সেভ করুন</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        {[
          { id: 'general', label: 'হেডলাইন ও তথ্য', icon: Sparkles },
          { id: 'images', label: 'ছবি ও গ্যালারি', icon: ImageIcon },
          { id: 'packages', label: 'কম্বো প্যাকেজ সমূহ', icon: Package },
          { id: 'scents', label: 'আতর ও সুবাসের তালিকা', icon: Droplet },
          { id: 'reviews', label: 'কাস্টমার রিভিউ', icon: Star },
          { id: 'delivery', label: 'ডেলিভারি চার্জ', icon: Truck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: General Info */}
      {activeTab === 'general' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-200 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>মূল হেডলাইন ও টেক্সট কাস্টমাইজেশন</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ব্র্যান্ড নাম (Brand Name)</label>
              <input
                type="text"
                value={product.brandName}
                onChange={(e) => setProduct({ ...product, brandName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">প্রোডাক্টের নাম (Product Name)</label>
              <input
                type="text"
                value={product.productName}
                onChange={(e) => setProduct({ ...product, productName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">হেডলাইন শুরু (Headline Pre)</label>
              <input
                type="text"
                value={product.headlinePre}
                onChange={(e) => setProduct({ ...product, headlinePre: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">হেডলাইন হাইলাইট (লাল রঙের টেক্সট)</label>
              <input
                type="text"
                value={product.headlineHighlight}
                onChange={(e) => setProduct({ ...product, headlineHighlight: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-red-600 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">হেডলাইন দ্বিতীয় লাইন (নীল রঙের টেক্সট)</label>
              <input
                type="text"
                value={product.headlinePost}
                onChange={(e) => setProduct({ ...product, headlinePost: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-blue-700 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">ফ্রি ডেলিভারি অফার ব্যানার টেক্সট</label>
              <input
                type="text"
                value={product.freeDeliveryHeadline}
                onChange={(e) => setProduct({ ...product, freeDeliveryHeadline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-amber-700 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">সীমিত স্টক সংখ্যা (Stock Count)</label>
              <input
                type="number"
                value={product.stockCount}
                onChange={(e) => setProduct({ ...product, stockCount: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">কাউন্টডাউন টাইমার (ঘণ্টা)</label>
              <input
                type="number"
                value={product.countdownHours}
                onChange={(e) => setProduct({ ...product, countdownHours: parseInt(e.target.value) || 1 })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Images & Gallery */}
      {activeTab === 'images' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-200 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-emerald-600" />
            <span>ছবি ও গ্যালারি ম্যানেজমেন্ট</span>
          </h2>

          {/* Main Banner Image */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">মূল ব্যানার ছবি (Main Product Image)</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-300 flex-shrink-0">
                {product.mainBannerImage ? (
                  <Image src={product.mainBannerImage} alt="Main" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">ছবি নেই</div>
                )}
              </div>

              <div className="space-y-2 flex-1 w-full">
                <input
                  type="text"
                  placeholder="ছবির সরাসরি লিংক (URL) দিন"
                  value={product.mainBannerImage}
                  onChange={(e) => setProduct({ ...product, mainBannerImage: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, false)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>কম্পিউটার/মোবাইল থেকে ছবি আপলোড করুন</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Images */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-700">অতিরিক্ত গ্যালারি ছবিসমূহ</label>
              <input
                type="file"
                ref={galleryInputRef}
                accept="image/*"
                onChange={(e) => handleFileUpload(e, true)}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>নতুন ছবি যোগ করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {product.galleryImages.map((img, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-300 aspect-square bg-slate-100">
                  <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...product.galleryImages];
                      updated.splice(idx, 1);
                      setProduct({ ...product, galleryImages: updated });
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Packages / Combos */}
      {activeTab === 'packages' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">কম্বো প্যাকেজ ও মূল্য নির্ধারণ</h2>
              <p className="text-xs text-slate-500">গ্রাহকরা চেকআউট ফর্মে এই প্যাকেজগুলো দেখতে পাবেন</p>
            </div>

            <button
              type="button"
              onClick={addPackage}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন প্যাকেজ যোগ করুন</span>
            </button>
          </div>

          <div className="space-y-4">
            {product.packages.map((pkg, idx) => (
              <div
                key={pkg.id}
                className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50/50 space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h3 className="font-extrabold text-slate-900">{pkg.banglaName || pkg.name}</h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 cursor-pointer">
                      <input
                        type="radio"
                        name="defaultPackage"
                        checked={pkg.isDefault}
                        onChange={() => updatePackage(pkg.id, { isDefault: true })}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>ডিফল্ট সিলেক্টেড</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => removePackage(pkg.id)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">প্যাকেজের বাংলা নাম</label>
                    <input
                      type="text"
                      value={pkg.banglaName}
                      onChange={(e) => updatePackage(pkg.id, { banglaName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">সাবটাইটেল / বিবরণ</label>
                    <input
                      type="text"
                      value={pkg.subtitle}
                      onChange={(e) => updatePackage(pkg.id, { subtitle: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">হাইলাইট ব্যাজ (যেমন: Best Deal 🔥)</label>
                    <input
                      type="text"
                      value={pkg.badge || ''}
                      onChange={(e) => updatePackage(pkg.id, { badge: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-red-600 font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">আতর সংখ্যা (পিস)</label>
                    <input
                      type="number"
                      value={pkg.quantity}
                      onChange={(e) => updatePackage(pkg.id, { quantity: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">পূর্বের রেগুলার মূল্য (৳)</label>
                    <input
                      type="number"
                      value={pkg.regularPrice}
                      onChange={(e) => updatePackage(pkg.id, { regularPrice: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">অফার / ডিসকাউন্ট মূল্য (৳)</label>
                    <input
                      type="number"
                      value={pkg.offerPrice}
                      onChange={(e) => updatePackage(pkg.id, { offerPrice: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-extrabold text-emerald-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Scents Breakdown */}
      {activeTab === 'scents' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">আতর ও সুবাসের তালিকা</h2>
              <p className="text-xs text-slate-500">ল্যান্ডিং পেইজে প্রদর্শিত আতরগুলোর নাম ও নোট পরিবর্তন করুন</p>
            </div>
          </div>

          {/* Arabian Scents */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                এরাবিয়ান টাইপ আতর
              </h3>
              <button
                type="button"
                onClick={() => addScent('arabian')}
                className="text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>আতর যোগ করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.scents
                .filter((s) => s.category === 'arabian')
                .map((scent) => (
                  <div key={scent.id} className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl flex items-center gap-2">
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        value={scent.name}
                        onChange={(e) => {
                          const updated = product.scents.map((s) => (s.id === scent.id ? { ...s, name: e.target.value } : s));
                          setProduct({ ...product, scents: updated });
                        }}
                        className="w-full px-2.5 py-1 bg-white border border-amber-200 rounded text-xs font-bold focus:outline-none"
                      />
                      <input
                        type="text"
                        value={scent.notes || ''}
                        onChange={(e) => {
                          const updated = product.scents.map((s) => (s.id === scent.id ? { ...s, notes: e.target.value } : s));
                          setProduct({ ...product, scents: updated });
                        }}
                        placeholder="সুবাসের বিবরণ..."
                        className="w-full px-2.5 py-1 bg-white border border-amber-200 rounded text-[11px] text-slate-500 focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeScent(scent.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Perfume Scents */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-blue-900 text-sm flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                পারফিউম টাইপ আতর
              </h3>
              <button
                type="button"
                onClick={() => addScent('perfume')}
                className="text-xs font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>আতর যোগ করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.scents
                .filter((s) => s.category === 'perfume')
                .map((scent) => (
                  <div key={scent.id} className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl flex items-center gap-2">
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        value={scent.name}
                        onChange={(e) => {
                          const updated = product.scents.map((s) => (s.id === scent.id ? { ...s, name: e.target.value } : s));
                          setProduct({ ...product, scents: updated });
                        }}
                        className="w-full px-2.5 py-1 bg-white border border-blue-200 rounded text-xs font-bold focus:outline-none"
                      />
                      <input
                        type="text"
                        value={scent.notes || ''}
                        onChange={(e) => {
                          const updated = product.scents.map((s) => (s.id === scent.id ? { ...s, notes: e.target.value } : s));
                          setProduct({ ...product, scents: updated });
                        }}
                        placeholder="সুবাসের বিবরণ..."
                        className="w-full px-2.5 py-1 bg-white border border-blue-200 rounded text-[11px] text-slate-500 focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeScent(scent.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Customer Reviews */}
      {activeTab === 'reviews' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">কাস্টমার রিভিউ ও টেস্টিমোনিয়াল</h2>
              <p className="text-xs text-slate-500">গ্রাহকদের ইতিবাচক মতামত যুক্ত ও এডিট করুন</p>
            </div>

            <button
              type="button"
              onClick={addReview}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন রিভিউ যোগ করুন</span>
            </button>
          </div>

          <div className="space-y-3">
            {product.reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 relative">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">গ্রাহকের নাম</label>
                    <input
                      type="text"
                      value={rev.customerName}
                      onChange={(e) => {
                        const updated = product.reviews.map((r) => (r.id === rev.id ? { ...r, customerName: e.target.value } : r));
                        setProduct({ ...product, reviews: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">লোকেশন</label>
                    <input
                      type="text"
                      value={rev.location}
                      onChange={(e) => {
                        const updated = product.reviews.map((r) => (r.id === rev.id ? { ...r, location: e.target.value } : r));
                        setProduct({ ...product, reviews: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">স্টার রেটিং (১-৫)</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={rev.rating}
                      onChange={(e) => {
                        const updated = product.reviews.map((r) => (r.id === rev.id ? { ...r, rating: parseInt(e.target.value) || 5 } : r));
                        setProduct({ ...product, reviews: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">মন্তব্য (Comment)</label>
                  <textarea
                    rows={2}
                    value={rev.comment}
                    onChange={(e) => {
                      const updated = product.reviews.map((r) => (r.id === rev.id ? { ...r, comment: e.target.value } : r));
                      setProduct({ ...product, reviews: updated });
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeReview(rev.id)}
                    className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>মুছে ফেলুন</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Delivery Settings */}
      {activeTab === 'delivery' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-200 flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-600" />
            <span>ডেলিভারি চার্জ কনফিগারেশন</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Dhaka */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">ঢাকা সিটির ভিতরে</h3>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={product.freeDeliveryDhaka}
                  onChange={(e) => setProduct({ ...product, freeDeliveryDhaka: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>সম্পূর্ণ ফ্রি ডেলিভারি (৳০)</span>
              </label>

              {!product.freeDeliveryDhaka && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">ডেলিভারি ফি (৳)</label>
                  <input
                    type="number"
                    value={product.deliveryChargeDhaka}
                    onChange={(e) => setProduct({ ...product, deliveryChargeDhaka: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              )}
            </div>

            {/* Outside Dhaka */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">ঢাকা সিটির বাইরে (সারা দেশ)</h3>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={product.freeDeliveryOutside}
                  onChange={(e) => setProduct({ ...product, freeDeliveryOutside: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>সম্পূর্ণ ফ্রি ডেলিভারি (৳০)</span>
              </label>

              {!product.freeDeliveryOutside && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">ডেলিভারি ফি (৳)</label>
                  <input
                    type="number"
                    value={product.deliveryChargeOutside}
                    onChange={(e) => setProduct({ ...product, deliveryChargeOutside: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
