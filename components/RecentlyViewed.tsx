"use client";
import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import Image from "next/image";
import { FaEye } from "react-icons/fa";

interface Props {
  products: Product[];
  language: "en" | "ha";
  onProductClick: (product: Product) => void;
}

const translations = {
  en: { title: "Recently Viewed" },
  ha: { title: "Abubuwan da Kuka Kalla" },
};

export default function RecentlyViewed({ products, language, onProductClick }: Props) {
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const t = translations[language];

  useEffect(() => {
    const stored = localStorage.getItem("recently_viewed");
    if (stored) setRecentIds(JSON.parse(stored));
  }, []);

  const recentProducts = products.filter(p => recentIds.includes(p._id)).slice(0, 5);
  if (recentProducts.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FaEye className="text-emerald-600" /> {t.title}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {recentProducts.map((product) => (
          <div
            key={product._id}
            onClick={() => onProductClick(product)}
            className="cursor-pointer bg-white rounded-lg border p-2 hover:shadow-md transition"
          >
            <div className="relative h-24 w-full bg-gray-100 rounded">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-contain p-1"
              />
            </div>
            <p className="text-xs font-medium mt-1 line-clamp-1">{product.name}</p>
            <p className="text-xs text-emerald-700">₦{product.price.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}