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
  const [product, setProduct] = useState<ProductData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('jht_cached_product');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.mainBannerImage) return parsed;
        }
      } catch (e) {}
    }
    return initialProduct;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('jht_cached_settings');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed) return parsed;
        }
      } catch (e) {}
    }
    return initialSettings;
  });

  // Live client-side hydration to ensure newly uploaded images/prices appear immediately
  useEffect(() => {
    let isMounted = true;

    // Check localStorage immediately upon client mount
    try {
      const cached = localStorage.getItem('jht_cached_product');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.mainBannerImage && isMounted) {
          setProduct(parsed);
        }
      }
      const cachedSet = localStorage.getItem('jht_cached_settings');
      if (cachedSet) {
        const parsedSet = JSON.parse(cachedSet);
        if (parsedSet && isMounted) {
          setSettings(parsedSet);
        }
      }
    } catch (e) {}

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
