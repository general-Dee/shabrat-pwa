// lib/gtag.ts
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const pageview = (url: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

export const event = (action: string, params?: Record<string, any>) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, params);
  }
};

export const trackWhatsAppClick = (productName: string, quantity: number, totalPrice: number) => {
  event('generate_lead', {
    event_category: 'WhatsApp',
    event_label: productName,
    value: totalPrice,
    currency: 'NGN',
    quantity: quantity,
  });
};

export const trackBulkOrder = (itemCount: number, totalPrice: number) => {
  event('generate_lead', {
    event_category: 'WhatsApp_Bulk',
    event_label: 'Bulk Order',
    value: totalPrice,
    currency: 'NGN',
    items_count: itemCount,
  });
};