'use client';

import { useState, useEffect } from 'react';
import { ProductData, StoreSettings } from '@/types/landing';
import AnnouncementBar from '@/components/AnnouncementBar';
import HeroSection from '@/components/HeroSection';
import ComboItemsBreakdown from '@/components/ComboItemsBreakdown';
import FoodPairingSection from '@/components/FoodPairingSection';
import FeaturesGrid from '@/components/FeaturesGrid';
import StorageGuideSection from '@/components/StorageGuideSection';
import CustomerReviews from '@/components/CustomerReviews';
import CheckoutOrderForm from '@/components/CheckoutOrderForm';
import FloatingActions from '@/components/FloatingActions';
import Footer from '@/components/Footer';

interface LandingPageClientProps {
  initialProduct: ProductData;
  initialSettings: StoreSettings;
}

export default function LandingPageClient({
  initialProduct,
  initialSettings,
}: LandingPageClientProps) {
  const [product, setProduct] = useState<ProductData>(initialProduct);
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);

  // Live client-side fetch to ensure newly updated data appears immediately
  useEffect(() => {
    let isMounted = true;

    const fetchLatest = async () => {
      try {
        const pRes = await fetch('/api/product', { cache: 'no-store' });
        if (pRes.ok) {
          const pData = await pRes.json();
          if (pData.success && pData.product && isMounted) {
            setProduct(pData.product);
            try {
              localStorage.setItem('jht_cached_product', JSON.stringify(pData.product));
            } catch (e) {}
          }
        }

        const sRes = await fetch('/api/settings', { cache: 'no-store' });
        if (sRes.ok) {
          const sData = await sRes.json();
          if (sData.success && sData.settings && isMounted) {
            setSettings(sData.settings);
            try {
              localStorage.setItem('jht_cached_settings', JSON.stringify(sData.settings));
            } catch (e) {}
          }
        }
      } catch (err) {
        // Silently fallback
      }
    };

    fetchLatest();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-white font-['Anek_Bangla','Hind_Siliguri',sans-serif]">
      {/* Announcement Bar */}
      <AnnouncementBar
        text={settings.announcementText}
        active={settings.announcementActive}
        countdownHours={product.countdownHours}
      />

      {/* 1. Hero Section (Bilashfood-style tilted image, big offer price, glow CTA) */}
      <HeroSection product={product} />

      {/* 2. What You Get / যা যা পাচ্ছেন (3 items: Ilish 200g, Beef 100g Free, Balachao 100g Free with Lightbox) */}
      <ComboItemsBreakdown />

      {/* 3. Food Pairing / ইলিশের আচার ও বালাচাও যেভাবে খেতে পারবেন (4 pairings: ভাত, খিচুড়ি, মুড়ি, পিঠা) */}
      <FoodPairingSection />

      {/* 4. Why Our Ilish Achar is Best / কেন সেরা আমাদের ইলিশ আচার? (4 feature cards) */}
      <FeaturesGrid />

      {/* 5. Storage & Caution / সংরক্ষণ ও সতর্কতা (5 storage guidelines) */}
      <StorageGuideSection />

      {/* 6. Customer Reviews (Clean, simple testimonials) */}
      {product.reviews && product.reviews.length > 0 && (
        <CustomerReviews reviews={product.reviews} />
      )}

      {/* 7. Checkout Form / অর্ডার কনফার্ম করতে তথ্যগুলো দিন (WooCommerce / CartFlows style) */}
      <CheckoutOrderForm product={product} />

      {/* 8. Floating Actions (WhatsApp & Call) */}
      <FloatingActions settings={settings} />

      {/* 9. Footer */}
      <Footer />
    </main>
  );
}
