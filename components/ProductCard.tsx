"use client";
import { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { FaWhatsapp } from "react-icons/fa";
import { Product } from "@/lib/types";
import { trackLead } from "@/lib/fb-pixel";
import { trackWhatsAppClick } from "@/lib/gtag";
import { supabase } from "@/lib/supabaseClient";
import { getUtmParams } from "@/lib/utm";

const WHATSAPP_NUMBER = "2348165336618";

interface Props {
  product: Product;
  language: "en" | "ha";
  priority?: boolean;
  onOpenModal: () => void;
}

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

export default function ProductCard({ product, language, priority = false, onOpenModal }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.imageUrl);

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const generateWhatsAppLink = () => {
    const totalPrice = product.price * quantity;
    const message = language === "en"
      ? `Hello Shabrat Investment,%0A%0AI would like to order:%0A📦 *${product.name}*%0A🔢 Quantity: ${quantity} ${product.unit}%0A💰 Total: ₦${totalPrice.toLocaleString()}%0A%0APlease provide payment details and delivery options (Kaduna State).%0A%0AThank you!`
      : `Assalamu alaikum Shabrat Investment,%0A%0AIna son yin oda:%0A📦 *${product.name}*%0A🔢 Adadi: ${quantity} ${product.unit}%0A💰 Jimlar kuɗi: ₦${totalPrice.toLocaleString()}%0A%0ADon Allah ku aiko min da hanyoyin biyan kuɗi da isar da kaya (Jihar Kaduna).%0A%0ANagode!`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  };

  const handleOrder = () => {
    toast.success(language === "en"
      ? `Added ${quantity} × ${product.name} to WhatsApp order`
      : `An ƙara ${quantity} × ${product.name} cikin oda ta WhatsApp`, {
      position: "bottom-center",
      autoClose: 3000,
      style: { background: "#059669", color: "#fff" },
    });
    const totalPrice = product.price * quantity;
    const utm = getUtmParams();
    trackLead(product.name, quantity, totalPrice);
    trackWhatsAppClick(product.name, quantity, totalPrice);
    trackOrder(product.name, quantity, totalPrice, 'single', undefined, utm);
    window.open(generateWhatsAppLink(), "_blank");
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg flex flex-col h-full overflow-hidden">
      <div className="relative h-48 w-full bg-gray-50 overflow-hidden cursor-pointer" onClick={onOpenModal}>
        {!isImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
            <span className="text-gray-400 text-xs">Loading...</span>
          </div>
        )}
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          priority={priority}
          className={`object-contain p-4 transition-transform duration-500 group-hover:scale-105 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsImageLoaded(true)}
          onError={() => setImgSrc('/placeholder.png')}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 left-2 z-10">
          <span className="inline-block bg-white/90 backdrop-blur-sm text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded shadow-sm">
            {product.category.replace(/[^\w\s]/g, '')}
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-800 text-base line-clamp-2 min-h-[2.5rem] group-hover:text-emerald-700 transition cursor-pointer" onClick={onOpenModal}>
          {product.name}
        </h3>
        <div className="mt-1 text-xs text-gray-500">Unit: {product.unit}</div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-xl font-extrabold text-emerald-700">₦{product.price.toLocaleString()}</span>
          <span className="text-[11px] text-gray-400">/ {product.unit}</span>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex items-center border border-gray-200 rounded-md bg-white">
            <button onClick={decrement} className="px-2 py-1 text-gray-600 hover:bg-gray-100 text-sm font-bold">−</button>
            <span className="px-3 py-1 text-center w-10 text-sm font-medium">{quantity}</span>
            <button onClick={increment} className="px-2 py-1 text-gray-600 hover:bg-gray-100 text-sm font-bold">+</button>
          </div>
          <button
            onClick={handleOrder}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-1.5 px-3 rounded-md transition flex items-center justify-center gap-1"
          >
            <FaWhatsapp size={14} />
            <span>{language === "en" ? "Order" : "Oda"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}