import fs from 'fs';
import path from 'path';
import { DatabaseSchema, ProductData, StoreSettings, Order, Lead, LeadStatus } from '@/types/landing';

const LOCAL_DATA_DIR = path.join(process.cwd(), 'data');
const LOCAL_DB_FILE = path.join(LOCAL_DATA_DIR, 'db.json');
const TMP_DB_FILE = path.join('/tmp', 'jht_db.json');

// In-memory cache for serverless environments
let memoryDb: DatabaseSchema | null = null;

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
      { id: 'sc-4', name: 'জান্নাতুল ফেরদৌস', category: 'arabian', notes: 'চিরচেনা ক্লাসিক জান্নাতুল ফেরদাউসের সুবাস' },
      { id: 'sc-5', name: 'আমির আল উদ', category: 'arabian', notes: 'গাঢ় ও দীর্ঘস্থায়ী প্রিমিয়াম উদ নোট' },
      { id: 'sc-6', name: 'সিলভার ড্রপ', category: 'perfume', notes: 'সতেজ ও ফ্রেশ অ্যাকোয়াটিক পারফিউম ফিল' },
      { id: 'sc-7', name: 'কুল ওয়াটার', category: 'perfume', notes: 'ঠাণ্ডা রিফ্রেশিং সামার স্পেশাল নোট' },
      { id: 'sc-8', name: 'হোয়াইট কস্তুরী', category: 'perfume', notes: 'নরম, মোলায়েম ও দীর্ঘস্থায়ী হোয়াইট মাস্ক' },
      { id: 'sc-9', name: 'চকলেট মাস্ক', category: 'perfume', notes: 'চকলেট ও ভ্যানিলার মিষ্টি মেলবন্ধন' },
      { id: 'sc-10', name: 'ডানহিল ডিজায়ার', category: 'perfume', notes: 'আধুনিক লাক্সারি সিগনেচার সুবাস' }
    ],
    features: [
      { id: 'ft-1', title: '১০০% অ্যালকোহল ও কেমিক্যাল মুক্ত', description: 'সম্পূর্ণ হালাল উপায়ে প্রাকৃতিক এসেন্স দিয়ে প্রস্তুতকৃত।' },
      { id: 'ft-2', title: '১২+ ঘণ্টা লং লাস্টিং সুবাস', description: 'কাপড়ে ব্যবহারে সারা দিনব্যাপী থাকবে চমৎকার সুবাস।' },
      { id: 'ft-3', title: '১০টি আকর্ষণীয় ফ্লেভার', description: 'এরাবিয়ান এবং আধুনিক পারফিউম টোনের সেরা কালেকশন।' },
      { id: 'ft-4', title: 'পকেট সাইজ ও সহজে বহনযোগ্য', description: '৩ মিলি রোলাক কাঁচের বোতল, পকেটে নিয়ে ঘুরতে সুবিধা।' }
    ],
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
    announcementText: '🎉 ধামাকা অফার: আজই অর্ডার করলে সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সম্পূর্ণ ফ্রি!',
    announcementActive: true
  },
  orders: [],
  leads: []
};

export function getDb(): DatabaseSchema {
  if (memoryDb) {
    return memoryDb;
  }

  // 1. Try reading from TMP_DB_FILE (serverless cache)
  try {
    if (fs.existsSync(TMP_DB_FILE)) {
      const raw = fs.readFileSync(TMP_DB_FILE, 'utf-8');
      const data = JSON.parse(raw);
      memoryDb = {
        product: { ...DEFAULT_DB.product, ...(data.product || {}) },
        settings: { ...DEFAULT_DB.settings, ...(data.settings || {}) },
        orders: data.orders || [],
        leads: data.leads || []
      };
      return memoryDb;
    }
  } catch (e) {
    // Ignore error
  }

  // 2. Try reading from LOCAL_DB_FILE (bundled db.json)
  try {
    if (fs.existsSync(LOCAL_DB_FILE)) {
      const raw = fs.readFileSync(LOCAL_DB_FILE, 'utf-8');
      const data = JSON.parse(raw);
      memoryDb = {
        product: { ...DEFAULT_DB.product, ...(data.product || {}) },
        settings: { ...DEFAULT_DB.settings, ...(data.settings || {}) },
        orders: data.orders || [],
        leads: data.leads || []
      };
      return memoryDb;
    }
  } catch (e) {
    // Ignore error
  }

  memoryDb = JSON.parse(JSON.stringify(DEFAULT_DB));
  return memoryDb!;
}

export function saveDb(data: DatabaseSchema): void {
  memoryDb = {
    product: { ...data.product },
    settings: { ...data.settings },
    orders: [...(data.orders || [])],
    leads: [...(data.leads || [])]
  };

  const payload = JSON.stringify(memoryDb, null, 2);

  // 1. Try saving to local data folder (dev environment)
  try {
    if (!fs.existsSync(LOCAL_DATA_DIR)) {
      fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DB_FILE, payload, 'utf-8');
  } catch (e) {
    // Expected on read-only serverless filesystem
  }

  // 2. Try saving to tmp storage (serverless environments)
  try {
    fs.writeFileSync(TMP_DB_FILE, payload, 'utf-8');
  } catch (e) {
    // Ignore error
  }
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

  // Automatically remove matching lead from leads list since order is now completed
  const cleanPhone = orderInput.phone.replace(/[^0-9]/g, '');
  db.leads = (db.leads || []).filter((l) => {
    const leadCleanPhone = l.phone.replace(/[^0-9]/g, '');
    const isMatch = leadCleanPhone === cleanPhone || (cleanPhone.length >= 10 && leadCleanPhone.slice(-10) === cleanPhone.slice(-10));
    return !isMatch;
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
  const targetId = (id || '').trim().toLowerCase();
  const initialLength = db.orders.length;
  db.orders = db.orders.filter((o) => (o.id || '').trim().toLowerCase() !== targetId);
  if (db.orders.length !== initialLength) {
    saveDb(db);
    return true;
  }
  return false;
}

// ----------------- LEADS (Abandoned / Incomplete Checkouts ONLY) -----------------

export function getLeads(): Lead[] {
  const db = getDb();
  const orderPhones = new Set(db.orders.map((o) => o.phone.replace(/[^0-9]/g, '').slice(-10)));
  return (db.leads || [])
    .filter((l) => {
      const leadPhone = l.phone.replace(/[^0-9]/g, '').slice(-10);
      return !orderPhones.has(leadPhone) && l.status !== 'converted';
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
}): { lead: Lead | null; isNew: boolean } {
  const db = getDb();
  db.leads = db.leads || [];

  const cleanPhone = (leadInput.phone || '').replace(/[^0-9]/g, '');
  if (!cleanPhone || cleanPhone.length < 10) {
    throw new Error('Valid phone number with at least 10 digits is required');
  }

  // Check if customer already placed an order with this phone - if so, do NOT create/keep a lead
  const hasCompletedOrder = db.orders.some((o) => {
    const orderPhone = o.phone.replace(/[^0-9]/g, '');
    return orderPhone === cleanPhone || (orderPhone.slice(-10) === cleanPhone.slice(-10) && cleanPhone.length >= 10);
  });

  if (hasCompletedOrder) {
    // Remove any existing lead with this phone number as they already have a completed order
    const initialLen = db.leads.length;
    db.leads = db.leads.filter((l) => {
      const p = l.phone.replace(/[^0-9]/g, '');
      return !(p === cleanPhone || (p.slice(-10) === cleanPhone.slice(-10) && cleanPhone.length >= 10));
    });
    if (db.leads.length !== initialLen) {
      saveDb(db);
    }
    return { lead: null, isNew: false };
  }

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
    status: 'abandoned',
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
  const targetId = (id || '').trim().toLowerCase();
  const initialLength = db.leads.length;
  db.leads = db.leads.filter((l) => (l.id || '').trim().toLowerCase() !== targetId);
  if (db.leads.length !== initialLength) {
    saveDb(db);
    return true;
  }
  return false;
}
