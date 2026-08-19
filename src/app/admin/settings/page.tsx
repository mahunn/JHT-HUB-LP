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

  // Admin Auth credentials state
  const [adminUsername, setAdminUsername] = useState<string>('admin1');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [authFormError, setAuthFormError] = useState<string>('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        setAdminUsername(data.settings.adminUsername || 'admin1');
        const pass = data.settings.adminPassword || data.settings.adminPin || 'adminjhthub1';
        setNewPassword(pass);
        setConfirmPassword(pass);
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

    setAuthFormError('');
    if (newPassword && newPassword !== confirmPassword) {
      setAuthFormError('নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না!');
      return;
    }
    if (!adminUsername.trim()) {
      setAuthFormError('ইউজারনেম খালি রাখা যাবে না!');
      return;
    }

    setSaving(true);
    setSaveSuccess(false);

    try {
      const updatedSettings: StoreSettings = {
        ...settings,
        adminUsername: adminUsername.trim(),
        adminPassword: newPassword || settings.adminPassword || 'adminjhthub1',
        adminPin: newPassword || settings.adminPin || 'adminjhthub1',
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
        {/* Contact & Social Settings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200 flex items-center gap-2">
            <Phone className="w-5 h-5 text-emerald-600" />
            <span>যোগাযোগ ও সোশ্যাল মিডিয়া সেটিংস</span>
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
              <label className="block text-xs font-bold text-slate-700 mb-1">সরাসরি কল হটলাইন নম্বর</label>
              <input
                type="text"
                value={settings.hotlinePhone}
                onChange={(e) => setSettings({ ...settings, hotlinePhone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">হোয়াটসঅ্যাপ নম্বর (Country code সহ)</label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ফেসবুক মেসেঞ্জার লিংক / ইউজারনেম</label>
              <input
                type="text"
                value={settings.messengerUrl}
                onChange={(e) => setSettings({ ...settings, messengerUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">ফেসবুক পেজ URL</label>
              <input
                type="text"
                value={settings.facebookPageUrl}
                onChange={(e) => setSettings({ ...settings, facebookPageUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200 flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            <span>ল্যান্ডিং পেইজ টপ অ্যানাউন্সমেন্ট বার (Header Announcement)</span>
          </h2>

          <div className="space-y-3">
            <label className="flex items-center gap-2.5 text-sm font-bold text-slate-800 cursor-pointer">
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
            আপনার পিক্সেল আইডি বসিয়ে দিন। PageView, InitiateCheckout এবং Purchase ইভেন্ট স্বয়ংক্রিয়ভাবে ট্র্যাক হবে।
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Facebook Meta Pixel ID</label>
              <input
                type="text"
                value={settings.metaPixelId}
                onChange={(e) => setSettings({ ...settings, metaPixelId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">TikTok Pixel ID</label>
              <input
                type="text"
                value={settings.tiktokPixelId}
                onChange={(e) => setSettings({ ...settings, tiktokPixelId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Admin Login Credentials */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" />
            <span>অ্যাডমিন প্যানেল লগইন ক্রেডেনশিয়াল</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ইউজারনেম (Username)</label>
              <input
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">নতুন পাসওয়ার্ড (New Password)</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">পাসওয়ার্ড নিশ্চিত করুন (Confirm)</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {authFormError && <div className="text-xs font-bold text-red-600">{authFormError}</div>}
        </div>
      </form>
    </div>
  );
}
