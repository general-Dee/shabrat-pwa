"use client";
import { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { FaWhatsapp } from "react-icons/fa";
import { Product, getProductImage } from "@/lib/products";

const WHATSAPP_NUMBER = "2348012345678"; // ← Replace with real number

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const generateWhatsAppLink = () => {
    const totalPrice = product.price * quantity;
    const message = `Hello Shabrat Investment,%0A%0AI would like to order:%0A📦 *${product.name}*%0A🔢 Quantity: ${quantity} ${product.unit}%0A💰 Total: ₦${totalPrice.toLocaleString()}%0A%0APlease provide payment details and delivery options (Kaduna State).%0A%0AThank you!`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  };

  const handleOrder = () => {
    toast.success(`Added ${quantity} × ${product.name} to WhatsApp order`, {
      position: "bottom-center",
      autoClose: 3000,
      style: { background: "#059669", color: "#fff" },
    });
    window.open(generateWhatsAppLink(), "_blank");
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg flex flex-col h-full overflow-hidden">
      {/* Image */}
      <div className="relative h-48 w-full bg-gray-50 overflow-hidden">
        {!isImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
            <span className="text-gray-400 text-xs">Loading...</span>
          </div>
        )}
        <Image
          src={getProductImage(product)}
          alt={product.name}
          fill
          className={`object-contain p-4 transition-transform duration-500 group-hover:scale-105 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsImageLoaded(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Category tag */}
        <div className="absolute top-2 left-2 z-10">
          <span className="inline-block bg-white/90 backdrop-blur-sm text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded shadow-sm">
            {product.category.replace(/[^\w\s]/g, '')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-800 text-base line-clamp-2 min-h-[2.5rem] group-hover:text-emerald-700 transition">
          {product.name}
        </h3>
        <div className="mt-1 text-xs text-gray-500">Unit: {product.unit}</div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-xl font-extrabold text-emerald-700">₦{product.price.toLocaleString()}</span>
          <span className="text-[11px] text-gray-400">/ {product.unit}</span>
        </div>

        {/* Quantity selector and button */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex items-center border border-gray-200 rounded-md bg-white">
            <button
              onClick={decrement}
              className="px-2 py-1 text-gray-600 hover:bg-gray-100 text-sm font-bold"
            >
              −
            </button>
            <span className="px-3 py-1 text-center w-10 text-sm font-medium">{quantity}</span>
            <button
              onClick={increment}
              className="px-2 py-1 text-gray-600 hover:bg-gray-100 text-sm font-bold"
            >
              +
            </button>
          </div>
          <button
            onClick={handleOrder}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-1.5 px-3 rounded-md transition flex items-center justify-center gap-1"
          >
            <FaWhatsapp size={14} />
            <span>Order</span>
          </button>
        </div>
      </div>
    </div>
  );
}