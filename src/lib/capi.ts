import crypto from 'crypto';
import { StoreSettings } from '@/types/landing';

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

export function normalizePhoneForCapi(phone?: string): string | undefined {
  if (!phone) return undefined;
  let digits = phone.replace(/[^0-9]/g, '');
  if (!digits) return undefined;
  if (digits.startsWith('880')) {
    // already starts with 880
  } else if (digits.startsWith('01')) {
    digits = '88' + digits;
  } else if (digits.startsWith('1')) {
    digits = '880' + digits;
  }
  return sha256(digits);
}

export function normalizeNameForCapi(fullName?: string): { fn?: string; ln?: string } {
  if (!fullName) return {};
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { fn: sha256(parts[0]) };
  }
  return {
    fn: sha256(parts[0]),
    ln: sha256(parts.slice(1).join(' ')),
  };
}

export function extractClientIp(headers: Headers): string | undefined {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return (
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    undefined
  );
}

export function extractCookies(headers: Headers): {
  fbp?: string;
  fbc?: string;
  ttp?: string;
  ttclid?: string;
} {
  const cookieHeader = headers.get('cookie') || '';
  let fbp: string | undefined;
  let fbc: string | undefined;
  let ttp: string | undefined;
  let ttclid: string | undefined;

  const matches = cookieHeader.split(';');
  for (const item of matches) {
    const [rawName, rawVal] = item.trim().split('=');
    const name = rawName?.trim();
    const val = rawVal?.trim();
    if (name === '_fbp') fbp = val;
    if (name === '_fbc') fbc = val;
    if (name === '_ttp') ttp = val;
    if (name === 'ttclid') ttclid = val;
  }

  return { fbp, fbc, ttp, ttclid };
}

// ============================================================================
// META (FACEBOOK) CONVERSIONS API (CAPI)
// ============================================================================

export interface MetaCapiEventParams {
  eventName: 'Purchase' | 'InitiateCheckout' | 'ViewContent' | 'PageView' | 'Lead';
  eventId: string;
  eventSourceUrl?: string;
  customerName?: string;
  phone?: string;
  value?: number;
  currency?: string;
  contentName?: string;
  numItems?: number;
  orderId?: string;
  headers?: Headers;
  settings: StoreSettings;
}

export async function sendMetaCapiEvent(params: MetaCapiEventParams): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  const { settings } = params;
  const pixelId = (settings.metaPixelId || '').trim();
  const capiToken = (settings.fbCapiToken || '').trim();
  const enabled = settings.fbCapiEnabled !== false;

  if (!enabled || !pixelId || !capiToken) {
    return { success: false, error: 'Meta Conversion API is not configured or disabled' };
  }

  try {
    const headers = params.headers;
    const clientIp = headers ? extractClientIp(headers) : undefined;
    const userAgent = headers ? headers.get('user-agent') || undefined : undefined;
    const cookies = headers ? extractCookies(headers) : {};

    const hashedPhone = normalizePhoneForCapi(params.phone);
    const { fn: hashedFn, ln: hashedLn } = normalizeNameForCapi(params.customerName);

    const userData: Record<string, any> = {
      country: [sha256('bd')],
    };

    if (clientIp) userData.client_ip_address = clientIp;
    if (userAgent) userData.client_user_agent = userAgent;
    if (cookies.fbp) userData.fbp = cookies.fbp;
    if (cookies.fbc) userData.fbc = cookies.fbc;
    if (hashedPhone) userData.ph = [hashedPhone];
    if (hashedFn) userData.fn = [hashedFn];
    if (hashedLn) userData.ln = [hashedLn];

    const customData: Record<string, any> = {
      currency: params.currency || 'BDT',
      value: params.value ?? 799,
      content_name: params.contentName || 'স্পেশাল ইলিশের আচার কম্বো ধামাকা অফার',
      content_type: 'product',
    };

    if (params.numItems) customData.num_items = params.numItems;
    if (params.orderId) customData.order_id = params.orderId;

    const eventPayload: Record<string, any> = {
      event_name: params.eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: params.eventId,
      event_source_url: params.eventSourceUrl || 'https://jhtfood.vercel.app',
      action_source: 'website',
      user_data: userData,
      custom_data: customData,
    };

    const requestBody: Record<string, any> = {
      data: [eventPayload],
    };

    // Include test event code if provided in admin
    const testCode = (settings.fbTestEventCode || '').trim();
    if (testCode) {
      requestBody.test_event_code = testCode;
    }

    const endpoint = `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${capiToken}`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const result = await res.json();

    if (!res.ok) {
      console.warn('[Meta CAPI Warning]:', result);
      return { success: false, error: result?.error?.message || 'Meta CAPI request failed', data: result };
    }

    return { success: true, data: result };
  } catch (err: any) {
    console.error('[Meta CAPI Error]:', err);
    return { success: false, error: err.message };
  }
}

// ============================================================================
// TIKTOK EVENTS API (SERVER-SIDE TRACKING)
// ============================================================================

export interface TikTokCapiEventParams {
  eventName: 'CompletePayment' | 'PlaceAnOrder' | 'InitiateCheckout' | 'ViewContent' | 'Pageview';
  eventId: string;
  eventSourceUrl?: string;
  phone?: string;
  value?: number;
  currency?: string;
  contentName?: string;
  numItems?: number;
  orderId?: string;
  headers?: Headers;
  settings: StoreSettings;
}

export async function sendTikTokCapiEvent(params: TikTokCapiEventParams): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  const { settings } = params;
  const pixelId = (settings.tiktokPixelId || '').trim();
  const capiToken = (settings.tiktokCapiToken || '').trim();
  const enabled = settings.tiktokCapiEnabled !== false;

  if (!enabled || !pixelId || !capiToken) {
    return { success: false, error: 'TikTok Events API is not configured or disabled' };
  }

  try {
    const headers = params.headers;
    const clientIp = headers ? extractClientIp(headers) : undefined;
    const userAgent = headers ? headers.get('user-agent') || undefined : undefined;
    const cookies = headers ? extractCookies(headers) : {};

    const hashedPhone = normalizePhoneForCapi(params.phone);

    const userObj: Record<string, any> = {};
    if (hashedPhone) userObj.phone = hashedPhone;
    if (clientIp) userObj.ip = clientIp;
    if (userAgent) userObj.user_agent = userAgent;
    if (cookies.ttp) userObj.ttp = cookies.ttp;
    if (cookies.ttclid) userObj.ttclid = cookies.ttclid;

    const eventPayload: Record<string, any> = {
      event: params.eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: params.eventId,
      user: userObj,
      properties: {
        currency: params.currency || 'BDT',
        value: params.value ?? 799,
        contents: [
          {
            price: params.value ?? 799,
            quantity: params.numItems || 1,
            content_name: params.contentName || 'স্পেশাল ইলিশের আচার কম্বো ধামাকা অফার',
            content_type: 'product',
          },
        ],
      },
    };

    const requestBody: Record<string, any> = {
      event_source: 'web',
      event_source_id: pixelId,
      data: [eventPayload],
    };

    const testCode = (settings.tiktokTestEventCode || '').trim();
    if (testCode) {
      requestBody.test_event_code = testCode;
    }

    const endpoint = 'https://business-api.tiktok.com/open_api/v1.3/event/track/';

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Access-Token': capiToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const result = await res.json();

    if (!res.ok || result?.code !== 0) {
      console.warn('[TikTok CAPI Warning]:', result);
      return { success: false, error: result?.message || 'TikTok Events API error', data: result };
    }

    return { success: true, data: result };
  } catch (err: any) {
    console.error('[TikTok CAPI Error]:', err);
    return { success: false, error: err.message };
  }
}
