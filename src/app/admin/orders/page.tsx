'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Phone,
  MessageCircle,
  Trash2,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Filter,
  RefreshCw,
  Printer,
  X,
} from 'lucide-react';
import { Order, OrderStatus } from '@/types/landing';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই অর্ডারটি মুছে ফেলতে চান?')) return;

    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.filter((o) => o.id !== id));
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder(null);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const exportToCSV = () => {
    if (orders.length === 0) return;

    const headers = ['Order ID', 'Customer Name', 'Phone', 'Address', 'Zone', 'Package', 'Qty', 'Subtotal', 'Delivery', 'Total', 'Status', 'Date', 'Notes'];
    const rows = orders.map((o) => [
      o.id,
      `"${o.customerName.replace(/"/g, '""')}"`,
      o.phone,
      `"${o.address.replace(/"/g, '""')}"`,
      o.cityZone,
      `"${o.selectedPackage?.banglaName || o.selectedPackage?.name}"`,
      o.quantity,
      o.subtotal,
      o.deliveryCharge,
      o.total,
      o.status,
      new Date(o.createdAt).toLocaleString(),
      `"${(o.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter and Search Logic
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      order.id.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.phone.includes(query) ||
      order.address.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

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
    <div className="space-y-6">
      {/* Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">অর্ডার ব্যবস্থাপনা</h1>
          <p className="text-sm text-slate-500 font-medium">সব অর্ডারের তালিকা, স্ট্যাটাস পরিবর্তন ও কাস্টমার যোগাযোগ</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold p-2.5 rounded-xl transition-colors"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={exportToCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>এক্সেল / CSV এক্সপোর্ট</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="অর্ডার আইডি, কাস্টমার নাম, ফোন নাম্বার বা ঠিকানা দিয়ে খুঁজুন..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'সব অর্ডার' },
              { id: 'pending', label: 'পেন্ডিং' },
              { id: 'confirmed', label: 'কনফার্মড' },
              { id: 'shipped', label: 'কুরিয়ারে' },
              { id: 'delivered', label: 'ডেলিভার্ড' },
              { id: 'cancelled', label: 'বাতিল' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                  statusFilter === tab.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="p-4">অর্ডার আইডি</th>
                <th className="p-4">তারিখ ও সময়</th>
                <th className="p-4">গ্রাহকের নাম ও ফোন</th>
                <th className="p-4">ঠিকানা</th>
                <th className="p-4">প্যাকেজ</th>
                <th className="p-4">মোট বিল</th>
                <th className="p-4">স্ট্যাটাস</th>
                <th className="p-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Order ID */}
                  <td className="p-4 font-mono font-extrabold text-emerald-700">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="hover:underline flex items-center gap-1"
                    >
                      <span>{order.id}</span>
                    </button>
                  </td>

                  {/* Date */}
                  <td className="p-4 text-xs text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString('bn-BD', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                    <div className="text-[11px] text-slate-400">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>

                  {/* Customer Info */}
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{order.customerName}</div>
                    <div className="font-mono text-xs text-slate-600">{order.phone}</div>
                  </td>

                  {/* Address */}
                  <td className="p-4 max-w-[200px]">
                    <div className="text-xs text-slate-700 truncate" title={order.address}>
                      {order.address}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">
                      {order.cityZone === 'dhaka' ? 'ঢাকা সিটি' : 'ঢাকার বাইরে'}
                    </span>
                  </td>

                  {/* Package */}
                  <td className="p-4 font-medium text-slate-800">
                    <div>{order.selectedPackage?.banglaName}</div>
                    <div className="text-xs text-slate-400">পরিমাণ: {order.quantity} টি</div>
                  </td>

                  {/* Total */}
                  <td className="p-4 font-mono font-extrabold text-emerald-700 text-base">
                    ৳{order.total}
                  </td>

                  {/* Status Dropdown */}
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${
                        order.status === 'pending'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : order.status === 'confirmed'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : order.status === 'shipped'
                          ? 'bg-purple-50 text-purple-800 border-purple-300'
                          : order.status === 'delivered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-red-50 text-red-800 border-red-300'
                      }`}
                    >
                      <option value="pending">পেন্ডিং</option>
                      <option value="confirmed">কনফার্মড</option>
                      <option value="shipped">কুরিয়ারে পাঠানো</option>
                      <option value="delivered">ডেলিভার্ড</option>
                      <option value="cancelled">বাতিল</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Direct Call */}
                      <a
                        href={`tel:${order.phone}`}
                        title="সরাসরি কল দিন"
                        className="p-2 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-700 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                      </a>

                      {/* WhatsApp Message */}
                      <a
                        href={`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `আসসালামু আলাইকুম ${order.customerName},\nহালাল রেমিডি থেকে আপনার আতর কম্বো অর্ডারটির জন্য যোগাযোগ করছি।\nঅর্ডার আইডি: ${order.id}\nপ্যাকেজ: ${order.selectedPackage?.banglaName} (×${order.quantity})\nমোট মূল্য: ৳${order.total}\nঠিকানা: ${order.address}\n\nআপনার অর্ডারটি কি কনফার্ম করব?`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="হোয়াটসঅ্যাপে মেসেজ পাঠান"
                        className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>

                      {/* View Modal */}
                      <button
                        onClick={() => setSelectedOrder(order)}
                        title="রিসিট ও বিস্তারিত দেখুন"
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(order.id)}
                        title="মুছে ফেলুন"
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-slate-400 font-medium">
                    কোনো অর্ডার পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Receipt Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-scaleIn">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-4 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">ইনভয়েস রিসিট</span>
              <h3 className="text-2xl font-extrabold text-slate-900 font-mono mt-1">{selectedOrder.id}</h3>
              <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
            </div>

            <div className="py-4 space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>অর্ডারের সময়:</span>
                <span className="font-bold text-slate-900">
                  {new Date(selectedOrder.createdAt).toLocaleString('bn-BD')}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>গ্রাহকের নাম:</span>
                <span className="font-bold text-slate-900">{selectedOrder.customerName}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>মোবাইল নাম্বার:</span>
                <span className="font-mono font-bold text-slate-900">{selectedOrder.phone}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>সম্পূর্ণ ঠিকানা:</span>
                <span className="font-medium text-slate-900 text-right max-w-[260px]">
                  {selectedOrder.address}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>ডেলিভারি এরিয়া:</span>
                <span className="font-bold text-slate-900">
                  {selectedOrder.cityZone === 'dhaka' ? 'ঢাকা সিটির ভিতরে' : 'ঢাকা সিটির বাইরে'}
                </span>
              </div>

              {selectedOrder.notes && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                  <strong>কাস্টমার নোট:</strong> {selectedOrder.notes}
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 space-y-2">
                <div className="flex justify-between font-medium text-slate-700">
                  <span>
                    {selectedOrder.selectedPackage?.banglaName} (×{selectedOrder.quantity})
                  </span>
                  <span>৳{selectedOrder.subtotal}</span>
                </div>

                <div className="flex justify-between font-medium text-slate-700">
                  <span>ডেলিভারি চার্জ:</span>
                  <span>
                    {selectedOrder.deliveryCharge === 0 ? 'ফ্রি' : `৳${selectedOrder.deliveryCharge}`}
                  </span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>সর্বমোট প্রদেয়:</span>
                  <span className="text-emerald-700 font-mono text-xl">৳{selectedOrder.total}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center gap-2">
              <a
                href={`tel:${selectedOrder.phone}`}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-center text-sm flex items-center justify-center gap-1.5 shadow"
              >
                <Phone className="w-4 h-4" />
                <span>কল দিন</span>
              </a>

              <a
                href={`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `আসসালামু আলাইকুম ${selectedOrder.customerName}, আপনার অর্ডার (${selectedOrder.id}) কনফার্ম করার জন্য যোগাযোগ করছি।`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-xl text-center text-sm flex items-center justify-center gap-1.5 shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>হোয়াটসঅ্যাপ</span>
              </a>

              <button
                onClick={() => window.print()}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold p-2.5 rounded-xl transition-colors"
                title="প্রিন্ট করুন"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
