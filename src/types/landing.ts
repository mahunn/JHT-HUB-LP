export interface ComboPackage {
  id: string;
  name: string;
  banglaName: string;
  subtitle: string;
  quantity: number;
  regularPrice: number;
  offerPrice: number;
  badge?: string;
  isDefault?: boolean;
  image?: string;
}

export interface ScentItem {
  id: string;
  name: string;
  category: 'arabian' | 'perfume';
  notes?: string;
  badge?: string;
}

export interface ProductFeature {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface TrustBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
  verified: boolean;
}

export interface ProductData {
  brandName: string;
  productName: string;
  headlinePre: string;
  headlineHighlight: string;
  headlinePost: string;
  headlineSub: string;
  freeDeliveryHeadline: string;
  stockCount: number;
  countdownHours: number;
  mainBannerImage: string;
  galleryImages: string[];
  deliveryChargeDhaka: number;
  deliveryChargeOutside: number;
  freeDeliveryDhaka: boolean;
  freeDeliveryOutside: boolean;
  packages: ComboPackage[];
  scents: ScentItem[];
  features: ProductFeature[];
  trustBadges: TrustBadge[];
  reviews: CustomerReview[];
  faqList: { question: string; answer: string }[];
}

export interface StoreSettings {
  storeName: string;
  hotlinePhone: string;
  whatsappNumber: string;
  messengerUrl: string;
  facebookPageUrl: string;
  metaPixelId: string;
  tiktokPixelId: string;
  adminPin: string;
  announcementText: string;
  announcementActive: boolean;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  cityZone: 'dhaka' | 'outside';
  selectedPackage: {
    id: string;
    name: string;
    banglaName: string;
    price: number;
  };
  quantity: number;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  notes?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus = 'abandoned' | 'contacted' | 'converted' | 'fake' | 'lost';

export interface Lead {
  id: string;
  customerName?: string;
  phone: string;
  address?: string;
  cityZone?: 'dhaka' | 'outside';
  selectedPackage?: {
    id: string;
    name: string;
    banglaName: string;
    price: number;
  };
  quantity?: number;
  status: LeadStatus;
  notes?: string;
  callCount?: number;
  lastContactedAt?: string;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseSchema {
  product: ProductData;
  settings: StoreSettings;
  orders: Order[];
  leads: Lead[];
}
