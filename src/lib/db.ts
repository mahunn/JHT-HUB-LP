import fs from 'fs';
import path from 'path';
import { DatabaseSchema, ProductData, StoreSettings, Order, Lead, LeadStatus } from '@/types/landing';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const DEFAULT_DB: DatabaseSchema = {
  product: {
    brandName: 'JHT HUB',
    productName: 'প্রিমিয়াম ১০ পিস আতর কম্বো',
    headlinePre: 'মাত্র ৪৯০ টাকায় পাচ্ছেন',
    headlineHighlight: 'প্রিমিয়াম ১০ পিস আতর',
    headlinePost: '১০টি ভিন্ন ভিন্ন ফ্লেভারের আতর পাচ্ছেন',
    headlineSub: '১০০% অ্যালকোহল মুক্ত • লং লাস্টিং ১২+ ঘণ্টা • প্রিমিয়াম সুবাস',
    freeDeliveryHeadline: 'সাথে সারা বাংলাদেশ ডেলিভারি চার্জ ফ্রি',
    stockCount: 23,
    countdownHours: 12,
    mainBannerImage: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1000&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=1000&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1000&q=80'
    ],
    deliveryChargeDhaka: 0,
    deliveryChargeOutside: 0,
    freeDeliveryDhaka: true,
    freeDeliveryOutside: true,
    packages: [
      {
        id: 'combo-10',
        name: '10 Pcs Attar Combo',
        banglaName: 'আতর কম্বো (১০ পিস)',
        subtitle: 'প্রিমিয়াম ১০ পিস আতর পাচ্ছেন',
        quantity: 1,
        regularPrice: 990,
        offerPrice: 490,
        badge: 'Best Deal 🔥',
        isDefault: true,
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80'
      },
      {
        id: 'combo-5',
        name: '5 Pcs Trial Pack',
        banglaName: '৫ পিস ট্রায়াল প্যাক',
        subtitle: '৫টি সেরা ভিন্ন ফ্লেভারের আতর',
        quantity: 1,
        regularPrice: 550,
        offerPrice: 290,
        badge: 'জনপ্রিয়',
        isDefault: false,
        image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&q=80'
      },
      {
        id: 'combo-20',
        name: '20 Pcs Mega Box',
        banglaName: '২০ পিস স্পেশাল কম্বো',
        subtitle: 'সবগুলো ফ্লেভার ডাবল সেট + ফ্রি ডেলিভারি',
        quantity: 1,
        regularPrice: 1890,
        offerPrice: 890,
        badge: 'মেগা অফার 🎁',
        isDefault: false,
        image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80'
      }
    ],
    scents: [
      { id: 'sc-1', name: 'ইরানি বাখুর', category: 'arabian', notes: 'ঐতিহ্যবাহী মিষ্টি ও মোহনীয় বাখুর নোট' },
      { id: 'sc-2', name: 'সুলতান', category: 'arabian', notes: 'রাজকীয় স্পাইসি ও উডি সুবাস' },
      { id: 'sc-3', name: 'এহেসাস আল আরাবিয়া', category: 'arabian', notes: 'মন জুড়ানো মিষ্টি এরাবিয়ান ব্লেন্ড' },
      { id: 'sc-4', name: 'বাকারাত রোজ', category: 'arabian', notes: 'অপূর্ব ফ্রেশ রোজ ও অ্যাম্বার ফিল' },
      { id: 'sc-5', name: 'আমীর আল উদ', category: 'arabian', notes: 'গাঢ় ও নিখাদ আভিজাত্যের উদ সুবাস' },
      { id: 'sc-6', name: 'ভ্যাম্পায়ার ব্লাড', category: 'perfume', notes: 'অত্যন্ত আকর্ষণীয় ও আধুনিক সিগনেচার সুবাস' },
      { id: 'sc-7', name: 'ক্রিড এভেন্টাস', category: 'perfume', notes: 'বিশ্বখ্যাত ফ্রেশ ফ্রুটি ও স্মোকি পারফিউম নোট' },
      { id: 'sc-8', name: 'কুল ওয়াটার', category: 'perfume', notes: 'তীব্র সতেজ অ্যাকোয়াটিক ফ্রেশনেস' },
      { id: 'sc-9', name: 'ডানহিল আইকন', category: 'perfume', notes: 'ক্লাসিক জেন্টলম্যান রিচ ফ্লেভার' },
      { id: 'sc-10', name: 'ওয়াই এস এল ল্যাকো', category: 'perfume', notes: 'স্পোর্টি, ভাইব্র্যান্ট ও আকর্ষণীয়' }
    ],
    features: [],
    trustBadges: [
      { id: 'tb-1', title: 'অগ্রিম কোনো টাকা লাগছে না', description: 'ফুল ক্যাশ অন ডেলিভারিতে নিতে পারবেন। পণ্য পেয়ে মূল্য দিন।', iconName: 'Banknote' },
      { id: 'tb-2', title: 'চেক করে নেওয়ার শতভাগ সুবিধা', description: 'ডেলিভারি ম্যানের সামনে চেক করে দেখুন। পছন্দ না হলে রিটার্ন করে দিন।', iconName: 'CheckCircle2' },
      { id: 'tb-3', title: '৭ দিনের সহজ রিটার্ন পলিসি', description: 'প্রোডাক্ট রিসিভ করার ৭ দিন পরও রিটার্ন করতে পারবেন।', iconName: 'RotateCcw' },
      { id: 'tb-4', title: 'ফ্রি হোম ডেলিভারি', description: '১০ পিছ আতর কম্বোর সাথে সারা বাংলাদেশ ডেলিভারি চার্জ সম্পূর্ণ ফ্রি।', iconName: 'Truck' }
    ],
    reviews: [],
    faqList: []
  },
  settings: {
    storeName: 'JHT HUB',
    hotlinePhone: '01522-133748',
    whatsappNumber: '8801522133748',
    messengerUrl: '',
    facebookPageUrl: '',
    metaPixelId: '',
    tiktokPixelId: '',
    adminPin: 'admin123',
    announcementText: '🎉 ধামাকা অফার: আজই অর্ডার করলে সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সম্পূর্ণ ফ্রি!',
    announcementActive: true
  },
  orders: [
    {
      id: 'HR-1001',
      customerName: 'মোঃ জাহিদ হাসান',
      phone: '01712345678',
      address: 'বাড়ি ১২, রোড ৪, ব্লক সি, বনশ্রী, ঢাকা',
      cityZone: 'dhaka',
      selectedPackage: {
        id: 'combo-10',
        name: '10 Pcs Attar Combo',
        banglaName: 'আতর কম্বো (১০ পিস)',
        price: 490
      },
      quantity: 1,
      subtotal: 490,
      deliveryCharge: 0,
      total: 490,
      notes: 'অফিসের ঠিকানায় ডেলিভারি দিবেন।',
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ],
  leads: [
    {
      id: 'LD-1001',
      customerName: 'তানভীর আহমেদ',
      phone: '01819876543',
      address: 'উত্তরা সেক্টর ৭, ঢাকা',
      cityZone: 'dhaka',
      selectedPackage: {
        id: 'combo-10',
        name: '10 Pcs Attar Combo',
        banglaName: 'আতর কম্বো (১০ পিস)',
        price: 490
      },
      quantity: 1,
      status: 'abandoned',
      notes: 'নাম্বার দেওয়ার পর ব্যাক করেছে, কল দিয়ে কনফার্ম করুন',
      callCount: 0,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
    }
  ]
};

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getDb(): DatabaseSchema {
  ensureDataDir();
  if (!fs.existsSync(DB_FILE)) {
    saveDb(DEFAULT_DB);
    return DEFAULT_DB;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return {
      product: { ...DEFAULT_DB.product, ...(data.product || {}) },
      settings: { ...DEFAULT_DB.settings, ...(data.settings || {}) },
      orders: data.orders || [],
      leads: data.leads || []
    };
  } catch (error) {
    console.error('Error reading db.json, returning default DB', error);
    return DEFAULT_DB;
  }
}

export function saveDb(data: DatabaseSchema): void {
  ensureDataDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export function getProductData(): ProductData {
  return getDb().product;
}

export function updateProductData(product: Partial<ProductData>): ProductData {
  const db = getDb();
  db.product = { ...db.product, ...product };
  saveDb(db);
  return db.product;
}

export function getSettings(): StoreSettings {
  return getDb().settings;
}

export function updateSettings(settings: Partial<StoreSettings>): StoreSettings {
  const db = getDb();
  db.settings = { ...db.settings, ...settings };
  saveDb(db);
  return db.settings;
}

// ----------------- ORDERS -----------------

export function getOrders(): Order[] {
  return getDb().orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getOrderById(id: string): Order | undefined {
  return getDb().orders.find((o) => o.id === id);
}

export function createOrder(orderInput: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Order {
  const db = getDb();
  const nextNum = 1000 + db.orders.length + 1;
  const newOrder: Order = {
    ...orderInput,
    id: `HR-${nextNum}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.orders.unshift(newOrder);

  // Automatically update any matching lead to 'converted'
  const cleanPhone = orderInput.phone.replace(/[^0-9]/g, '');
  db.leads = db.leads || [];
  db.leads.forEach((l) => {
    const leadCleanPhone = l.phone.replace(/[^0-9]/g, '');
    if (leadCleanPhone === cleanPhone || (leadCleanPhone.slice(-10) === cleanPhone.slice(-10) && cleanPhone.length >= 10)) {
      l.status = 'converted';
      l.notes = (l.notes ? l.notes + ' | ' : '') + `অর্ডার কনফার্মড (#${newOrder.id})`;
      l.updatedAt = new Date().toISOString();
    }
  });

  saveDb(db);
  return newOrder;
}

export function updateOrderStatus(id: string, status: Order['status']): Order | null {
  const db = getDb();
  const index = db.orders.findIndex((o) => o.id === id);
  if (index === -1) return null;
  db.orders[index].status = status;
  db.orders[index].updatedAt = new Date().toISOString();
  saveDb(db);
  return db.orders[index];
}

export function deleteOrder(id: string): boolean {
  const db = getDb();
  const initialLength = db.orders.length;
  db.orders = db.orders.filter((o) => o.id !== id);
  if (db.orders.length !== initialLength) {
    saveDb(db);
    return true;
  }
  return false;
}

// ----------------- LEADS (Abandoned / Incomplete Checkouts) -----------------

export function getLeads(): Lead[] {
  const db = getDb();
  return (db.leads || []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getLeadById(id: string): Lead | undefined {
  const db = getDb();
  return (db.leads || []).find((l) => l.id === id);
}

export function createOrUpdateLead(leadInput: {
  phone: string;
  customerName?: string;
  address?: string;
  cityZone?: 'dhaka' | 'outside';
  selectedPackage?: {
    id: string;
    name: string;
    banglaName: string;
    price: number;
  };
  quantity?: number;
  source?: string;
  notes?: string;
}): { lead: Lead; isNew: boolean } {
  const db = getDb();
  db.leads = db.leads || [];

  const cleanPhone = (leadInput.phone || '').replace(/[^0-9]/g, '');
  if (!cleanPhone || cleanPhone.length < 10) {
    throw new Error('Valid phone number with at least 10 digits is required');
  }

  // Check if customer already placed an order recently with this phone
  const existingOrder = db.orders.find(
    (o) => o.phone.replace(/[^0-9]/g, '') === cleanPhone || o.phone.replace(/[^0-9]/g, '').slice(-10) === cleanPhone.slice(-10)
  );

  // Check for existing lead with same phone
  const existingIndex = db.leads.findIndex((l) => {
    const p = l.phone.replace(/[^0-9]/g, '');
    return p === cleanPhone || (p.length >= 10 && p.slice(-10) === cleanPhone.slice(-10));
  });

  if (existingIndex !== -1) {
    const existing = db.leads[existingIndex];
    const updated: Lead = {
      ...existing,
      customerName: leadInput.customerName?.trim() || existing.customerName,
      address: leadInput.address?.trim() || existing.address,
      cityZone: leadInput.cityZone || existing.cityZone,
      selectedPackage: leadInput.selectedPackage || existing.selectedPackage,
      quantity: leadInput.quantity || existing.quantity || 1,
      source: leadInput.source || existing.source || 'checkout_form',
      notes: leadInput.notes || existing.notes,
      status: existingOrder ? 'converted' : existing.status,
      updatedAt: new Date().toISOString()
    };
    db.leads[existingIndex] = updated;
    saveDb(db);
    return { lead: updated, isNew: false };
  }

  const nextNum = 1000 + db.leads.length + 1;
  const newLead: Lead = {
    id: `LD-${nextNum}`,
    phone: cleanPhone,
    customerName: leadInput.customerName?.trim() || '',
    address: leadInput.address?.trim() || '',
    cityZone: leadInput.cityZone,
    selectedPackage: leadInput.selectedPackage,
    quantity: leadInput.quantity || 1,
    status: existingOrder ? 'converted' : 'abandoned',
    notes: leadInput.notes || '',
    callCount: 0,
    source: leadInput.source || 'checkout_form',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.leads.unshift(newLead);
  saveDb(db);
  return { lead: newLead, isNew: true };
}

export function updateLead(
  id: string,
  updates: Partial<Pick<Lead, 'status' | 'notes' | 'callCount' | 'customerName' | 'address' | 'cityZone'>>
): Lead | null {
  const db = getDb();
  db.leads = db.leads || [];
  const index = db.leads.findIndex((l) => l.id === id);
  if (index === -1) return null;

  db.leads[index] = {
    ...db.leads[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  saveDb(db);
  return db.leads[index];
}

export function recordLeadCall(id: string, notes?: string): Lead | null {
  const db = getDb();
  db.leads = db.leads || [];
  const index = db.leads.findIndex((l) => l.id === id);
  if (index === -1) return null;

  const current = db.leads[index];
  const newCallCount = (current.callCount || 0) + 1;
  
  db.leads[index] = {
    ...current,
    callCount: newCallCount,
    lastContactedAt: new Date().toISOString(),
    status: current.status === 'abandoned' ? 'contacted' : current.status,
    notes: notes !== undefined ? notes : current.notes,
    updatedAt: new Date().toISOString()
  };
  saveDb(db);
  return db.leads[index];
}

export function deleteLead(id: string): boolean {
  const db = getDb();
  db.leads = db.leads || [];
  const initialLength = db.leads.length;
  db.leads = db.leads.filter((l) => l.id !== id);
  if (db.leads.length !== initialLength) {
    saveDb(db);
    return true;
  }
  return false;
}
