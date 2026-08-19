import { NextResponse } from 'next/server';
import { getOrderById, updateOrderStatus, deleteOrder, getSettings } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } | Promise<{ id: string }> }) {
  try {
    const resolved = await Promise.resolve(params);
    const orderId = decodeURIComponent(resolved?.id || '').trim();
    const order = getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: 'অর্ডার পাওয়া যায়নি।' }, { status: 404 });
    }
    const settings = getSettings();
    return NextResponse.json({ success: true, order, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } | Promise<{ id: string }> }) {
  try {
    const resolved = await Promise.resolve(params);
    const orderId = decodeURIComponent(resolved?.id || '').trim();
    const body = await request.json();
    if (!body.status) {
      return NextResponse.json({ success: false, error: 'Status is required' }, { status: 400 });
    }

    const updated = updateOrderStatus(orderId, body.status);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } | Promise<{ id: string }> }) {
  try {
    const resolved = await Promise.resolve(params);
    const orderId = decodeURIComponent(resolved?.id || '').trim();
    const success = deleteOrder(orderId);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
