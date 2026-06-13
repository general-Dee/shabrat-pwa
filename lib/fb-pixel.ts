// lib/fb-pixel.ts
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || 'YOUR_PIXEL_ID';

declare global {
  interface Window {
    fbq: any;
  }
}

export const pageview = () => {
  if (typeof window.fbq !== 'undefined') {
    window.fbq('track', 'PageView');
  }
};

export const event = (name: string, options = {}) => {
  if (typeof window.fbq !== 'undefined') {
    window.fbq('track', name, options);
  }
};

export const trackLead = (contentName?: string, quantity?: number, totalPrice?: number) => {
  event('Lead', {
    content_name: contentName,
    quantity: quantity,
    value: totalPrice,
    currency: 'NGN',
  });
};
