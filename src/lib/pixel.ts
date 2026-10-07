/**
 * Safe, robust Facebook Meta Pixel & TikTok Pixel event dispatcher.
 * Handles checks, prevents errors if ad blockers are active,
 * and deduplicates purchase events to ensure 100% accurate ad analytics.
 */

interface TrackProductOptions {
  name?: string;
  price?: number;
  currency?: string;
  quantity?: number;
  orderId?: string;
}

export function trackPageView(): void {
  if (typeof window === 'undefined') return;
  try {
    const win = window as any;
    if (typeof win.fbq === 'function') {
      win.fbq('track', 'PageView');
    }
    if (typeof win.ttq?.page === 'function') {
      win.ttq.page();
    }
  } catch (err) {
    console.warn('[Pixel] PageView error:', err);
  }
}

export function trackViewContent(options?: TrackProductOptions): void {
  if (typeof window === 'undefined') return;
  const name = options?.name || 'স্পেশাল ইলিশের আচার কম্বো ধামাকা অফার';
  const price = options?.price ?? 799;
  const currency = options?.currency || 'BDT';

  try {
    const win = window as any;
    if (typeof win.fbq === 'function') {
      win.fbq('track', 'ViewContent', {
        content_name: name,
        content_category: 'Food & Pickles',
        content_type: 'product',
        value: price,
        currency,
      });
    }
    if (typeof win.ttq?.track === 'function') {
      win.ttq.track('ViewContent', {
        content_name: name,
        content_type: 'product',
        value: price,
        currency,
      });
    }
  } catch (err) {
    console.warn('[Pixel] ViewContent error:', err);
  }
}

export function trackInitiateCheckout(options?: TrackProductOptions): void {
  if (typeof window === 'undefined') return;
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
      win.fbq('track', 'InitiateCheckout', {
        content_name: name,
        content_type: 'product',
        value: price,
        currency,
        num_items: quantity,
      });
    }
    if (typeof win.ttq?.track === 'function') {
      win.ttq.track('InitiateCheckout', {
        content_name: name,
        content_type: 'product',
        value: price,
        currency,
        quantity,
      });
    }
  } catch (err) {
    console.warn('[Pixel] InitiateCheckout error:', err);
  }
}

export function trackPurchase(options: TrackProductOptions): void {
  if (typeof window === 'undefined') return;
  const orderId = options.orderId || 'default';
  const name = options.name || 'স্পেশাল ৩-ইন-১ আচার কম্বো';
  const price = options.price ?? 799;
  const currency = options.currency || 'BDT';
  const quantity = options.quantity ?? 1;

  // Deduplicate purchase tracking per orderId using sessionStorage
  try {
    const storageKey = `jht_pixel_purchase_${orderId}`;
    if (sessionStorage.getItem(storageKey)) {
      return; // Already tracked for this order
    }
    sessionStorage.setItem(storageKey, 'true');
  } catch (_) {
    // Ignore storage availability errors
  }

  try {
    const win = window as any;
    if (typeof win.fbq === 'function') {
      win.fbq('track', 'Purchase', {
        content_name: name,
        content_type: 'product',
        value: price,
        currency,
        num_items: quantity,
        order_id: orderId,
      });
    }
    if (typeof win.ttq?.track === 'function') {
      win.ttq.track('PlaceAnOrder', {
        content_name: name,
        content_type: 'product',
        value: price,
        currency,
        quantity,
        order_id: orderId,
      });
      win.ttq.track('CompletePayment', {
        content_name: name,
        content_type: 'product',
        value: price,
        currency,
        quantity,
        order_id: orderId,
      });
    }
  } catch (err) {
    console.warn('[Pixel] Purchase error:', err);
  }
}
