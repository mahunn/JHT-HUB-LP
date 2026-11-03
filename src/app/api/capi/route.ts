import { NextResponse } from 'next/server';
import { getSettingsAsync } from '@/lib/db';
import { sendMetaCapiEvent, sendTikTokCapiEvent } from '@/lib/capi';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const settings = await getSettingsAsync();

    const eventName = body.eventName || 'PageView';
    const eventId = body.eventId || `capi_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const promises: Promise<any>[] = [];

    // 1. Meta CAPI
    if (settings.fbCapiEnabled && settings.metaPixelId && settings.fbCapiToken) {
      promises.push(
        sendMetaCapiEvent({
          eventName,
          eventId,
          eventSourceUrl: body.eventSourceUrl || request.headers.get('referer') || undefined,
          customerName: body.customerName,
          phone: body.phone,
          value: body.value,
          currency: body.currency,
          contentName: body.contentName,
          numItems: body.numItems,
          orderId: body.orderId,
          headers: request.headers,
          settings,
        })
      );
    }

    // 2. TikTok Events API
    if (settings.tiktokCapiEnabled && settings.tiktokPixelId && settings.tiktokCapiToken) {
      let ttEvent: 'CompletePayment' | 'PlaceAnOrder' | 'InitiateCheckout' | 'ViewContent' | 'Pageview' = 'Pageview';
      if (eventName === 'Purchase') ttEvent = 'CompletePayment';
      else if (eventName === 'InitiateCheckout') ttEvent = 'InitiateCheckout';
      else if (eventName === 'ViewContent') ttEvent = 'ViewContent';

      promises.push(
        sendTikTokCapiEvent({
          eventName: ttEvent,
          eventId,
          eventSourceUrl: body.eventSourceUrl || request.headers.get('referer') || undefined,
          phone: body.phone,
          value: body.value,
          currency: body.currency,
          contentName: body.contentName,
          numItems: body.numItems,
          orderId: body.orderId,
          headers: request.headers,
          settings,
        })
      );
    }

    const results = await Promise.allSettled(promises);
    return NextResponse.json({ success: true, count: results.length });
  } catch (error: any) {
    console.error('[API CAPI Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
