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
