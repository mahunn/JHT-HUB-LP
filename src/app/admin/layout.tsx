'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  PhoneCall,
  Sliders,
  Settings,
  ExternalLink,
  LogOut,
  Lock,
  User,
  Eye,
  EyeOff,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  Zap,
  KeyRound,
  RotateCcw,
} from 'lucide-react';

const AUTH_COOKIE = 'admin_session';
const STORAGE_AUTH = 'jht_admin_auth';
const STORAGE_DEVICE = 'jht_admin_device_remember';
const STORAGE_USER = 'jht_admin_remembered_user';
const STORAGE_PASS = 'jht_admin_remembered_pass';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState<string>('admin1');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [rememberDevice, setRememberDevice] = useState<boolean>(true);
  const [hasSavedCredentials, setHasSavedCredentials] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [abandonedLeadsCount, setAbandonedLeadsCount] = useState<number>(0);

  // 1. Initial Device & Session Check (Runs once on mount)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check all persistent indicators
    const hasCookie = document.cookie.includes(`${AUTH_COOKIE}=authenticated`);
    const hasLocalAuth = localStorage.getItem(STORAGE_AUTH) === '1';
    const hasDeviceRemember = localStorage.getItem(STORAGE_DEVICE) === 'true';

    // Retrieve saved credentials if previously saved on this device
    const savedUser = localStorage.getItem(STORAGE_USER);
    const savedPass = localStorage.getItem(STORAGE_PASS);

    if (savedUser) {
      setUsernameInput(savedUser);
    }
    if (savedPass) {
      setPasswordInput(savedPass);
    }
    if (savedUser && savedPass) {
      setHasSavedCredentials(true);
    }

    // If user is already authenticated on this device, keep them logged in permanently!
    if (hasCookie || hasLocalAuth || hasDeviceRemember) {
      setIsAuthenticated(true);

      // Re-assert both long-lived cookie (10 years) and localStorage
      document.cookie = `${AUTH_COOKIE}=authenticated; path=/; max-age=315360000; SameSite=Lax`;
      localStorage.setItem(STORAGE_AUTH, '1');
      localStorage.setItem(STORAGE_DEVICE, 'true');

      setCheckingAuth(false);
      return;
    }

    setCheckingAuth(false);
  }, []);

  // 2. Fetch leads count for sidebar badge when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/leads')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.leads) {
            const count = data.leads.filter((l: any) => l.status === 'abandoned').length;
            setAbandonedLeadsCount(count);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, pathname]);

  // 3. Handle Login
  const handleLogin = async (e?: React.FormEvent, customUser?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

    const userToSubmit = (customUser ?? usernameInput).trim();
    const passToSubmit = (customPass ?? passwordInput).trim();

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userToSubmit,
          password: passToSubmit,
        }),
      });
      const data = await res.json();

      if (data.success) {
        // Set permanent 10-year session cookie
        document.cookie = `${AUTH_COOKIE}=authenticated; path=/; max-age=315360000; SameSite=Lax`;

        // Remember login on this device permanently
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_AUTH, '1');
          if (rememberDevice) {
            localStorage.setItem(STORAGE_DEVICE, 'true');
            localStorage.setItem(STORAGE_USER, userToSubmit);
            localStorage.setItem(STORAGE_PASS, passToSubmit);
            setHasSavedCredentials(true);
          } else {
            localStorage.setItem(STORAGE_USER, userToSubmit);
          }
        }

        setIsAuthenticated(true);
        router.refresh();
      } else {
        setAuthError(data.error || 'ভুল ইউজারনেম অথবা পাসওয়ার্ড! অনুগ্রহ করে আবার চেষ্টা করুন।');
      }
    } catch (err: any) {
      setAuthError('সার্ভারে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Handle Logout
  const handleLogout = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_AUTH);
        localStorage.removeItem(STORAGE_DEVICE);
      }
      document.cookie = `${AUTH_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(false);
    router.refresh();
  };

  // 5. Fill default credentials helper
  const handleFillDefault = () => {
    setUsernameInput('admin1');
    setPasswordInput('adminjhthub1');
    setAuthError('');
  };

  // 6. Clear saved credentials on device
  const handleClearSaved = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_USER);
      localStorage.removeItem(STORAGE_PASS);
      localStorage.removeItem(STORAGE_DEVICE);
      setHasSavedCredentials(false);
      setPasswordInput('');
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-3">
        <div className="animate-spin w-9 h-9 border-4 border-emerald-500 border-t-transparent rounded-full" />
        <span className="text-xs text-slate-400 font-medium">অ্যাডমিন যাচাই করা হচ্ছে...</span>
      </div>
    );
  }

  // Lock screen if not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-white">
          <div className="w-16 h-16 relative mx-auto mb-3 bg-white/10 rounded-2xl p-2 border border-white/10 flex items-center justify-center shadow-inner">
            <Image
              src="/logo.png"
              alt="JHT HUB Logo"
              width={56}
              height={56}
              className="object-contain"
            />
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-white tracking-wide">JHT HUB অ্যাডমিন প্যানেল</h2>
            <p className="text-xs text-slate-400 mt-1">কন্ট্রোল প্যানেলে প্রবেশ করতে লগইন করুন</p>
          </div>

          {/* Quick 1-Click Login Card (if credentials remembered on this device) */}
          {hasSavedCredentials && (
            <div className="mb-5 p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl">
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">এই ডিভাইসে তথ্য সংরক্ষিত আছে</p>
                    <p className="text-[11px] text-emerald-400 font-medium">ইউজার: {usernameInput}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClearSaved}
                  title="সংরক্ষিত তথ্য মুছুন"
                  className="text-[10px] text-slate-400 hover:text-red-400 transition-colors"
                >
                  মুছুন
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleLogin(undefined, usernameInput, passwordInput)}
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>প্রবেশ করা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>এক ক্লিকে সরাসরি প্রবেশ করুন</span>
                  </>
                )}
              </button>
            </div>
          )}

          <form id="admin-login-form" autoComplete="on" onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-username" className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>ইউজারনেম</span>
              </label>
              <div className="relative">
                <input
                  id="admin-username"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="admin1"
                  className="w-full px-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="admin-password" className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>পাসওয়ার্ড</span>
                </label>
                <button
                  type="button"
                  onClick={handleFillDefault}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>ডিফল্ট তথ্য বসান</span>
                </button>
              </div>
              <div className="relative">
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 pr-11 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 bg-slate-800 border-slate-700 focus:ring-emerald-500 focus:ring-offset-slate-900 rounded"
                />
                <span className="text-xs text-slate-300 font-medium">এই ডিভাইসে সবসময় মনে রাখুন</span>
              </label>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-full font-semibold">
                ১০ বছর স্থায়ী
              </span>
            </div>

            {authError && (
              <div className="text-xs text-red-400 bg-red-950/60 border border-red-800/60 p-3 rounded-xl text-center font-medium">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] disabled:opacity-70 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-950/50 transition-all text-sm flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>যাচাই করা হচ্ছে...</span>
                </>
              ) : (
                <span>লগইন করুন</span>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'ড্যাশবোর্ড (Overview)', href: '/admin', icon: LayoutDashboard },
    { label: 'অর্ডারসমূহ (Orders)', href: '/admin/orders', icon: ShoppingCart },
    {
      label: 'অসম্পূর্ণ লিড (Leads)',
      href: '/admin/leads',
      icon: PhoneCall,
      badge: abandonedLeadsCount > 0 ? abandonedLeadsCount : undefined,
    },
    { label: 'ল্যান্ডিং পেইজ এডিটর', href: '/admin/product', icon: Sliders },
    { label: 'সেটিংস ও পিক্সেল', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5 font-bold text-lg">
          <div className="w-8 h-8 relative rounded-lg overflow-hidden bg-white/10 p-0.5">
            <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-contain" />
          </div>
          <span>JHT HUB Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col justify-between p-4 shadow-xl z-30`}
      >
        <div>
          {/* Logo / Header */}
          <div className="hidden md:flex items-center gap-3 px-3 py-4 border-b border-slate-800 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/10 p-1 flex items-center justify-center shadow border border-white/10">
              <Image
                src="/logo.png"
                alt="JHT HUB"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="font-extrabold text-base leading-none text-white tracking-wide">JHT HUB</h1>
              <span className="text-[11px] text-emerald-400 font-medium">অ্যাডমিন কন্ট্রোল প্যানেল</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="bg-red-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              <span>লাইভ ওয়েবসাইট দেখুন</span>
            </span>
            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded">
              Live
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/40 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>লগআউট করুন</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
