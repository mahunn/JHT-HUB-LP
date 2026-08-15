import { getProductData, getSettings } from '@/lib/db';
import AnnouncementBar from '@/components/AnnouncementBar';
import HeroSection from '@/components/HeroSection';
import ScentsBreakdown from '@/components/ScentsBreakdown';
import HadithSection from '@/components/HadithSection';
import TrustBadges from '@/components/TrustBadges';
import CheckoutOrderForm from '@/components/CheckoutOrderForm';
import FloatingActions from '@/components/FloatingActions';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default function LandingPage() {
  const product = getProductData();
  const settings = getSettings();

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 relative selection:bg-emerald-200 selection:text-emerald-900">
      {/* Top Urgency Announcement Bar */}
      <AnnouncementBar
        text={settings.announcementText}
        active={settings.announcementActive}
        countdownHours={product.countdownHours}
      />

      {/* 1. Hero & Product Showcase */}
      <HeroSection product={product} />

      {/* 2. Scents List (Arabian & Perfume Scents) */}
      <ScentsBreakdown scents={product.scents} />

      {/* 3. Hadith about Perfume (মুসনাদুল ফিরদাউস: ৫৯৫৪) */}
      <div className="px-4">
        <HadithSection />
      </div>

      {/* 4. Trust Badges: আস্থা রাখুন আস্থায় থাকুন */}
      <TrustBadges trustBadges={product.trustBadges} />

      {/* 5. Direct High-Converting Cash on Delivery Checkout Form (#ordernowyet) */}
      <CheckoutOrderForm product={product} />

      {/* Floating Action Bars (Mobile sticky button, WhatsApp, Hotline dialer) */}
      <FloatingActions settings={settings} />

      {/* Footer */}
      <Footer settings={settings} product={product} />
    </main>
  );
}
