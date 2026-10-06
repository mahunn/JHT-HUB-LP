'use client';

import { useState, useEffect } from 'react';
import { ProductData, StoreSettings } from '@/types/landing';
import AnnouncementBar from '@/components/AnnouncementBar';
import HeroSection from '@/components/HeroSection';
import ComboItemsBreakdown from '@/components/ComboItemsBreakdown';
import FeaturesGrid from '@/components/FeaturesGrid';
import CustomerReviews from '@/components/CustomerReviews';
import FaqSection from '@/components/FaqSection';
import TrustBadges from '@/components/TrustBadges';
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
    <main className="min-h-screen flex flex-col bg-white">
      {/* Announcement Bar */}
      <AnnouncementBar
        text={settings.announcementText}
        active={settings.announcementActive}
        countdownHours={product.countdownHours}
      />

      {/* Hero Section */}
      <HeroSection product={product} />

      {/* Combo Breakdown (The 3 Items: Ilish Achar, Gorur Achar, Chingri Balachao) */}
      <ComboItemsBreakdown />

      {/* Features Grid (Why JHT Food is best) */}
      <FeaturesGrid features={product.features} />

      {/* Customer Reviews */}
      {product.reviews && product.reviews.length > 0 && (
        <CustomerReviews reviews={product.reviews} />
      )}

      {/* FAQ Section */}
      {product.faqList && product.faqList.length > 0 && (
        <FaqSection faqList={product.faqList} />
      )}

      {/* Trust Badges */}
      <TrustBadges trustBadges={product.trustBadges} />

      {/* Checkout Form */}
      <CheckoutOrderForm product={product} />

      {/* Floating Actions (WhatsApp at bottom right & quick call) */}
      <FloatingActions settings={settings} />

      {/* Footer */}
      <Footer settings={settings} product={product} />
    </main>
  );
}
