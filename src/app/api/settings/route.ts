import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSettingsAsync, updateSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getSettingsAsync();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updated = updateSettings(body);
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
      revalidatePath('/admin');
      revalidatePath('/admin/settings');
    } catch (e) {}
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
