"use client";
import { useState, useMemo } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTruck, FaBox, FaCheckCircle, FaWhatsapp, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import ProductCard from "@/components/ProductCard";
import BackToTop from "@/components/BackToTop";
import { products } from "@/lib/products";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(cats)];
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-emerald-50/20 to-white">
      <ToastContainer theme="colored" position="bottom-center" autoClose={3000} />
      <BackToTop />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-emerald-800">Shabrat<span className="text-amber-600">Investment</span></h1>
            <p className="text-xs text-gray-500 hidden sm:block">Bulk food supplies | Kaduna</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a href="tel:+2348123456789" className="flex items-center gap-1 text-gray-700 hover:text-emerald-600">
              <FaPhoneAlt className="text-emerald-600" size={12} />
              <span className="hidden sm:inline">Call Us</span>
            </a>
            <a href="https://wa.me/2348012345678" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-full text-sm hover:bg-green-700 transition">
              <FaWhatsapp />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section – refined with better spacing */}
      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-900 to-emerald-800 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Trusted Supplier of <span className="text-amber-300">Premium Consumables</span></h1>
          <p className="text-lg md:text-xl mt-4 opacity-90 max-w-2xl mx-auto">Wholesale & retail – rice, flour, oil, noodles & more. Reliable delivery across Kaduna State.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              <FaTruck className="text-amber-300" />
              <span>Free delivery ≥ ₦100k</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              <FaBox className="text-amber-300" />
              <span>Bulk discounts</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              <FaCheckCircle className="text-amber-300" />
              <span>NITDA Digital Trustmark</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/10 to-transparent"></div>
      </section>

      {/* Trust Bar */}
      <div className="bg-amber-50 border-b border-amber-100 py-2 text-center text-sm text-gray-700">
        <span className="inline-flex items-center gap-2"><FaCheckCircle className="text-emerald-600" /> 100% secure ordering &nbsp;|&nbsp; <FaWhatsapp className="text-green-600" /> Instant confirmation &nbsp;|&nbsp; 🏆 5+ years serving Kaduna</span>
      </div>

      {/* Category Filter – horizontal scroll on mobile */}
      <div className="sticky top-[57px] z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 py-3 px-4">
        <div className="max-w-7xl mx-auto overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.replace(/[^\w\s]/g, '')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No products in this category.</p>
          </div>
        )}
      </div>

      {/* Footer with business details */}
      <footer className="bg-gray-900 text-white pt-10 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-bold text-lg">Shabrat Investment</h3>
              <p className="text-gray-400 text-sm mt-2">Premium consumables supplier based in Kaduna State, Nigeria.</p>
            </div>
            <div>
              <h4 className="font-semibold text-amber-300">Contact</h4>
              <p className="text-gray-400 text-sm mt-2 flex items-center justify-center md:justify-start gap-2"><FaPhoneAlt /> +234 (0) 812 345 6789</p>
              <p className="text-gray-400 text-sm flex items-center justify-center md:justify-start gap-2"><FaWhatsapp /> Order via WhatsApp</p>
            </div>
            <div>
              <h4 className="font-semibold text-amber-300">Location</h4>
              <p className="text-gray-400 text-sm mt-2 flex items-center justify-center md:justify-start gap-2"><FaMapMarkerAlt /> Kaduna, Nigeria</p>
              <p className="text-gray-400 text-sm">Delivery across Kaduna Metro & surrounding areas.</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-xs">
            © 2025 Shabrat Investment. All rights reserved. Prices subject to change. Free delivery on orders above ₦100,000 within Kaduna Metro.
          </div>
        </div>
      </footer>
    </main>
  );
}