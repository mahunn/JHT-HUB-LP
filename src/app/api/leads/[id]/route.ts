import { NextRequest, NextResponse } from 'next/server';
import { getLeadByIdAsync, updateLeadAsync, recordLeadCallAsync, deleteLeadAsync } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const resolved = await Promise.resolve(params);
    const leadId = decodeURIComponent(resolved?.id || '').trim();
    const lead = await getLeadByIdAsync(leadId);
    if (!lead) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, lead });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const resolved = await Promise.resolve(params);
    const leadId = decodeURIComponent(resolved?.id || '').trim();
    const body = await req.json();
    const { action, status, notes, callCount, customerName, address, cityZone } = body;

    if (action === 'call') {
      const updated = await recordLeadCallAsync(leadId, notes);
      if (!updated) {
        return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, lead: updated });
    }

    const updated = await updateLeadAsync(leadId, {
      status,
      notes,
      callCount,
      customerName,
      address,
      cityZone,
    });

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const resolved = await Promise.resolve(params);
    const leadId = decodeURIComponent(resolved?.id || '').trim();
    const deleted = await deleteLeadAsync(leadId);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
