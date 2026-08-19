import { NextRequest, NextResponse } from 'next/server';
import { getLeads, createOrUpdateLead } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const leads = getLeads();
    return NextResponse.json({ success: true, leads });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, customerName, address, cityZone, selectedPackage, quantity, source, notes } = body;

    const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: 'কমপক্ষে ১০ বা ১১ ডিজিটের মোবাইল নাম্বার প্রয়োজন।' },
        { status: 400 }
      );
    }

    const result = createOrUpdateLead({
      phone: cleanPhone,
      customerName: customerName ? customerName.trim() : undefined,
      address: address ? address.trim() : undefined,
      cityZone,
      selectedPackage,
      quantity: quantity ? Number(quantity) : 1,
      source: source || 'checkout_lead',
      notes,
    });

    return NextResponse.json({ success: true, lead: result.lead, isNew: result.isNew });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
