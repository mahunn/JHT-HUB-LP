'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface PixelTrackerProps {
  metaPixelId?: string;
  tiktokPixelId?: string;
}

export default function PixelTracker({ metaPixelId, tiktokPixelId }: PixelTrackerProps) {
  const cleanMetaId = metaPixelId?.trim() || '';
  const cleanTikTokId = tiktokPixelId?.trim() || '';

  useEffect(() => {
    // Only fire on subsequent client-side route navigation (avoid duplicate on initial load)
    if (typeof window !== 'undefined') {
      const win = window as any;
      if (win.__initialPixelLoaded) {
        if (cleanMetaId && typeof win.fbq === 'function') {
          win.fbq('track', 'PageView');
        }
        if (cleanTikTokId && typeof win.ttq?.page === 'function') {
          win.ttq.page();
        }
      } else {
        win.__initialPixelLoaded = true;
      }
    }
  }, [cleanMetaId, cleanTikTokId]);

  return (
    <>
      {/* 1. Meta (Facebook) Pixel */}
      {cleanMetaId && (
        <>
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${cleanMetaId}');
                fbq('track', 'PageView');
                fbq('track', 'ViewContent', {
                  content_name: 'স্পেশাল ইলিশের আচার কম্বো ধামাকা অফার',
                  content_category: 'Food & Pickles',
                  content_type: 'product',
                  content_ids: ['combo-special'],
                  value: 799,
                  currency: 'BDT'
                });
              `,
            }}
          />
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${cleanMetaId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {/* 2. TikTok Pixel */}
      {cleanTikTokId && (
        <Script
          id="tiktok-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
                var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
                ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
                ttq.load('${cleanTikTokId}');
                ttq.page();
                ttq.track('ViewContent', {
                  content_name: 'স্পেশাল ইলিশের আচার কম্বো ধামাকা অফার',
                  content_type: 'product',
                  content_id: 'combo-special',
                  value: 799,
                  currency: 'BDT',
                  contents: [
                    {
                      content_id: 'combo-special',
                      content_name: 'স্পেশাল ইলিশের আচার কম্বো ধামাকা অফার',
                      quantity: 1,
                      price: 799
                    }
                  ]
                });
              }(window, document, 'ttq');
            `,
          }}
        />
      )}
    </>
  );
}
