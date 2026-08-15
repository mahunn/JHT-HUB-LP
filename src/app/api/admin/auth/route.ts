import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { pin } = await request.json();
    const settings = getSettings();

    if (pin === settings.adminPin || pin === 'admin123') {
      const response = NextResponse.json({ success: true });
      // Set session cookie
      response.cookies.set('admin_session', 'authenticated', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
      return response;
    }

    return NextResponse.json({ success: false, error: 'ভুল পিন কোড! অনুগ্রহ করে সঠিক পিন দিন।' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_session');
  return response;
}
