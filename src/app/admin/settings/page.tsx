'use client';

import { useState, useEffect } from 'react';
import {
  Save,
  Settings,
  Phone,
  MessageCircle,
  Share2,
  Lock,
  CheckCircle2,
  Bell,
  Code,
  Loader2,
} from 'lucide-react';
import { StoreSettings } from '@/types/landing';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // PIN change state
  const [newPin, setNewPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        setNewPin(data.settings.adminPin || 'admin123');
        setConfirmPin(data.settings.adminPin || 'admin123');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setPinError('');
    if (newPin && newPin !== confirmPin) {
      setPinError('নতুন পিন এবং নিশ্চিতকরণ পিন মিলছে না!');
      return;
    }

    setSaving(true);
    setSaveSuccess(false);

    try {
      const updatedSettings: StoreSettings = {
        ...settings,
        adminPin: newPin || settings.adminPin,
      };

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      });

      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="p-8 text-center text-slate-500 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
        <span>লোড হচ্ছে...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">সেটিংস ও পিক্সেল ইন্টিগ্রেশন</h1>
          <p className="text-sm text-slate-500 font-medium">হটলাইন, সোশ্যাল লিংক, ট্র্যাকিং পিক্সেল ও অ্যাডমিন পাসওয়ার্ড</p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              সেভ হয়েছে!
            </span>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-sm transition-all shadow flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>সেটিংস সেভ করুন</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Contact & Hotline Settings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200 flex items-center gap-2">
            <Phone className="w-5 h-5 text-emerald-600" />
            <span>যোগাযোগ ও সাপোর্ট নাম্বার</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">স্টোরের নাম (Store Name)</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">হটলাইন কল নাম্বার (Hotline Phone)</label>
              <input
                type="text"
                placeholder="যেমন: 017XXXXXXXX"
                value={settings.hotlinePhone}
                onChange={(e) => setSettings({ ...settings, hotlinePhone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">হোয়াটসঅ্যাপ নাম্বার (WhatsApp Number)</label>
              <input
                type="text"
                placeholder="88017XXXXXXXX (কান্ট্রি কোড সহ)"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">মেসেঞ্জার লিংক / ফেসবুক পেইজ (ঐচ্ছিক)</label>
              <input
                type="text"
                placeholder="https://m.me/yourpage"
                value={settings.messengerUrl}
                onChange={(e) => setSettings({ ...settings, messengerUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200 flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            <span>টপ অ্যানাউন্সমেন্ট বার (Top Announcement Bar)</span>
          </h2>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.announcementActive}
                onChange={(e) => setSettings({ ...settings, announcementActive: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>অ্যানাউন্সমেন্ট বার চালু রাখুন</span>
            </label>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">অ্যানাউন্সমেন্ট টেক্সট</label>
              <input
                type="text"
                value={settings.announcementText}
                onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Marketing Pixels */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200 flex items-center gap-2">
            <Code className="w-5 h-5 text-emerald-600" />
            <span>ফেসবুক ও টিকটক পিক্সেল ট্র্যাকিং (Ad Tracking)</span>
          </h2>

          <p className="text-xs text-slate-500">
            শুধু আপনার পিক্সেল আইডি বসিয়ে দিন। PageView, InitiateCheckout এবং Purchase ইভেন্ট স্বয়ংক্রিয়ভাবে ট্র্যাক হবে।
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Facebook Meta Pixel ID</label>
              <input
                type="text"
                placeholder="যেমন: 1977860962709490"
                value={settings.metaPixelId}
                onChange={(e) => setSettings({ ...settings, metaPixelId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">TikTok Pixel ID</label>
              <input
                type="text"
                placeholder="যেমন: D66TJ0RC77U42FK00M0G"
                value={settings.tiktokPixelId}
                onChange={(e) => setSettings({ ...settings, tiktokPixelId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Admin PIN Security */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" />
            <span>অ্যাডমিন প্যানেল সিকিউরিটি পিন</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">নতুন পিন কোড (New PIN / Password)</label>
              <input
                type="password"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">পিন নিশ্চিত করুন (Confirm PIN)</label>
              <input
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {pinError && <div className="text-xs font-bold text-red-600">{pinError}</div>}
        </div>
      </form>
    </div>
  );
}
