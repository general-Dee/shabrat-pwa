"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaTimes, FaWhatsapp, FaShareAlt } from "react-icons/fa";
import { Product } from "@/lib/types";
import { trackLead } from "@/lib/fb-pixel";
import { trackWhatsAppClick } from "@/lib/gtag";
import { supabase } from "@/lib/supabaseClient";
import { getUtmParams } from "@/lib/utm";

const WHATSAPP_NUMBER = "2348165336618";

async function trackOrder(
  productName: string,
  quantity: number,
  totalPrice: number,
  type: 'single' | 'bulk',
  phone?: string,
  utm?: any
) {
  const { error } = await supabase.from('orders').insert({
    product_name: productName,
    quantity: quantity,
    total_price: totalPrice,
    type: type,
    customer_phone: phone || null,
    utm_source: utm?.utm_source,
    utm_medium: utm?.utm_medium,
    utm_campaign: utm?.utm_campaign,
    utm_content: utm?.utm_content,
    utm_term: utm?.utm_term,
  });
  if (error) console.error('Failed to track order:', error);
}

interface Props {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  language: "en" | "ha";
}

const translations = {
  en: {
    order: "Order on WhatsApp",
    quantity: "Quantity",
    close: "Close",
    outOfStock: "Out of Stock",
  },
  ha: {
    order: "Yi oda ta WhatsApp",
    quantity: "Adadi",
    close: "Rufe",
    outOfStock: "Babun kaya",
  },
};

export default function ProductModal({ product, isOpen, onClose, language }: Props) {
  const [quantity, setQuantity] = useState(1);
  const t = translations[language];

  useEffect(() => {
    if (product) {
      const stored = localStorage.getItem("recently_viewed");
      let ids = stored ? JSON.parse(stored) : [];
      ids = [product._id, ...ids.filter((id: string) => id !== product._id)].slice(0, 5);
      localStorage.setItem("recently_viewed", JSON.stringify(ids));
      // Reset quantity when product changes
      setQuantity(1);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const increment = () => {
    if (quantity < product.stock) setQuantity((q) => q + 1);
  };
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const totalPrice = product.price * quantity;

  const generateWhatsAppLink = () => {
    const message = language === "en"
      ? `Hello Shabrat Investment,%0A%0AI would like to order from product detail:%0A📦 *${product.name}*%0A🔢 Quantity: ${quantity} ${product.unit}%0A💰 Total: ₦${totalPrice.toLocaleString()}%0A%0APlease provide payment details and delivery options (Kaduna State).%0A%0AThank you!`
      : `Assalamu alaikum Shabrat Investment,%0A%0AIna son yin oda daga cikakken bayani:%0A📦 *${product.name}*%0A🔢 Adadi: ${quantity} ${product.unit}%0A💰 Jimlar kuɗi: ₦${totalPrice.toLocaleString()}%0A%0ADon Allah ku aiko min da hanyoyin biyan kuɗi da isar da kaya (Jihar Kaduna).%0A%0ANagode!`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  };

  const handleOrder = () => {
    if (product.stock === 0) return;
    const utm = getUtmParams();
    trackLead(product.name, quantity, totalPrice);
    trackWhatsAppClick(product.name, quantity, totalPrice);
    trackOrder(product.name, quantity, totalPrice, 'single', undefined, utm);
    window.open(generateWhatsAppLink(), "_blank");
    onClose();
  };

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on Shabrat Investment – ₦${product.price.toLocaleString()}`,
      url: url,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto m-4" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button onClick={handleShare} className="bg-white rounded-full p-1 shadow">
              <FaShareAlt className="text-gray-600" />
            </button>
            <button onClick={onClose} className="bg-white rounded-full p-1 shadow">
              <FaTimes className="text-gray-600" />
            </button>
          </div>
          <div className="relative h-64 md:h-80 w-full bg-gray-100">
            <Image src={product.imageUrl} alt={product.name} fill className="object-contain p-4" />
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
            <p className="text-sm text-gray-500 mt-1">Category: {product.category.replace(/[^\w\s]/g, '')}</p>
            <div className="mt-2">
              {isOutOfStock ? (
                <span className="text-sm text-red-600 font-semibold">{t.outOfStock}</span>
              ) : product.stock < 10 ? (
                <span className="text-sm text-amber-600 font-semibold">Low Stock ({product.stock} left)</span>
              ) : (
                <span className="text-sm text-green-600 font-semibold">In Stock</span>
              )}
            </div>
            {product.description && (
              <p className="text-gray-600 mt-3">{product.description}</p>
            )}
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-700">₦{product.price.toLocaleString()}</span>
              <span className="text-gray-500">/ {product.unit}</span>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-md bg-white">
                <button onClick={decrement} disabled={isOutOfStock} className="px-3 py-1 text-gray-600 hover:bg-gray-100 text-lg font-bold disabled:opacity-50">−</button>
                <span className="px-4 py-1 text-center w-12 text-base font-medium">{quantity}</span>
                <button onClick={increment} disabled={isOutOfStock || quantity >= product.stock} className="px-3 py-1 text-gray-600 hover:bg-gray-100 text-lg font-bold disabled:opacity-50">+</button>
              </div>
              <button
                onClick={handleOrder}
                disabled={isOutOfStock}
                className={`flex-1 font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 ${
                  isOutOfStock
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                <FaWhatsapp /> {t.order}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}