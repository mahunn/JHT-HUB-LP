/**
 * Safe, robust Facebook Meta Pixel & TikTok Pixel event dispatcher.
 * Handles checks, prevents errors if ad blockers are active,
 * integrates with Meta Conversions API (CAPI) & TikTok Events API,
 * and deduplicates purchase events with matching eventID.
 */

export interface TrackProductOptions {
  name?: string;
  price?: number;
  currency?: string;
  quantity?: number;
  orderId?: string;
  eventId?: string;
  customerName?: string;
  phone?: string;
}

function dispatchCapi(
  eventName: 'Purchase' | 'InitiateCheckout' | 'ViewContent' | 'PageView',
  eventId: string,
  options?: TrackProductOptions
) {
  if (typeof window === 'undefined') return;
  try {
    fetch('/api/capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName,
        eventId,
        eventSourceUrl: window.location.href,
        customerName: options?.customerName,
        phone: options?.phone,
        value: options?.price,
        currency: options?.currency || 'BDT',
        contentName: options?.name,
        numItems: options?.quantity,
        orderId: options?.orderId,
      }),
    }).catch(() => {});
  } catch {
    // Ignore CAPI silent dispatch errors
  }
}

export function trackPageView(eventId?: string): void {
  if (typeof window === 'undefined') return;
  const eid = eventId || `pv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  try {
    const win = window as any;
    if (typeof win.fbq === 'function') {
      win.fbq('track', 'PageView', {}, { eventID: eid });
    }
    if (typeof win.ttq?.page === 'function') {
      win.ttq.page();
    }
    dispatchCapi('PageView', eid);
  } catch (err) {
    console.warn('[Pixel] PageView error:', err);
  }
}

export function trackViewContent(options?: TrackProductOptions): void {
  if (typeof window === 'undefined') return;
  const eid = options?.eventId || `vc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const name = options?.name || 'স্পেশাল ইলিশের আচার কম্বো ধামাকা অফার';
  const price = options?.price ?? 799;
  const currency = options?.currency || 'BDT';

  try {
    const win = window as any;
    if (typeof win.fbq === 'function') {
      win.fbq(
        'track',
        'ViewContent',
        {
          content_name: name,
          content_category: 'Food & Pickles',
          content_type: 'product',
          value: price,
          currency,
        },
        { eventID: eid }
      );
    }
    if (typeof win.ttq?.track === 'function') {
      win.ttq.track(
        'ViewContent',
        {
          content_name: name,
          content_type: 'product',
          value: price,
          currency,
        },
        { event_id: eid }
      );
    }
    dispatchCapi('ViewContent', eid, { ...options, name, price, currency });
  } catch (err) {
    console.warn('[Pixel] ViewContent error:', err);
  }
}

export function trackInitiateCheckout(options?: TrackProductOptions): void {
  if (typeof window === 'undefined') return;
  const eid = options?.eventId || `ic_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const name = options?.name || 'স্পেশাল ৩-ইন-১ আচার কম্বো';
  const price = options?.price ?? 799;
  const currency = options?.currency || 'BDT';
  const quantity = options?.quantity ?? 1;

  // Prevent firing multiple InitiateCheckout calls in the same session within 10 seconds
  const now = Date.now();
  const lastFired = (window as any).__lastInitiateCheckoutFired || 0;
  if (now - lastFired < 10000) return;
  (window as any).__lastInitiateCheckoutFired = now;

  try {
    const win = window as any;
    if (typeof win.fbq === 'function') {
      win.fbq(
        'track',
        'InitiateCheckout',
        {
          content_name: name,
          content_type: 'product',
          value: price,
          currency,
          num_items: quantity,
        },
        { eventID: eid }
      );
    }
    if (typeof win.ttq?.track === 'function') {
      win.ttq.track(
        'InitiateCheckout',
        {
          content_name: name,
          content_type: 'product',
          value: price,
          currency,
          quantity,
        },
        { event_id: eid }
      );
    }
    dispatchCapi('InitiateCheckout', eid, { ...options, name, price, currency, quantity });
  } catch (err) {
    console.warn('[Pixel] InitiateCheckout error:', err);
  }
}

export function trackPurchase(options: TrackProductOptions): void {
  if (typeof window === 'undefined') return;
  const orderId = options.orderId || 'default';
  const eid = options.eventId || options.orderId || `pur_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const name = options.name || 'স্পেশাল ৩-ইন-১ আচার কম্বো';
  const price = options.price ?? 799;
  const currency = options.currency || 'BDT';
  const quantity = options.quantity ?? 1;

  // Deduplicate purchase tracking per orderId using sessionStorage
  try {
    const storageKey = `jht_pixel_purchase_${orderId}`;
    if (sessionStorage.getItem(storageKey)) {
      return; // Already tracked for this order in browser
    }
    sessionStorage.setItem(storageKey, 'true');
  } catch (_) {
    // Ignore storage availability errors
  }

  try {
    const win = window as any;
    if (typeof win.fbq === 'function') {
      win.fbq(
        'track',
        'Purchase',
        {
          content_name: name,
          content_type: 'product',
          value: price,
          currency,
          num_items: quantity,
          order_id: orderId,
        },
        { eventID: eid }
      );
    }
    if (typeof win.ttq?.track === 'function') {
      win.ttq.track(
        'PlaceAnOrder',
        {
          content_name: name,
          content_type: 'product',
          value: price,
          currency,
          quantity,
          order_id: orderId,
        },
        { event_id: eid }
      );
      win.ttq.track(
        'CompletePayment',
        {
          content_name: name,
          content_type: 'product',
          value: price,
          currency,
          quantity,
          order_id: orderId,
        },
        { event_id: eid }
      );
    }
  } catch (err) {
    console.warn('[Pixel] Purchase error:', err);
  }
}
