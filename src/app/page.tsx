import { getProductDataAsync, getSettingsAsync } from '@/lib/db';
import LandingPageClient from '@/components/LandingPageClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function LandingPage() {
  const product = await getProductDataAsync();
  const settings = await getSettingsAsync();

  return <LandingPageClient initialProduct={product} initialSettings={settings} />;
}
