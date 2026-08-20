'use client';

import { useState, useEffect } from 'react';
import { ProductData, StoreSettings } from '@/types/landing';
import AnnouncementBar from '@/components/AnnouncementBar';
import HeroSection from '@/components/HeroSection';
import ScentsBreakdown from '@/components/ScentsBreakdown';
import HadithSection from '@/components/HadithSection';
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

  // Live client-side hydration to ensure newly uploaded images/prices appear immediately
  useEffect(() => {
    let isMounted = true;
    const fetchLatest = async () => {
      try {
        const pRes = await fetch('/api/product', { cache: 'no-store' });
        if (pRes.ok) {
          const pData = await pRes.json();
          if (pData.success && pData.product && isMounted) {
            setProduct(pData.product);
          }
        }

        const sRes = await fetch('/api/settings', { cache: 'no-store' });
        if (sRes.ok) {
          const sData = await sRes.json();
          if (sData.success && sData.settings && isMounted) {
            setSettings(sData.settings);
          }
        }
      } catch (err) {
        // Silently fallback to initial SSR data
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

      {/* Hero & Product */}
      <HeroSection product={product} />

      {/* Scents Collection */}
      <ScentsBreakdown scents={product.scents} />

      {/* Hadith */}
      <HadithSection />

      {/* Trust Badges */}
      <TrustBadges trustBadges={product.trustBadges} />

      {/* Checkout Form */}
      <CheckoutOrderForm product={product} />

      {/* Floating Actions */}
      <FloatingActions settings={settings} />

      {/* Footer */}
      <Footer settings={settings} product={product} />
    </main>
  );
}
