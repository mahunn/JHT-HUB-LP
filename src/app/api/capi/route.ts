import { NextResponse } from 'next/server';
import { getSettingsAsync } from '@/lib/db';
import { sendMetaCapiEvent } from '@/lib/capi';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const settings = await getSettingsAsync();

    if (!settings.fbCapiEnabled || !settings.metaPixelId || !settings.fbCapiToken) {
      return NextResponse.json({
        success: false,
        message: 'Conversion API is not active or token not configured',
      });
    }

    const eventName = body.eventName || 'PageView';
    const eventId = body.eventId || `capi_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const result = await sendMetaCapiEvent({
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
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[API CAPI Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
