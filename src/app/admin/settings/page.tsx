'use client';

import { useState, useEffect } from 'react';
import {
  Save,
  Phone,
  MessageCircle,
  Share2,
  CheckCircle2,
  Bell,
  Code,
  Loader2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { StoreSettings } from '@/types/landing';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string>('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setSaveSuccess(false);
    setSaveError('');

    try {
      const payload: StoreSettings = {
        ...settings,
        storeName: (settings.storeName || '').trim(),
        hotlinePhone: (settings.hotlinePhone || '').trim(),
        whatsappNumber: (settings.whatsappNumber || '').trim(),
        messengerUrl: (settings.messengerUrl || '').trim(),
        facebookPageUrl: (settings.facebookPageUrl || '').trim(),
        metaPixelId: (settings.metaPixelId || '').trim(),
        tiktokPixelId: (settings.tiktokPixelId || '').trim(),
        announcementText: (settings.announcementText || '').trim(),
        announcementActive: !!settings.announcementActive,
      };

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setSaveError(data.error || 'সেটিংস সেভ করতে সমস্যা হয়েছে।');
      }
    } catch (err: any) {
      console.error('Save error:', err);
      setSaveError(err.message || 'নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-7 h-7 animate-spin text-emerald-600" />
        <span className="font-bold text-sm">সেটিংস লোড হচ্ছে...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            সেটিংস ও পিক্সেল ইন্টিগ্রেশন
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            হটলাইন, সোশ্যাল লিংক, অ্যানাউন্সমেন্ট ও ট্র্যাকিং পিক্সেল কনফিগারেশন
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3.5 py-2 rounded-xl flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              সফলভাবে সেভ হয়েছে!
            </span>
          )}

          {saveError && (
            <span className="text-xs font-bold text-red-700 bg-red-100 px-3.5 py-2 rounded-xl flex items-center gap-1.5 animate-fadeIn">
              ⚠️ {saveError}
            </span>
          )}

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-emerald-900/20 flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>সেটিংস সেভ করুন</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Contact & Social Settings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-600" />
              <span>যোগাযোগ ও সোশ্যাল মিডিয়া সেটিংস</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">লাইভ ওয়েবসাইট সিন্ক</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                স্টোরের নাম (Store Name)
              </label>
              <input
                type="text"
                placeholder="যেমন: JHT Food"
                value={settings.storeName || ''}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1">পেইজের টাইটেল ও কপিরাইটে প্রদর্শিত হবে।</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                সরাসরি কল হটলাইন নম্বর
              </label>
              <input
                type="text"
                placeholder="যেমন: 01522-133748"
                value={settings.hotlinePhone || ''}
                onChange={(e) => setSettings({ ...settings, hotlinePhone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1">গ্রাহক ক্লিক করলে সরাসরি আপনার এই নম্বরে কল যাবে।</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                হোয়াটসঅ্যাপ নম্বর (Country code সহ)
              </label>
              <input
                type="text"
                placeholder="যেমন: 8801522133748"
                value={settings.whatsappNumber || ''}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1">ফ্লোটিং হোয়াটসঅ্যাপ বাটনে ক্লিক করলে চ্যাট চালু হবে।</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ফেসবুক মেসেঞ্জার লিংক / ইউজারনেম
              </label>
              <input
                type="text"
                placeholder="যেমন: https://m.me/yourpage বা ইউজারনেম"
                value={settings.messengerUrl || ''}
                onChange={(e) => setSettings({ ...settings, messengerUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1">মেসেঞ্জারে সরাসরি গ্রাহক মেসেজ করতে পারবে।</p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ফেসবুক পেজ URL
              </label>
              <input
                type="text"
                placeholder="যেমন: https://facebook.com/yourpage"
                value={settings.facebookPageUrl || ''}
                onChange={(e) => setSettings({ ...settings, facebookPageUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1">ফুটার এবং সোশ্যাল লিংকে আপনার ফেসবুক পেজের লিংক থাকবে।</p>
            </div>
          </div>
        </div>

        {/* 2. Announcement Bar Settings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-600" />
              <span>ল্যান্ডিং পেইজ টপ অ্যানাউন্সমেন্ট বার (Header Announcement)</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">ওয়েবসাইটের শীর্ষে দেখাবে</span>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 text-sm font-bold text-slate-800 cursor-pointer select-none bg-slate-50 p-3 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={!!settings.announcementActive}
                onChange={(e) => setSettings({ ...settings, announcementActive: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <span>অ্যানাউন্সমেন্ট বার চালু রাখুন (সবার উপরে লাল/সবুজ অফার স্ট্রিপ দেখাবে)</span>
            </label>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                অ্যানাউন্সমেন্ট টেক্সট
              </label>
              <input
                type="text"
                placeholder="যেমন: 🎉 ইলিশের আচারে গরু ও বালাচাও ফ্রি!"
                value={settings.announcementText || ''}
                onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>

            {/* Live Preview Box */}
            {settings.announcementActive && (
              <div className="pt-2">
                <span className="block text-[11px] font-bold text-slate-500 mb-1">লাইভ প্রিভিউঃ</span>
                <div className="bg-gradient-to-r from-emerald-950 via-emerald-800 to-emerald-950 text-white text-xs font-black py-2 px-3 rounded-xl flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{settings.announcementText || '🎉 অফার টেক্সট'}</span>
                  </div>
                  <span className="bg-black/40 px-2 py-0.5 rounded-full text-[10px] font-mono text-amber-300">
                    12:42:15
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Marketing Tracking Pixels */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Code className="w-5 h-5 text-emerald-600" />
              <span>ফেসবুক ও টিকটক পিক্সেল ট্র্যাকিং (Ad Tracking)</span>
            </h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              Full E-Commerce Ready
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            আপনার পিক্সেল আইডি বসিয়ে নিচের <span className="font-bold text-emerald-700">"সেটিংস সেভ করুন"</span> বাটনে চাপুন। 
            পেইজ লোড হওয়া মাত্রই অফিসিয়াল ট্র্যাকিং কোড স্বয়ংক্রিয়ভাবে একটিভ হবে।
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Facebook Meta Pixel ID</span>
                <span className="text-[10px] text-slate-400 font-normal">Dataset ID</span>
              </label>
              <input
                type="text"
                placeholder="যেমন: 1234567890123456"
                value={settings.metaPixelId || ''}
                onChange={(e) => setSettings({ ...settings, metaPixelId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Meta Events Manager থেকে ১৬-১৮ ডিজিটের পিক্সেল বা ডেটাসেট আইডি দিন।
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>TikTok Pixel ID</span>
                <span className="text-[10px] text-slate-400 font-normal">TikTok Ads</span>
              </label>
              <input
                type="text"
                placeholder="যেমন: CXXXXXXXXXXXXXX"
                value={settings.tiktokPixelId || ''}
                onChange={(e) => setSettings({ ...settings, tiktokPixelId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                TikTok Ads Manager এর Assets &gt; Events থেকে আপনার Pixel ID টি দিন।
              </p>
            </div>
          </div>

          {/* Supported Events Showcase */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <span className="block text-xs font-bold text-slate-700 mb-2">
              ইভেন্ট ট্র্যাকিং স্ট্যাটাস (স্বয়ংক্রিয়ভাবে সক্রিয়):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-0.5">
                <span className="font-mono font-bold text-emerald-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  PageView
                </span>
                <span className="text-[10px] text-slate-500">পেইজে প্রবেশের সাথে সাথে</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-0.5">
                <span className="font-mono font-bold text-emerald-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  ViewContent
                </span>
                <span className="text-[10px] text-slate-500">পণ্য ও মূল্যসহ সক্রিয়</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-0.5">
                <span className="font-mono font-bold text-emerald-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  InitiateCheckout
                </span>
                <span className="text-[10px] text-slate-500">অর্ডার ফর্মে তথ্য দেওয়া শুরু করলে</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-0.5">
                <span className="font-mono font-bold text-emerald-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Purchase
                </span>
                <span className="text-[10px] text-slate-500">অর্ডার কনফার্ম হলে (Deduplicated)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Save Button Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3.5 py-2 rounded-xl flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              সেটিংস সফলভাবে সেভ হয়েছে!
            </span>
          )}

          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold px-8 py-3 rounded-xl text-base transition-all shadow-lg shadow-emerald-900/25 flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span>সেটিংস সেভ করুন</span>
          </button>
        </div>
      </form>
    </div>
  );
}
