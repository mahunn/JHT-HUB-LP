'use client';

import { useState, useEffect } from 'react';
import {
  Phone,
  MessageCircle,
  Search,
  Filter,
  RefreshCw,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  UserCheck,
  Package,
  MapPin,
  Calendar,
  PhoneCall,
  Edit3,
  Check,
  X,
  ShoppingCart,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Lead, LeadStatus, ComboPackage } from '@/types/landing';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>('');
  const [convertingLead, setConvertingLead] = useState<Lead | null>(null);
  const [convertSubmitting, setConvertSubmitting] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
      }
    } catch (e) {
      console.error('Error loading leads', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
        showToast('লিডের স্ট্যাটাস পরিবর্তন করা হয়েছে!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRecordCall = async (lead: Lead) => {
    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'call' }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) =>
          prev.map((l) =>
            l.id === lead.id
              ? {
                  ...l,
                  callCount: (l.callCount || 0) + 1,
                  status: l.status === 'abandoned' ? 'contacted' : l.status,
                  lastContactedAt: new Date().toISOString(),
                }
              : l
          )
        );
        showToast(`📞 ${lead.phone} নাম্বারে কলের তথ্য রেকর্ড করা হয়েছে`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveNotes = async (id: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: noteText.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, notes: noteText.trim() } : l)));
        setEditingNoteId(null);
        showToast('নোট সফলভাবে সংরক্ষণ করা হয়েছে!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই লিডটি মুছে ফেলতে চান?')) return;

    try {
      const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        showToast('লিড মুছে ফেলা হয়েছে');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleConvertToOrder = async (lead: Lead) => {
    setConvertSubmitting(true);
    try {
      const payload = {
        customerName: lead.customerName || 'কাস্টমার (লিড থেকে)',
        phone: lead.phone,
        address: lead.address || 'ঠিকানা পরে যুক্ত করা হবে',
        cityZone: lead.cityZone || 'dhaka',
        selectedPackage: lead.selectedPackage || {
          id: 'combo-10',
          name: '10 Pcs Attar Combo',
          banglaName: 'আতর কম্বো (১০ পিস)',
          price: 490,
        },
        quantity: lead.quantity || 1,
        subtotal: (lead.selectedPackage?.price || 490) * (lead.quantity || 1),
        deliveryCharge: 0,
        total: (lead.selectedPackage?.price || 490) * (lead.quantity || 1),
        notes: `লিড #${lead.id} থেকে কনভার্ট করা অর্ডার। ${lead.notes || ''}`.trim(),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        // Update lead status to converted
        await handleStatusChange(lead.id, 'converted');
        setConvertingLead(null);
        showToast(`🎉 অভিনন্দন! অর্ডার তৈরি হয়েছে: #${data.order.id}`);
      } else {
        alert(data.error || 'অর্ডার তৈরিতে সমস্যা হয়েছে।');
      }
    } catch (e: any) {
      alert(e.message || 'সার্ভার সমস্যা');
    } finally {
      setConvertSubmitting(false);
    }
  };

  const exportToCSV = () => {
    if (leads.length === 0) return;

    const headers = ['Lead ID', 'Customer Name', 'Phone', 'Address', 'Zone', 'Package', 'Status', 'Call Count', 'Created Date', 'Notes'];
    const rows = leads.map((l) => [
      l.id,
      `"${(l.customerName || '').replace(/"/g, '""')}"`,
      l.phone,
      `"${(l.address || '').replace(/"/g, '""')}"`,
      l.cityZone || '',
      `"${l.selectedPackage?.banglaName || l.selectedPackage?.name || ''}"`,
      l.status,
      l.callCount || 0,
      new Date(l.createdAt).toLocaleString(),
      `"${(l.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `JHT_HUB_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered leads
  const filteredLeads = leads.filter((lead) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      lead.id.toLowerCase().includes(q) ||
      (lead.customerName && lead.customerName.toLowerCase().includes(q)) ||
      lead.phone.includes(q) ||
      (lead.address && lead.address.toLowerCase().includes(q)) ||
      (lead.selectedPackage && lead.selectedPackage.banglaName.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Counters
  const abandonedCount = leads.filter((l) => l.status === 'abandoned').length;
  const contactedCount = leads.filter((l) => l.status === 'contacted').length;
  const convertedCount = leads.filter((l) => l.status === 'converted').length;
  const lostCount = leads.filter((l) => l.status === 'lost' || l.status === 'fake').length;

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'abandoned':
        return (
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 font-bold px-2.5 py-1 rounded-full text-xs border border-red-200">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            কল প্রয়োজন (অসম্পূর্ণ)
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full text-xs border border-amber-200">
            <Clock className="w-3 h-3" />
            কল করা হয়েছে
          </span>
        );
      case 'converted':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-xs border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            অর্ডার সম্পন্ন (Converted)
          </span>
        );
      case 'lost':
        return <span className="bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded-full text-xs">ইন্টারেস্টেড না (Lost)</span>;
      case 'fake':
        return <span className="bg-rose-100 text-rose-800 font-bold px-2.5 py-1 rounded-full text-xs">ভুল / ফেক নাম্বার</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 font-bold px-2.5 py-1 rounded-full text-xs">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-emerald-500/30 flex items-center gap-2.5 text-sm font-semibold animate-in fade-in slide-in-from-top-3">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">অসম্পূর্ণ লিড ও কল লিস্ট</h1>
            <span className="bg-red-500 text-white font-black text-xs px-2 py-0.5 rounded-full">
              {abandonedCount} টি কল বাকি
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            যারা ফোন নাম্বার দিয়ে অর্ডার শেষ না করে চলে গেছেন, তাদের সরাসরি কল বা হোয়াটসঅ্যাপ করে কনফার্ম করুন।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLeads}
            disabled={loading}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors font-semibold text-xs flex items-center gap-1.5"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">রিফ্রেশ</span>
          </button>

          <button
            onClick={exportToCSV}
            disabled={leads.length === 0}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>এক্সপোর্ট (CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-xs font-bold opacity-80 uppercase tracking-wider block">মোট লিড</span>
          <span className="text-2xl font-black mt-1 block">{leads.length}</span>
        </button>

        <button
          onClick={() => setStatusFilter('abandoned')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'abandoned'
              ? 'bg-red-600 text-white border-red-600 shadow-md'
              : 'bg-white text-slate-800 border-slate-200 hover:border-red-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider block">কল প্রয়োজন</span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          </div>
          <span className="text-2xl font-black mt-1 block text-red-600">{abandonedCount}</span>
        </button>

        <button
          onClick={() => setStatusFilter('contacted')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'contacted'
              ? 'bg-amber-600 text-white border-amber-600 shadow-md'
              : 'bg-white text-slate-800 border-slate-200 hover:border-amber-200'
          }`}
        >
          <span className="text-xs font-bold opacity-80 uppercase tracking-wider block">কথা বলা হয়েছে</span>
          <span className="text-2xl font-black mt-1 block text-amber-600">{contactedCount}</span>
        </button>

        <button
          onClick={() => setStatusFilter('converted')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'converted'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
              : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-200'
          }`}
        >
          <span className="text-xs font-bold opacity-80 uppercase tracking-wider block">অর্ডারে কনভার্ট</span>
          <span className="text-2xl font-black mt-1 block text-emerald-600">{convertedCount}</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="মোবাইল নাম্বার, নাম বা প্যাকেজ দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Status Dropdown Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">সব স্ট্যাটাস ({leads.length})</option>
            <option value="abandoned">🔴 কল প্রয়োজন ({abandonedCount})</option>
            <option value="contacted">🟡 কল করা হয়েছে ({contactedCount})</option>
            <option value="converted">🟢 কনভার্ট হয়েছে ({convertedCount})</option>
            <option value="lost">⚪ হারিয়ে গেছে (Lost)</option>
            <option value="fake">🚫 ফেক / ভুল নাম্বার</option>
          </select>
        </div>
      </div>

      {/* Leads List / Cards */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-2" />
          <p className="font-semibold text-sm">লিড ডেটা লোড হচ্ছে...</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <PhoneCall className="w-6 h-6" />
          </div>
          <p className="font-bold text-base text-slate-800">কোনো লিড পাওয়া যায়নি</p>
          <p className="text-xs text-slate-400 mt-1">কাস্টমাররা চেকআউট ফর্মে নাম্বার দিলে এখানে স্বয়ংক্রিয়ভাবে জমা হবে।</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredLeads.map((lead) => {
            const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
            const whatsappNumber = cleanPhone.startsWith('88') ? cleanPhone : `88${cleanPhone}`;
            const pkgName = lead.selectedPackage?.banglaName || lead.selectedPackage?.name || 'আতর কম্বো';
            const price = lead.selectedPackage?.price || 490;
            const isEditingNote = editingNoteId === lead.id;

            const whatsappMessage = encodeURIComponent(
              `আসসালামু আলাইকুম ${lead.customerName || 'সম্মানিত গ্রাহক'}, আপনি JHT HUB থেকে "${pkgName}" অর্ডার করতে ফর্ম পূরণ শুরু করেছিলেন। আপনার অর্ডারটি কনফার্ম করতে কোনো তথ্যের প্রয়োজন হলে জানাতে পারেন। ডেলিভারি চার্জ সম্পূর্ণ ফ্রি!`
            );

            return (
              <div
                key={lead.id}
                className={`bg-white rounded-2xl border transition-all p-4 sm:p-5 shadow-sm hover:shadow-md ${
                  lead.status === 'abandoned' ? 'border-red-200 bg-red-50/10' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Customer Info */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">{lead.id}</span>
                      {getStatusBadge(lead.status)}
                      {lead.callCount && lead.callCount > 0 ? (
                        <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <PhoneCall className="w-3 h-3 text-slate-500" />
                          {lead.callCount} বার কল হয়েছে
                        </span>
                      ) : null}
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 ml-auto lg:ml-0">
                        <Calendar className="w-3 h-3" />
                        {new Date(lead.createdAt).toLocaleString('bn-BD', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {/* Name & Phone */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <h3 className="text-base font-extrabold text-slate-900">
                        {lead.customerName || <span className="text-slate-400 italic font-normal">নাম দেওয়া হয়নি</span>}
                      </h3>
                      <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 font-mono font-bold text-sm px-2.5 py-1 rounded-lg border border-emerald-200">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{lead.phone}</span>
                      </div>
                    </div>

                    {/* Address & Package Info */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-0.5">
                      {lead.address && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>{lead.address}</span>
                          {lead.cityZone === 'dhaka' && <span className="text-[10px] bg-slate-100 px-1 rounded">(ঢাকা)</span>}
                          {lead.cityZone === 'outside' && <span className="text-[10px] bg-slate-100 px-1 rounded">(ঢাকার বাইরে)</span>}
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-slate-700 font-medium">
                        <Package className="w-3.5 h-3.5 text-emerald-600" />
                        <span>পছন্দকৃত প্যাকেজ: <strong>{pkgName}</strong></span>
                        <span className="text-emerald-700 font-bold ml-1">৳{price * (lead.quantity || 1)}</span>
                      </div>
                    </div>

                    {/* Note Box */}
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      {isEditingNote ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="text"
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="যেমন: কাল বিকালে কল করতে বলল, কনফার্ম করবে..."
                            className="flex-1 text-xs px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveNotes(lead.id)}
                            className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            title="সংরক্ষণ"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingNoteId(null)}
                            className="p-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                            title="বাতিল"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <div className="text-slate-500 flex items-center gap-1.5 italic">
                            <span className="font-semibold text-slate-600 not-italic">নোট:</span>
                            {lead.notes ? (
                              <span className="text-slate-700 font-medium">{lead.notes}</span>
                            ) : (
                              <span className="text-slate-400">কোনো মন্তব্য লেখা নেই</span>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              setEditingNoteId(lead.id);
                              setNoteText(lead.notes || '');
                            }}
                            className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-0.5 hover:underline flex-shrink-0"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>{lead.notes ? 'এডিট' : '+ নোট যোগ করুন'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Quick Action Buttons */}
                  <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {/* Direct Call Button */}
                      <a
                        href={`tel:${lead.phone}`}
                        onClick={() => handleRecordCall(lead)}
                        className="flex-1 sm:flex-initial bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                        title="সরাসরি কল দিন"
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>সরাসরি কল দিন</span>
                      </a>

                      {/* WhatsApp Button */}
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleRecordCall(lead)}
                        className="flex-1 sm:flex-initial bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                        title="WhatsApp এ মেসেজ দিন"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                    <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                      {/* Quick Convert to Order */}
                      {lead.status !== 'converted' && (
                        <button
                          onClick={() => handleConvertToOrder(lead)}
                          disabled={convertSubmitting}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                          title="অর্ডার তৈরি করুন"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 text-blue-600" />
                          <span>অর্ডারে রূপান্তর</span>
                        </button>
                      )}

                      {/* Status Selector Dropdown */}
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                        className="text-xs bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 focus:outline-none"
                      >
                        <option value="abandoned">🔴 কল প্রয়োজন</option>
                        <option value="contacted">🟡 কল করা হয়েছে</option>
                        <option value="converted">🟢 অর্ডার সম্পন্ন</option>
                        <option value="lost">⚪ Lost</option>
                        <option value="fake">🚫 Fake / ভুল</option>
                      </select>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
