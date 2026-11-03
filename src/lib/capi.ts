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

export function extractCookies(headers: Headers): { fbp?: string; fbc?: string } {
  const cookieHeader = headers.get('cookie') || '';
  let fbp: string | undefined;
  let fbc: string | undefined;

  const matches = cookieHeader.split(';');
  for (const item of matches) {
    const [name, val] = item.trim().split('=');
    if (name === '_fbp') fbp = val;
    if (name === '_fbc') fbc = val;
  }

  return { fbp, fbc };
}

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
    return { success: false, error: 'Conversion API is not configured or disabled' };
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

    // If Test Event Code is provided, include it in the root payload for Meta Events Manager testing
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
