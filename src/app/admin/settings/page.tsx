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
  HelpCircle,
} from 'lucide-react';
import { StoreSettings } from '@/types/landing';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string>('');
  const [showMetaGuide, setShowMetaGuide] = useState<boolean>(false);
  const [showTikTokGuide, setShowTikTokGuide] = useState<boolean>(false);

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
        fbCapiEnabled: settings.fbCapiEnabled !== false,
        fbCapiToken: (settings.fbCapiToken || '').trim(),
        fbTestEventCode: (settings.fbTestEventCode || '').trim(),
        tiktokPixelId: (settings.tiktokPixelId || '').trim(),
        tiktokCapiEnabled: settings.tiktokCapiEnabled !== false,
        tiktokCapiToken: (settings.tiktokCapiToken || '').trim(),
        tiktokTestEventCode: (settings.tiktokTestEventCode || '').trim(),
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
            সেটিংস ও অ্যাড ট্র্যাকিং ইন্টিগ্রেশন
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            হটলাইন, সোশ্যাল লিংক, অ্যানাউন্সমেন্ট, Facebook CAPI ও TikTok Events API ট্র্যাকিং
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
              <span>অ্যানাউন্সমেন্ট বার চালু রাখুন (সবার উপরে অফার স্ট্রিপ দেখাবে)</span>
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

        {/* ============================================================== */}
        {/* 3. FACEBOOK META PIXEL & CONVERSION API (CAPI) */}
        {/* ============================================================== */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-600" />
              <span>১. ফেসবুক মেটা পিক্সেল ও কনভার্সন এপিআই (Meta Pixel & CAPI)</span>
            </h2>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" />
              Meta CAPI Ready
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            ফেসবুক মেটা পিক্সেল আইডি ও সার্ভার-সাইড Conversions API (CAPI) টোকেন দিন। এটি ব্রাউজার অ্যাডব্লকার ও iOS 14+ বাইপাস করে মেটাতে শতভাগ নির্ভুল ডেটা ট্র্যাক করতে সাহায্য করবে।
          </p>

          {/* Meta Pixel ID */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Facebook Meta Pixel ID (Dataset ID)
              </label>
              <button
                type="button"
                onClick={() => setShowMetaGuide(!showMetaGuide)}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 underline flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3 h-3" />
                How to get it?
              </button>
            </div>
            <input
              type="text"
              placeholder="যেমন: 1234567890123456"
              value={settings.metaPixelId || ''}
              onChange={(e) => setSettings({ ...settings, metaPixelId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            <p className="text-[11px] text-slate-400">
              Meta Events Manager থেকে ১৬-১৮ ডিজিটের Dataset বা Pixel ID দিন।
            </p>
          </div>

          {/* Meta Guide Box */}
          {showMetaGuide && (
            <div className="p-4 rounded-xl bg-blue-50/90 border border-blue-200 text-xs text-slate-700 space-y-2 animate-fadeIn">
              <span className="font-extrabold text-blue-900 block text-sm">
                📋 যেভাবে Meta Pixel ID ও CAPI Token বের করবেন:
              </span>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
                <li>
                  <a href="https://business.facebook.com/events_manager2" target="_blank" rel="noreferrer" className="text-blue-700 underline font-bold inline-flex items-center gap-1">
                    Meta Events Manager <ExternalLink className="w-3 h-3 inline" />
                  </a> এ যান।
                </li>
                <li>আপনার কাঙ্ক্ষিত <strong>Dataset / Pixel</strong> সিলেক্ট করুন। ডানপাশে ১৬-১৮ ডিজিটের <strong>Dataset ID</strong> পাবেন, তা কপি করে উপরে দিন।</li>
                <li>উপরের <strong>Settings</strong> ট্যাবে যান, স্ক্রল করে <strong>Set up direct integration &gt; Generate access token</strong> লিংকে চাপুন।</li>
                <li>প্রাপ্ত লম্বা টোকেনটি কপি করে নিচের <strong>Conversion API Token</strong> বক্সে বসিয়ে সেভ করুন।</li>
              </ol>
            </div>
          )}

          {/* CAPI Token-Based Conversion API Switch Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-extrabold text-slate-900 block leading-tight">
                    Token-based Conversion API
                  </span>
                  <span className="text-[11px] text-slate-500">
                    সার্ভার-সাইড সরাসরি ফেসবুক ডেটা ট্র্যাকিং (iOS 14+ ও অ্যাডব্লকার বাইপাস)
                  </span>
                </div>
              </div>

              {/* Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={settings.fbCapiEnabled !== false}
                  onChange={(e) => setSettings({ ...settings, fbCapiEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* If CAPI is enabled, show Token and Test Code inputs */}
            {settings.fbCapiEnabled !== false && (
              <div className="space-y-4 pt-3 border-t border-slate-200 animate-fadeIn">
                {/* Conversion API Token */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Conversion API Token:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Api token (যেমন: EAAB...)"
                    value={settings.fbCapiToken || ''}
                    onChange={(e) => setSettings({ ...settings, fbCapiToken: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none shadow-xs"
                  />
                  <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200/90 text-[11px] text-amber-900 leading-relaxed">
                    <p className="font-semibold mb-1">
                      Add the Conversion API token for this pixel.
                    </p>
                    <p className="text-amber-800">
                      Send events directly from your web server to Facebook through the Conversion API. This helps capture more events and improves Event Match Quality (EMQ). An access token is required to use the server-side API.
                    </p>
                  </div>
                </div>

                {/* Test Event Code */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Test Event Code:
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: TEST89595 বা TEST94492"
                    value={settings.fbTestEventCode || ''}
                    onChange={(e) => setSettings({ ...settings, fbTestEventCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-xs"
                  />
                  <p className="text-[11px] text-slate-500">
                    Use this if you need to test the server-side event in Meta Events Manager &gt; Test Events. Remove it after testing is complete.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* 4. TIKTOK PIXEL & EVENTS API (TIKTOK CAPI) */}
        {/* ============================================================== */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Code className="w-5 h-5 text-rose-600" />
              <span>২. টিকটক পিক্সেল ও ইভেন্টস এপিআই (TikTok Pixel & Events API)</span>
            </h2>
            <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-rose-600" />
              TikTok Events API Ready
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            টিকটক অ্যাডস এর পিক্সেল আইডি ও সার্ভার-সাইড Events API কনফিগার করুন। এর মাধ্যমে টিকটক অ্যাড ম্যানেজার ১০০% সঠিক পার্চেজ ও কনভার্সন ডেটা ক্যাপচার করতে পারবে।
          </p>

          {/* TikTok Pixel ID */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                TikTok Pixel ID
              </label>
              <button
                type="button"
                onClick={() => setShowTikTokGuide(!showTikTokGuide)}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 underline flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3 h-3" />
                How to get it?
              </button>
            </div>
            <input
              type="text"
              placeholder="যেমন: CXXXXXXXXXXXXXX"
              value={settings.tiktokPixelId || ''}
              onChange={(e) => setSettings({ ...settings, tiktokPixelId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none transition-all"
            />
            <p className="text-[11px] text-slate-400">
              TikTok Ads Manager এর Assets &gt; Events থেকে আপনার Pixel ID টি দিন।
            </p>
          </div>

          {/* TikTok Guide Box */}
          {showTikTokGuide && (
            <div className="p-4 rounded-xl bg-rose-50/90 border border-rose-200 text-xs text-slate-700 space-y-2 animate-fadeIn">
              <span className="font-extrabold text-rose-900 block text-sm">
                📋 যেভাবে TikTok Pixel ID ও Events API Token বের করবেন:
              </span>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
                <li>
                  <a href="https://ads.tiktok.com/" target="_blank" rel="noreferrer" className="text-rose-700 underline font-bold inline-flex items-center gap-1">
                    TikTok Ads Manager <ExternalLink className="w-3 h-3 inline" />
                  </a> এ লগইন করে <strong>Assets &gt; Events &gt; Web Events</strong> এ যান।
                </li>
                <li>আপনার Pixel সিলেক্ট করুন এবং Pixel ID কপি করে উপরে দিন।</li>
                <li>Pixel-এর <strong>Settings</strong> ট্যাবে যান এবং নিচে স্ক্রল করে <strong>Events API</strong> সেকশনে <em>&quot;Generate Access Token&quot;</em> বাটনে ক্লিক করুন।</li>
                <li>প্রাপ্ত দীর্ঘ Access Token টি কপি করে নিচের <strong>TikTok Access Token</strong> বক্সে বসিয়ে সেভ করুন।</li>
              </ol>
            </div>
          )}

          {/* TikTok Token-Based Events API Switch Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-extrabold text-slate-900 block leading-tight">
                    Token-based Events API (TikTok Server CAPI)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    সার্ভার-সাইড সরাসরি টিকটক ডেটা ট্র্যাকিং (Deduplicated with Browser Pixel)
                  </span>
                </div>
              </div>

              {/* Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={settings.tiktokCapiEnabled !== false}
                  onChange={(e) => setSettings({ ...settings, tiktokCapiEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
              </label>
            </div>

            {/* If TikTok CAPI is enabled, show Token and Test Code inputs */}
            {settings.tiktokCapiEnabled !== false && (
              <div className="space-y-4 pt-3 border-t border-slate-200 animate-fadeIn">
                {/* TikTok Events API Token */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    TikTok Events API Access Token:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="TikTok Access Token (যেমন: act_... বা লম্বা স্ট্রিং)"
                    value={settings.tiktokCapiToken || ''}
                    onChange={(e) => setSettings({ ...settings, tiktokCapiToken: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:ring-2 focus:ring-rose-500 outline-none transition-all resize-none shadow-xs"
                  />
                  <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200/90 text-[11px] text-amber-900 leading-relaxed">
                    <p className="font-semibold mb-1">
                      Add the TikTok Events API token for this pixel:
                    </p>
                    <p className="text-amber-800">
                      Send events directly from your web server to TikTok through the Events API. This prevents ad attribution loss and ensures 100% of purchase conversions are recorded in TikTok Ads Manager.
                    </p>
                  </div>
                </div>

                {/* TikTok Test Event Code */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    TikTok Test Event Code (ঐচ্ছিক - টেস্ট করার জন্য):
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: TEST12345"
                    value={settings.tiktokTestEventCode || ''}
                    onChange={(e) => setSettings({ ...settings, tiktokTestEventCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:ring-2 focus:ring-rose-500 outline-none transition-all shadow-xs"
                  />
                  <p className="text-[11px] text-slate-500">
                    TikTok Ads Manager &gt; Events &gt; Test Events ট্যাবের টেস্ট কোডটি এখানে বসিয়ে অর্ডার সাবমিট করে লাইভ টেস্ট করতে পারবেন। টেস্ট শেষ হলে কোডটি মুছে দিন।
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* UNIFIED EVENT TRACKING STATUS SHOWCASE */}
        {/* ============================================================== */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="block text-xs font-bold text-slate-700">
              ইভেন্ট ট্র্যাকিং স্ট্যাটাস (Meta ও TikTok উভয় প্ল্যাটফর্মে সক্রিয়):
            </span>
            <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Full E-Commerce Ready
            </span>
          </div>
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
                Purchase (CAPI)
              </span>
              <span className="text-[10px] text-slate-500">Meta + TikTok (Deduplicated ⚡)</span>
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
