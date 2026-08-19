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
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [abandonedLeadsCount, setAbandonedLeadsCount] = useState<number>(0);

  useEffect(() => {
    // Check if session cookie or persistent localStorage flag exists
    const hasCookie = typeof document !== 'undefined' && document.cookie.includes('admin_session=authenticated');
    const hasLocal = typeof window !== 'undefined' && localStorage.getItem('jht_admin_auth') === '1';

    if (hasCookie || hasLocal) {
      setIsAuthenticated(true);
      if (hasLocal && !hasCookie) {
        document.cookie = 'admin_session=authenticated; path=/; max-age=315360000; SameSite=Lax';
      }
      if (hasCookie && !hasLocal) {
        localStorage.setItem('jht_admin_auth', '1');
      }
    }
    setCheckingAuth(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch leads count for badge
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput.trim(),
          password: passwordInput.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('jht_admin_auth', '1');
        document.cookie = 'admin_session=authenticated; path=/; max-age=315360000; SameSite=Lax';
        setIsAuthenticated(true);
        router.refresh();
      } else {
        setAuthError(data.error || 'ভুল ইউজারনেম অথবা পাসওয়ার্ড! আবার চেষ্টা করুন।');
      }
    } catch (err: any) {
      setAuthError('সার্ভারে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('jht_admin_auth');
      document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(false);
    router.refresh();
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Lock screen if not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/95 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-white">
          <div className="w-20 h-20 relative mx-auto mb-4 bg-white/10 rounded-2xl p-2 border border-white/10 flex items-center justify-center shadow-inner">
            <Image
              src="/logo.png"
              alt="JHT HUB Logo"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-white tracking-wide">JHT HUB অ্যাডমিন প্যানেল</h2>
            <p className="text-xs text-slate-400 mt-1">কন্ট্রোল প্যানেলে প্রবেশ করতে লগইন করুন</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>ইউজারনেম</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  autoFocus
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>পাসওয়ার্ড</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 pr-11 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
