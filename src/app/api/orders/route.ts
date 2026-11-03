import { NextResponse } from 'next/server';
import { createOrderAsync, getOrdersAsync, getSettingsAsync } from '@/lib/db';
import { sendMetaCapiEvent } from '@/lib/capi';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const orders = await getOrdersAsync();
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.customerName || !body.phone || !body.address || !body.selectedPackage) {
      return NextResponse.json(
        { success: false, error: 'সব প্রয়োজনীয় তথ্য সঠিকভাবে পূরণ করুন।' },
        { status: 400 }
      );
    }

    const order = await createOrderAsync({
      customerName: body.customerName,
      phone: body.phone,
      address: body.address,
      cityZone: body.cityZone || 'dhaka',
      selectedPackage: body.selectedPackage,
      quantity: body.quantity || 1,
      subtotal: body.subtotal,
      deliveryCharge: body.deliveryCharge ?? 0,
      total: body.total,
      notes: body.notes || '',
    });

    const settings = await getSettingsAsync();

    // Server-Side Meta Conversion API (CAPI) Dispatch
    if (settings.fbCapiEnabled && settings.metaPixelId && settings.fbCapiToken) {
      try {
        await sendMetaCapiEvent({
          eventName: 'Purchase',
          eventId: order.id, // Deduplicated with browser pixel
          eventSourceUrl: request.headers.get('referer') || 'https://jhtfood.vercel.app',
          customerName: order.customerName,
          phone: order.phone,
          value: order.total,
          currency: 'BDT',
          contentName: order.selectedPackage?.banglaName || order.selectedPackage?.name || 'স্পেশাল ৩-ইন-১ আচার কম্বো',
          numItems: order.quantity || 1,
          orderId: order.id,
          headers: request.headers,
          settings,
        });
      } catch (capiErr) {
        console.error('[Order CAPI Dispatch Error]:', capiErr);
      }
    }

    return NextResponse.json({ success: true, order, settings }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
