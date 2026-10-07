import fs from 'fs';
import path from 'path';
import { DatabaseSchema, ProductData, StoreSettings, Order, Lead, LeadStatus } from '@/types/landing';

const LOCAL_DATA_DIR = path.join(process.cwd(), 'data');
const LOCAL_DB_FILE = path.join(LOCAL_DATA_DIR, 'db.json');
const TMP_DB_FILE = path.join('/tmp', 'jht_db.json');

// In-memory cache for fast access
let memoryDb: DatabaseSchema | null = null;

// Cloud Sync Configuration (Supabase & Vercel KV / Upstash Redis)
function getSupabaseConfig() {
  const url = (
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    ''
  ).trim().replace(/\/+$/, '');

  const key = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ''
  ).trim();

  return url && key ? { url, key } : null;
}

function getKvConfig() {
  const url = (
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    ''
  ).trim().replace(/\/+$/, '');

  const token = (
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    ''
  ).trim();

  return url && token ? { url, token } : null;
}

const DEFAULT_DB: DatabaseSchema = {
  product: {
    brandName: 'JHT Food',
    productName: 'স্পেশাল ইলিশের আচার কম্বো ধামাকা অফার',
    headlinePre: '২০০ গ্রাম ইলিশের আচার অর্ডার করলেই',
    headlineHighlight: 'গরুর আচার ও চিংড়ি বালাচাও সম্পূর্ণ ফ্রি!',
    headlinePost: '১০০ গ্রাম গরুর মাংসের আচার + ১০০ গ্রাম চিংড়ি বালাচাও একদম ফ্রি 🎁',
    headlineSub: '১০০% খাঁটি সরিষার তেল • ঘরোয়া রেসিপি • কোনো কৃত্রিম কেমিক্যাল বা প্রিজারভেটিভ নেই',
    freeDeliveryHeadline: 'সারা বাংলাদেশে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি!',
    stockCount: 18,
    countdownHours: 10,
    mainBannerImage: '/images/combo_showcase_3items.jpg',
    galleryImages: [
      '/images/combo_showcase_3items.jpg',
      '/images/ilish_achar_real.jpg',
      '/images/gorur_achar_real.jpg',
      '/images/chingri_balachao_real.jpg'
    ],
    deliveryChargeDhaka: 0,
    deliveryChargeOutside: 0,
    freeDeliveryDhaka: true,
    freeDeliveryOutside: true,
    packages: [
      {
        id: 'combo-special',
        name: 'Ilish Achar Combo Pack (3 Items)',
        banglaName: 'স্পেশাল ৩-ইন-১ আচার কম্বো (মোট ৪০০ গ্রাম)',
        subtitle: 'ইলিশ আচার (২০০ গ্রাম) + গরুর আচার (১০০ গ্রাম ফ্রি) + চিংড়ি বালাচাও (১০০ গ্রাম ফ্রি)',
        quantity: 1,
        regularPrice: 1450,
        offerPrice: 799,
        badge: 'ধামাকা অফার 🔥',
        isDefault: true,
        image: '/images/combo_showcase_3items.jpg'
      }
    ],
    scents: [
      { id: 'item-1', name: 'ইলিশ মাছের স্পেশাল আচার (২০০ গ্রাম)', category: 'arabian', notes: 'তাজা পদ্মার ইলিশ, খাঁটি ঘানিভাঙা সরিষার তেল ও স্পেশাল মশলা' },
      { id: 'item-2', name: 'গরুর মাংসের চুক্কা আচার (১০০ গ্রাম ফ্রি)', category: 'arabian', notes: 'হাড় ছাড়া ফ্রেশ গরুর মাংস, তুলতুলে নরম ও মশলাদার চুক্কা স্বাদ' },
      { id: 'item-3', name: 'মচমচে চিংড়ি শুঁটকি বালাচাও (১০০ গ্রাম ফ্রি)', category: 'perfume', notes: 'ক্রিস্পি ভাজা পেঁয়াজ-রসুন ও খাঁটি মশলার মুখরোচক বালাচাও' }
    ],
    features: [
      { id: 'ft-1', title: '১০০% খাঁটি সরিষার তেলে জারণকৃত', description: 'কাঠের ঘানিভাঙা খাঁটি সরিষার তেল ও মশলা দিয়ে তৈরি, কোনো কেমিক্যাল নেই।', iconName: 'ShieldCheck' },
      { id: 'ft-2', title: 'ঘরোয়া ও স্বাস্থ্যসম্মত পরিবেশে প্রস্তুত', description: 'সম্পূর্ণ মায়ের হাতের ঘরোয়া স্বাদে পরম যত্নে ও হাইজিন মেইনটেইন করে তৈরি।', iconName: 'Heart' },
      { id: 'ft-3', title: 'গরম ভাত ও খিচুড়ির সাথে অতুলনীয়', description: 'গরম ধোঁয়া ওঠা ভাত, খিচুড়ি, পোলাও বা পরোটার সাথে অমৃত স্বাদ।', iconName: 'Sparkles' },
      { id: 'ft-4', title: '১০০ গ্রাম গরুর আচার + ১০০ গ্রাম বালাচাও ফ্রি', description: '২০০ গ্রাম ইলিশের আচার নিলেই পাচ্ছেন আরও ২টি সেরা আইটেম একদম ফ্রি।', iconName: 'Gift' }
    ],
    trustBadges: [
      { id: 'tb-1', title: 'ডেলিভারি চার্জ সম্পূর্ণ ফ্রি', description: 'সারা বাংলাদেশে ডেলিভারি চার্জ একদম ফ্রি (০ টাকা)।', iconName: 'Truck' },
      { id: 'tb-2', title: 'অগ্রিম ১ টাকাও দিতে হবে না', description: 'ফুল ক্যাশ অন ডেলিভারি। পণ্য হাতে বুঝে নিয়ে টাকা দিবেন।', iconName: 'Banknote' },
      { id: 'tb-3', title: 'খুলে দেখে নেওয়ার শতভাগ সুযোগ', description: 'ডেলিভারি ম্যানের সামনে পার্সেল খুলে দেখে চেক করে নেওয়ার সুযোগ।', iconName: 'CheckCircle2' },
      { id: 'tb-4', title: '১০০% খাঁটি ও সন্তুষ্টির গ্যারান্টি', description: 'স্বাদ ও মানে ১০০% তৃপ্তির গ্যারান্টি।', iconName: 'RotateCcw' }
    ],
    reviews: [
      {
        id: 'rev-1',
        customerName: 'মোহাম্মদ রাশেদুল ইসলাম',
        location: 'ধানমন্ডি, ঢাকা',
        rating: 5,
        comment: 'ইলিশ মাছের আচারটা অসম্ভব মজার ছিল! সরিষার তেলের নিখাদ ঝাঁঝ আর ইলিশের পারফেক্ট স্বাদ। সাথে গরুর আচার আর চিংড়ি বালাচাও ফ্রিতে পেয়ে পরিবারের সবাই খুশি। ধন্যবাদ JHT Food!',
        date: '২ দিন আগে',
        verified: true
      },
      {
        id: 'rev-2',
        customerName: 'তানিয়া সুলতানা',
        location: 'চট্টগ্রাম',
        rating: 5,
        comment: '৭৯৯ টাকায় এত চমৎকার ৩টা আইটেম সাথে ফ্রি ডেলিভারি সত্যি অবিশ্বাস্য! চিংড়ি বালাচাওটা এতটাই ক্রিস্পি যে গরম ভাতের সাথে অমৃত লাগে। আবার অর্ডার করব ইনশাআল্লাহ।',
        date: '৪ দিন আগে',
        verified: true
      },
      {
        id: 'rev-3',
        customerName: 'কবির হোসাইন',
        location: 'সিলেট সদর',
        rating: 5,
        comment: 'ডেলিভারি ম্যানের সামনে খুলে দেখে নিয়েছি। প্যাকেজিং দারুণ ছিল, একদম তেল চুইয়ে পড়েনি। গরুর মাংসের চুক্কা আচারটা খুবই নরম ও সুস্বাদু।',
        date: '১ সপ্তাহ আগে',
        verified: true
      }
    ],
    faqList: [
      {
        question: 'কম্বো অফারে মোট কী কী আইটেম থাকবে এবং পরিমাণ কত?',
        answer: 'এই কম্বোতে আপনি মোট ৩টি দারুণ আইটেম পাচ্ছেন: ১. ইলিশ মাছের আচার (২০০ গ্রাম), ২. গরুর মাংসের আচার (১০০ গ্রাম - সম্পূর্ণ ফ্রি), ৩. চিংড়ি শুঁটকি বালাচাও (১০০ গ্রাম - সম্পূর্ণ ফ্রি)। মোট ৪০০ গ্রাম খাবার।'
      },
      {
        question: 'ডেলিভারি চার্জ কি সত্যিই ফ্রি?',
        answer: 'হ্যাঁ! ঢাকা শহর কিংবা ঢাকার বাইরে বাংলাদেশের যেকোনো জেলায় ডেলিভারি চার্জ সম্পূর্ণ ফ্রি (০ টাকা)। আপনাকে কোনো ডেলিভারি চার্জ দিতে হবে না।'
      },
      {
        question: 'আমাকে কি কোনো টাকা অগ্রিম দিতে হবে?',
        answer: 'না, একদমই না! অগ্রিম এক টাকাও দিতে হবে না। ডেলিভারি ম্যান যখন খাবার আপনার ঠিকানায় নিয়ে আসবে, আপনি খাবার হাতে পেয়ে চেক করে সম্পূর্ণ মূল্য ক্যাশ অন ডেলিভারিতে পরিশোধ করবেন।'
      },
      {
        question: 'আচার কতদিন ভালো থাকবে?',
        answer: 'আমাদের প্রতিটি আচার খাঁটি ঘানিভাঙা সরিষার তেলে ডুবিয়ে প্রস্তুত করা হয়। স্বাভাবিক তাপমাত্রায় শুকনো চামচ ব্যবহার করলে ৬ মাস পর্যন্ত একদম টাটকা ও ভালো থাকবে।'
      }
    ]
  },
  settings: {
    storeName: 'JHT Food',
    hotlinePhone: '01522-133748',
    whatsappNumber: '8801522133748',
    messengerUrl: '',
    facebookPageUrl: '',
    metaPixelId: '',
    tiktokPixelId: '',
    announcementText: '🎉 ইলিশের আচারে গরু ও বালাচাও ফ্রি!',
    announcementActive: true
  },
  orders: [],
  leads: []
};

// Synchronous local loader
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
  } catch (e) {}

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
  } catch (e) {}

  memoryDb = JSON.parse(JSON.stringify(DEFAULT_DB));
  return memoryDb!;
}

// Asynchronous Cloud & Local Loader
export async function getDbAsync(): Promise<DatabaseSchema> {
  const supabase = getSupabaseConfig();
  if (supabase) {
    try {
      const res = await fetch(`${supabase.url}/rest/v1/kv_store?key=eq.jhthub_db&select=value`, {
        method: 'GET',
        headers: {
          apikey: supabase.key,
          Authorization: `Bearer ${supabase.key}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });
      if (res.ok) {
        const rows = await res.json();
        if (Array.isArray(rows) && rows.length > 0 && rows[0]?.value) {
          const cloudData = rows[0].value;
          memoryDb = {
            product: { ...DEFAULT_DB.product, ...(cloudData.product || {}) },
            settings: { ...DEFAULT_DB.settings, ...(cloudData.settings || {}) },
            orders: cloudData.orders || [],
            leads: cloudData.leads || [],
          };
          return memoryDb;
        }
      }
    } catch (err) {
      console.error('[Supabase Fetch Error]:', err);
    }
  }

  const kv = getKvConfig();
  if (kv) {
    try {
      const res = await fetch(`${kv.url}/get/jhthub_db_v1`, {
        headers: { Authorization: `Bearer ${kv.token}` },
        cache: 'no-store',
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.result) {
          const parsed = typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
          if (parsed) {
            memoryDb = {
              product: { ...DEFAULT_DB.product, ...(parsed.product || {}) },
              settings: { ...DEFAULT_DB.settings, ...(parsed.settings || {}) },
              orders: parsed.orders || [],
              leads: parsed.leads || [],
            };
            return memoryDb;
          }
        }
      }
    } catch (err) {
      console.error('[KV Fetch Error]:', err);
    }
  }

  return getDb();
}

// Synchronous local saver with background cloud dispatch
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
  } catch (e) {}

  // 2. Try saving to tmp storage (serverless environments)
  try {
    fs.writeFileSync(TMP_DB_FILE, payload, 'utf-8');
  } catch (e) {}

  // 3. Background Cloud Sync (Supabase)
  const supabase = getSupabaseConfig();
  if (supabase) {
    fetch(`${supabase.url}/rest/v1/kv_store`, {
      method: 'POST',
      headers: {
        apikey: supabase.key,
        Authorization: `Bearer ${supabase.key}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        key: 'jhthub_db',
        value: memoryDb,
        updated_at: new Date().toISOString(),
      }),
    }).catch((err) => console.error('[Supabase Sync Error]:', err));
  }

  // 4. Background Cloud Sync (Vercel KV / Upstash)
  const kv = getKvConfig();
  if (kv) {
    fetch(`${kv.url}/set/jhthub_db_v1`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${kv.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).catch((err) => console.error('[KV Sync Error]:', err));
  }
}

// Asynchronous Cloud Saver
export async function saveDbAsync(data: DatabaseSchema): Promise<void> {
  memoryDb = {
    product: { ...data.product },
    settings: { ...data.settings },
    orders: [...(data.orders || [])],
    leads: [...(data.leads || [])],
  };

  const payload = JSON.stringify(memoryDb, null, 2);

  // Local saves
  try {
    if (!fs.existsSync(LOCAL_DATA_DIR)) {
      fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DB_FILE, payload, 'utf-8');
  } catch (e) {}

  try {
    fs.writeFileSync(TMP_DB_FILE, payload, 'utf-8');
  } catch (e) {}

  // Cloud Save (Supabase)
  const supabase = getSupabaseConfig();
  if (supabase) {
    try {
      await fetch(`${supabase.url}/rest/v1/kv_store`, {
        method: 'POST',
        headers: {
          apikey: supabase.key,
          Authorization: `Bearer ${supabase.key}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          key: 'jhthub_db',
          value: memoryDb,
          updated_at: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error('[Supabase Save Error]:', err);
    }
  }

  // Cloud Save (KV)
  const kv = getKvConfig();
  if (kv) {
    try {
      await fetch(`${kv.url}/set/jhthub_db_v1`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${kv.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error('[KV Save Error]:', err);
    }
  }
}

// ----------------- PRODUCT DATA -----------------

export function getProductData(): ProductData {
  return getDb().product;
}

export async function getProductDataAsync(): Promise<ProductData> {
  const db = await getDbAsync();
  return db.product;
}

export function updateProductData(product: Partial<ProductData>): ProductData {
  const db = getDb();
  db.product = { ...db.product, ...product };
  saveDb(db);
  return db.product;
}

export async function updateProductDataAsync(product: Partial<ProductData>): Promise<ProductData> {
  const db = await getDbAsync();
  db.product = { ...db.product, ...product };
  await saveDbAsync(db);
  return db.product;
}

// ----------------- SETTINGS -----------------

export function getSettings(): StoreSettings {
  return getDb().settings;
}

export async function getSettingsAsync(): Promise<StoreSettings> {
  const db = await getDbAsync();
  return db.settings;
}

export function updateSettings(settings: Partial<StoreSettings>): StoreSettings {
  const db = getDb();
  db.settings = { ...db.settings, ...settings };
  saveDb(db);
  return db.settings;
}

export async function updateSettingsAsync(settings: Partial<StoreSettings>): Promise<StoreSettings> {
  const db = await getDbAsync();
  db.settings = { ...db.settings, ...settings };
  await saveDbAsync(db);
  return db.settings;
}

// ----------------- ORDERS -----------------

export function getOrders(): Order[] {
  return getDb().orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getOrdersAsync(): Promise<Order[]> {
  const db = await getDbAsync();
  return (db.orders || []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getOrderById(id: string): Order | undefined {
  const targetId = (id || '').trim().toLowerCase();
  return getDb().orders.find((o) => (o.id || '').trim().toLowerCase() === targetId);
}

export async function getOrderByIdAsync(id: string): Promise<Order | undefined> {
  const db = await getDbAsync();
  const targetId = (id || '').trim().toLowerCase();
  return (db.orders || []).find((o) => (o.id || '').trim().toLowerCase() === targetId);
}

export function createOrder(orderInput: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Order {
  const db = getDb();
  
  const existingNums = (db.orders || []).map((o) => {
    const num = parseInt((o.id || '').replace(/[^0-9]/g, ''), 10);
    return isNaN(num) ? 1000 : num;
  });
  const maxNum = existingNums.length > 0 ? Math.max(1000, ...existingNums) : 1000;
  const nextNum = maxNum + 1;
  
  const newOrder: Order = {
    ...orderInput,
    id: `JHT-${nextNum}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.orders.unshift(newOrder);

  const cleanPhone = (orderInput.phone || '').replace(/[^0-9]/g, '');
  db.leads = (db.leads || []).filter((l) => {
    const leadCleanPhone = (l.phone || '').replace(/[^0-9]/g, '');
    const isMatch = leadCleanPhone === cleanPhone || (cleanPhone.length >= 10 && leadCleanPhone.slice(-10) === cleanPhone.slice(-10));
    return !isMatch;
  });

  saveDb(db);
  return newOrder;
}

export async function createOrderAsync(orderInput: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Order> {
  const db = await getDbAsync();
  db.orders = db.orders || [];
  db.leads = db.leads || [];

  const existingNums = db.orders.map((o) => {
    const num = parseInt((o.id || '').replace(/[^0-9]/g, ''), 10);
    return isNaN(num) ? 1000 : num;
  });
  const maxNum = existingNums.length > 0 ? Math.max(1000, ...existingNums) : 1000;
  const nextNum = maxNum + 1;
  
  const newOrder: Order = {
    ...orderInput,
    id: `JHT-${nextNum}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.orders.unshift(newOrder);

  const cleanPhone = (orderInput.phone || '').replace(/[^0-9]/g, '');
  db.leads = db.leads.filter((l) => {
    const leadCleanPhone = (l.phone || '').replace(/[^0-9]/g, '');
    const isMatch = leadCleanPhone === cleanPhone || (cleanPhone.length >= 10 && leadCleanPhone.slice(-10) === cleanPhone.slice(-10));
    return !isMatch;
  });

  await saveDbAsync(db);
  return newOrder;
}

export function updateOrderStatus(id: string, status: Order['status']): Order | null {
  const db = getDb();
  const targetId = (id || '').trim().toLowerCase();
  const index = db.orders.findIndex((o) => (o.id || '').trim().toLowerCase() === targetId);
  if (index === -1) return null;
  db.orders[index].status = status;
  db.orders[index].updatedAt = new Date().toISOString();
  saveDb(db);
  return db.orders[index];
}

export async function updateOrderStatusAsync(id: string, status: Order['status']): Promise<Order | null> {
  const db = await getDbAsync();
  db.orders = db.orders || [];
  const targetId = (id || '').trim().toLowerCase();
  const index = db.orders.findIndex((o) => (o.id || '').trim().toLowerCase() === targetId);
  if (index === -1) return null;
  db.orders[index].status = status;
  db.orders[index].updatedAt = new Date().toISOString();
  await saveDbAsync(db);
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

export async function deleteOrderAsync(id: string): Promise<boolean> {
  const db = await getDbAsync();
  db.orders = db.orders || [];
  const targetId = (id || '').trim().toLowerCase();
  const initialLength = db.orders.length;
  db.orders = db.orders.filter((o) => (o.id || '').trim().toLowerCase() !== targetId);
  if (db.orders.length !== initialLength) {
    await saveDbAsync(db);
    return true;
  }
  return false;
}

// ----------------- LEADS (Abandoned / Incomplete Checkouts ONLY) -----------------

export function getLeads(): Lead[] {
  const db = getDb();
  const orderPhones = new Set(db.orders.map((o) => (o.phone || '').replace(/[^0-9]/g, '').slice(-10)));
  return (db.leads || [])
    .filter((l) => {
      const leadPhone = (l.phone || '').replace(/[^0-9]/g, '').slice(-10);
      return !orderPhones.has(leadPhone) && l.status !== 'converted';
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getLeadsAsync(): Promise<Lead[]> {
  const db = await getDbAsync();
  db.orders = db.orders || [];
  db.leads = db.leads || [];
  const orderPhones = new Set(db.orders.map((o) => (o.phone || '').replace(/[^0-9]/g, '').slice(-10)));
  return db.leads
    .filter((l) => {
      const leadPhone = (l.phone || '').replace(/[^0-9]/g, '').slice(-10);
      return !orderPhones.has(leadPhone) && l.status !== 'converted';
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getLeadById(id: string): Lead | undefined {
  const db = getDb();
  const targetId = (id || '').trim().toLowerCase();
  return (db.leads || []).find((l) => (l.id || '').trim().toLowerCase() === targetId);
}

export async function getLeadByIdAsync(id: string): Promise<Lead | undefined> {
  const db = await getDbAsync();
  const targetId = (id || '').trim().toLowerCase();
  return (db.leads || []).find((l) => (l.id || '').trim().toLowerCase() === targetId);
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

  const hasCompletedOrder = (db.orders || []).some((o) => {
    const orderPhone = (o.phone || '').replace(/[^0-9]/g, '');
    return orderPhone === cleanPhone || (orderPhone.slice(-10) === cleanPhone.slice(-10) && cleanPhone.length >= 10);
  });

  if (hasCompletedOrder) {
    const initialLen = db.leads.length;
    db.leads = db.leads.filter((l) => {
      const p = (l.phone || '').replace(/[^0-9]/g, '');
      return !(p === cleanPhone || (p.slice(-10) === cleanPhone.slice(-10) && cleanPhone.length >= 10));
    });
    if (db.leads.length !== initialLen) {
      saveDb(db);
    }
    return { lead: null, isNew: false };
  }

  const existingIndex = db.leads.findIndex((l) => {
    const p = (l.phone || '').replace(/[^0-9]/g, '');
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

  const existingLeadNums = db.leads.map((l) => {
    const num = parseInt((l.id || '').replace(/[^0-9]/g, ''), 10);
    return isNaN(num) ? 1000 : num;
  });
  const maxLeadNum = existingLeadNums.length > 0 ? Math.max(1000, ...existingLeadNums) : 1000;
  const nextLeadNum = maxLeadNum + 1;

  const newLead: Lead = {
    id: `LD-${nextLeadNum}`,
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

export async function createOrUpdateLeadAsync(leadInput: {
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
}): Promise<{ lead: Lead | null; isNew: boolean }> {
  const db = await getDbAsync();
  db.orders = db.orders || [];
  db.leads = db.leads || [];

  const cleanPhone = (leadInput.phone || '').replace(/[^0-9]/g, '');
  if (!cleanPhone || cleanPhone.length < 10) {
    throw new Error('Valid phone number with at least 10 digits is required');
  }

  const hasCompletedOrder = db.orders.some((o) => {
    const orderPhone = (o.phone || '').replace(/[^0-9]/g, '');
    return orderPhone === cleanPhone || (orderPhone.slice(-10) === cleanPhone.slice(-10) && cleanPhone.length >= 10);
  });

  if (hasCompletedOrder) {
    const initialLen = db.leads.length;
    db.leads = db.leads.filter((l) => {
      const p = (l.phone || '').replace(/[^0-9]/g, '');
      return !(p === cleanPhone || (p.slice(-10) === cleanPhone.slice(-10) && cleanPhone.length >= 10));
    });
    if (db.leads.length !== initialLen) {
      await saveDbAsync(db);
    }
    return { lead: null, isNew: false };
  }

  const existingIndex = db.leads.findIndex((l) => {
    const p = (l.phone || '').replace(/[^0-9]/g, '');
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
    await saveDbAsync(db);
    return { lead: updated, isNew: false };
  }

  const existingLeadNums = db.leads.map((l) => {
    const num = parseInt((l.id || '').replace(/[^0-9]/g, ''), 10);
    return isNaN(num) ? 1000 : num;
  });
  const maxLeadNum = existingLeadNums.length > 0 ? Math.max(1000, ...existingLeadNums) : 1000;
  const nextLeadNum = maxLeadNum + 1;

  const newLead: Lead = {
    id: `LD-${nextLeadNum}`,
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
  await saveDbAsync(db);
  return { lead: newLead, isNew: true };
}

export function updateLead(
  id: string,
  updates: Partial<Pick<Lead, 'status' | 'notes' | 'callCount' | 'customerName' | 'address' | 'cityZone'>>
): Lead | null {
  const db = getDb();
  db.leads = db.leads || [];
  const targetId = (id || '').trim().toLowerCase();
  const index = db.leads.findIndex((l) => (l.id || '').trim().toLowerCase() === targetId);
  if (index === -1) return null;

  db.leads[index] = {
    ...db.leads[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  saveDb(db);
  return db.leads[index];
}

export async function updateLeadAsync(
  id: string,
  updates: Partial<Pick<Lead, 'status' | 'notes' | 'callCount' | 'customerName' | 'address' | 'cityZone'>>
): Promise<Lead | null> {
  const db = await getDbAsync();
  db.leads = db.leads || [];
  const targetId = (id || '').trim().toLowerCase();
  const index = db.leads.findIndex((l) => (l.id || '').trim().toLowerCase() === targetId);
  if (index === -1) return null;

  db.leads[index] = {
    ...db.leads[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  await saveDbAsync(db);
  return db.leads[index];
}

export function recordLeadCall(id: string, notes?: string): Lead | null {
  const db = getDb();
  db.leads = db.leads || [];
  const targetId = (id || '').trim().toLowerCase();
  const index = db.leads.findIndex((l) => (l.id || '').trim().toLowerCase() === targetId);
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

export async function recordLeadCallAsync(id: string, notes?: string): Promise<Lead | null> {
  const db = await getDbAsync();
  db.leads = db.leads || [];
  const targetId = (id || '').trim().toLowerCase();
  const index = db.leads.findIndex((l) => (l.id || '').trim().toLowerCase() === targetId);
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
  await saveDbAsync(db);
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

export async function deleteLeadAsync(id: string): Promise<boolean> {
  const db = await getDbAsync();
  db.leads = db.leads || [];
  const targetId = (id || '').trim().toLowerCase();
  const initialLength = db.leads.length;
  db.leads = db.leads.filter((l) => (l.id || '').trim().toLowerCase() !== targetId);
  if (db.leads.length !== initialLength) {
    await saveDbAsync(db);
    return true;
  }
  return false;
}
