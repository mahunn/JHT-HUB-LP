import type { Metadata, Viewport } from 'next';
import './globals.css';
import { getSettings, getProductDataAsync, getSettingsAsync } from '@/lib/db';
import PixelTracker from '@/components/PixelTracker';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const product = await getProductDataAsync();
  const settings = await getSettingsAsync();
  
  return {
    title: `${product.productName} - ${settings.storeName}`,
    description: `${product.headlinePre} ${product.headlineHighlight}! ${product.headlinePost}`,
    keywords: [
      'ইলিশের আচার',
      'গরুর মাংসের আচার',
      'চিংড়ি বালাচাও',
      'JHT Food',
      'Ilish Achar',
      'Gorur Achar',
      'Chingri Balachao',
      'স্পেশাল আচার কম্বো',
      'হোমমেড আচার বাংলাদেশ'
    ],
    openGraph: {
      title: `${product.productName} - ${settings.storeName}`,
      description: `${product.headlinePre} ${product.headlineHighlight}! ${product.freeDeliveryHeadline}`,
      images: [
        {
          url: product.mainBannerImage,
          width: 800,
          height: 800,
          alt: product.productName,
        },
      ],
      type: 'website',
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettingsAsync();

  return (
    <html lang="bn" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anek+Bangla:wght@400;500;600;700;800&family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Bengali:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-slate-50 text-slate-800">
        <PixelTracker metaPixelId={settings.metaPixelId} tiktokPixelId={settings.tiktokPixelId} />
        {children}
      </body>
    </html>
  );
}
