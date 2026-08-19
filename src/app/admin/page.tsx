'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  TrendingUp,
  ArrowUpRight,
  Phone,
  MessageCircle,
  Eye,
  Sliders,
  Settings,
  PhoneCall,
  UserCheck,
  AlertCircle,
  Package,
} from 'lucide-react';
import { Order, OrderStatus, Lead } from '@/types/landing';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      const [resOrders, resLeads] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/leads'),
      ]);
      const dataOrders = await resOrders.json();
      const dataLeads = await resLeads.json();

      if (dataOrders.success) {
        setOrders(dataOrders.orders);
      }
      if (dataLeads.success) {
        setLeads(dataLeads.leads);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, o) => acc + (o.status !== 'cancelled' ? o.total : 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const confirmedOrders = orders.filter((o) => o.status === 'confirmed').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;

  const abandonedLeads = leads.filter((l) => l.status === 'abandoned');
  const todayOrders = orders.filter((o) => {
    const orderDate = new Date(o.createdAt).toDateString();
    const today = new Date().toDateString();
    return orderDate === today;
  }).length;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full text-xs">নতুন / পেন্ডিং</span>;
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-full text-xs">কনফার্মড</span>;
      case 'shipped':
        return <span className="bg-purple-100 text-purple-800 font-bold px-2.5 py-1 rounded-full text-xs">কুরিয়ারে পাঠানো</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-xs">ডেলিভার্ড</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 font-bold px-2.5 py-1 rounded-full text-xs">বাতিল</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 font-bold px-2.5 py-1 rounded-full text-xs">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">JHT HUB ড্যাশবোর্ড</h1>
          <p className="text-sm text-slate-500 font-medium">রিয়েল-টাইম সেলস, অর্ডার ও অসম্পূর্ণ লিড ট্র্যাকার</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/leads"
            className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-1.5"
          >
            <PhoneCall className="w-4 h-4 text-red-600" />
            <span>কল লিস্ট ({abandonedLeads.length})</span>
          </Link>

          <Link
            href="/admin/orders"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-colors shadow flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>সব অর্ডার ({totalOrders})</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">মোট বিক্রয়</span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">৳{totalRevenue}</h3>
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              লাইভ সেলস
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">সর্বমোট অর্ডার</span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">{totalOrders}</h3>
            <span className="text-xs text-slate-500 font-medium">আজকে নতুন: {todayOrders} টি</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Abandoned Leads / Calls */}
        <Link
          href="/admin/leads"
          className="bg-white hover:bg-red-50/40 p-5 rounded-2xl border border-red-200 shadow-sm flex items-center justify-between transition-all group"
        >
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">কল প্রয়োজন (Leads)</span>
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            </div>
            <h3 className="text-2xl font-extrabold text-red-600 mt-1 font-mono">{abandonedLeads.length}</h3>
            <span className="text-xs text-red-700 font-medium group-hover:underline">দ্রুত কল দিন &rarr;</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <PhoneCall className="w-6 h-6" />
          </div>
        </Link>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">নতুন পেন্ডিং অর্ডার</span>
            <h3 className="text-2xl font-extrabold text-amber-600 mt-1 font-mono">{pendingOrders}</h3>
            <span className="text-xs text-amber-700 font-medium">কনফার্মেশন বাকি</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Abandoned Leads Alert Box (If any exist) */}
      {abandonedLeads.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 via-amber-50 to-orange-50 rounded-2xl border border-red-200 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  অসম্পূর্ণ গ্রাহক লিড ({abandonedLeads.length} টি বাকি)
                </h3>
                <p className="text-xs text-slate-600">
                  এই গ্রাহকরা নাম্বার দিয়ে অর্ডার শেষ করেননি। কল বা হোয়াটসঅ্যাপ করে অর্ডার নিশ্চিত করুন।
                </p>
              </div>
            </div>

            <Link
              href="/admin/leads"
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors shadow-sm self-start sm:self-auto"
            >
              সব লিড দেখুন ({leads.length})
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {abandonedLeads.slice(0, 3).map((lead) => {
              const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
              const whatsappNumber = cleanPhone.startsWith('88') ? cleanPhone : `88${cleanPhone}`;
              const pkg = lead.selectedPackage?.banglaName || '১০ পিস আতর কম্বো';

              return (
                <div
                  key={lead.id}
                  className="bg-white rounded-xl p-3.5 border border-red-200/80 shadow-xs flex flex-col justify-between gap-2.5"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-mono font-bold text-red-600">{lead.id}</span>
                      <span>{new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                      {lead.customerName || 'কাস্টমার (নামহীন)'}
                    </h4>
                    <p className="text-xs font-mono font-bold text-emerald-700 mt-0.5">{lead.phone}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-1">প্যাকেজ: {pkg}</p>
                  </div>

                  <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                    <a
                      href={`tel:${lead.phone}`}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>কল</span>
                    </a>
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                        `আসসালামু আলাইকুম ${lead.customerName || ''}, JHT HUB থেকে যোগাযোগ করছি। আপনার আতর কম্বো অর্ডারটি সম্পর্কে জানতে ফোন করা হয়েছিল।`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Access Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/product"
          className="bg-gradient-to-r from-emerald-700 to-green-800 text-white p-5 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-bold text-emerald-200 uppercase">কাস্টমাইজেশন</span>
            <h3 className="text-xl font-bold mt-1">ল্যান্ডিং পেইজ ও প্রোডাক্ট এডিটর</h3>
            <p className="text-xs text-emerald-100/90 mt-1">
              প্রোডাক্ট নাম, দাম, কম্বো প্যাকেজ, ছবি ও অফার পরিবর্তন করুন
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/10 group-hover:bg-white/20 text-white flex items-center justify-center transition-colors">
            <Sliders className="w-5 h-5" />
          </div>
        </Link>

        <Link
          href="/admin/settings"
          className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-5 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">মার্কেটিং ও সিকিউরিটি</span>
            <h3 className="text-xl font-bold mt-1">সেটিংস ও পিক্সেল ইন্টিগ্রেশন</h3>
            <p className="text-xs text-slate-300 mt-1">
              হটলাইন নাম্বার, ফেসবুক ও টিকটক পিক্সেল আইডি, অ্যাডমিন পিন
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/10 group-hover:bg-white/20 text-white flex items-center justify-center transition-colors">
            <Settings className="w-5 h-5" />
          </div>
        </Link>
      </div>

      {/* Recent Orders List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-slate-900 text-lg">সাম্প্রতিক অর্ডারসমূহ</h2>
            <p className="text-xs text-slate-500">সর্বশেষ গ্রাহকদের অর্ডারের তালিকা</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>সব দেখুন</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="p-4">অর্ডার আইডি</th>
                <th className="p-4">গ্রাহক</th>
                <th className="p-4">ফোন নাম্বার</th>
                <th className="p-4">প্যাকেজ</th>
                <th className="p-4">মূল্য</th>
                <th className="p-4">স্ট্যাটাস</th>
                <th className="p-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-bold text-emerald-700">{order.id}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{order.customerName}</div>
                    <div className="text-xs text-slate-400 truncate max-w-[180px]">{order.address}</div>
                  </td>
                  <td className="p-4 font-mono">{order.phone}</td>
                  <td className="p-4 font-medium text-slate-700">
                    {order.selectedPackage?.banglaName} (×{order.quantity})
                  </td>
                  <td className="p-4 font-mono font-extrabold text-slate-900">৳{order.total}</td>
                  <td className="p-4">{getStatusBadge(order.status)}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`tel:${order.phone}`}
                        title="সরাসরি কল দিন"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-700 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                      <a
                        href={`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `আসসালামু আলাইকুম ${order.customerName}, আপনার অর্ডারটি (${order.id} - ${order.selectedPackage?.banglaName}) কনফার্ম করার জন্য যোগাযোগ করছি।`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="হোয়াটসঅ্যাপে মেসেজ পাঠান"
                        className="p-1.5 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}

              {orders.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                    এখনও কোনো অর্ডার আসেনি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
