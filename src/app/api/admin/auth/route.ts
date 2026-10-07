import { NextResponse } from 'next/server';
import { getSettingsAsync } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const isAuthenticated = cookieHeader.includes('admin_session=authenticated');
    return NextResponse.json({ authenticated: isAuthenticated });
  } catch (error: any) {
    return NextResponse.json({ authenticated: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;
    const settings = await getSettingsAsync();

    const validUsername = (process.env.ADMIN_USERNAME || settings.adminUsername || 'admin1').trim().toLowerCase();
    const validPassword = (process.env.ADMIN_PASSWORD || settings.adminPassword || 'adminjhthub1').trim();

    const isUsernameMatch = username ? username.trim().toLowerCase() === validUsername : false;
    const isPasswordMatch = password ? password.trim() === validPassword : false;

    if (isUsernameMatch && isPasswordMatch) {
      const response = NextResponse.json({ success: true, username: validUsername });
      
      // Set long-lived session cookie (10 years for permanent login per device)
      response.cookies.set('admin_session', 'authenticated', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 365 * 10, // 10 years
        path: '/',
        sameSite: 'lax',
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: 'ভুল ইউজারনেম অথবা পাসওয়ার্ড! অনুগ্রহ করে আবার চেষ্টা করুন।' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_session', '', {
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  });
  return response;
}
