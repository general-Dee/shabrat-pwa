"use client";
import { useState, useMemo, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTruck, FaBox, FaCheckCircle, FaWhatsapp, FaPhoneAlt, FaMapMarkerAlt, FaLanguage, FaSearch, FaTimes } from "react-icons/fa";
import ProductCard from "@/components/ProductCard";
import BackToTop from "@/components/BackToTop";
import BulkOrderModal from "@/components/BulkOrderModal";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { products } from "@/lib/products";

type Language = "en" | "ha";

const translations = {
  en: {
    brandSub: "Bulk food supplies | Kaduna",
    callUs: "Call Us",
    bulkOrder: "Bulk Order",
    heroTitle: "Trusted Supplier of",
    heroTitleSpan: "Premium Consumables",
    heroDesc: "Wholesale & retail – rice, flour, oil, noodles & more. Reliable delivery across Nigeria.",
    freeDelivery: "Free delivery ≥ ₦100k",
    bulkDiscounts: "Bulk discounts",
    nitda: "NITDA Digital Trustmark",
    trustBar: "100% secure ordering | Instant confirmation | 5+ years serving Kaduna",
    noProducts: "No products in this category.",
    footerTagline: "Premium consumables supplier based in Kaduna State, Nigeria.",
    contact: "Contact",
    orderViaWhatsApp: "Order via WhatsApp",
    location: "Location",
    deliveryInfo: "Delivery across Kaduna Metro & surrounding areas.",
    copyright: "© 2025 Shabrat Investment. All rights reserved. Prices subject to change. Free delivery on orders above ₦100,000 within Kaduna Metro.",
    orderBtn: "Order",
    loading: "Loading...",
    searchPlaceholder: "Search products...",
    clearSearch: "Clear",
  },
  ha: {
    brandSub: "Kayan abinci a jumla | Kaduna",
    callUs: "Kira mu",
    bulkOrder: "Oda mai yawa",
    heroTitle: "Aminci Mai Samar da",
    heroTitleSpan: "Kayan Abinci Na Musamman",
    heroDesc: "Jumla da dillali – shinkafa, gari, mai, noodles da sauransu. Isarwa mai aminci a duk faɗin Najeriya.",
    freeDelivery: "Isarwa kyauta sama da ₦100k",
    bulkDiscounts: "Rangwamen jumla",
    nitda: "NITDA Amincewa ta Dijital",
    trustBar: "100% amintaccen oda | Tabbatarwa take | Shekaru 5+ muna hidimar Kaduna",
    noProducts: "Babu kayayyaki a wannan rukuni.",
    footerTagline: "Mai samar da kayan abinci na musamman a Jihar Kaduna, Nijeriya.",
    contact: "Tuntube mu",
    orderViaWhatsApp: "Yi oda ta WhatsApp",
    location: "Wuri",
    deliveryInfo: "Isarwa a cikin Kaduna Metro da kewaye.",
    copyright: "© 2025 Shabrat Investment. Kowane haƙƙi mallake ne. Farashin na iya canzawa. Isarwa kyauta ga oda sama da ₦100,000 a cikin Kaduna Metro.",
    orderBtn: "Oda",
    loading: "Ana lodawa...",
    searchPlaceholder: "Nemo kayayyaki...",
    clearSearch: "Soke",
  },
};

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    const savedLang = localStorage.getItem("shabrat-lang") as Language | null;
    if (savedLang && (savedLang === "en" || savedLang === "ha")) {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    if (!isOnline && typeof window !== "undefined") {
      toast.warn("You are offline. Some features may be limited.", {
        position: "bottom-center",
        autoClose: false,
        toastId: "offline-warning",
      });
    } else {
      toast.dismiss("offline-warning");
    }
  }, [isOnline]);

  const toggleLanguage = () => {
    const newLang = language === "en" ? "ha" : "en";
    setLanguage(newLang);
    localStorage.setItem("shabrat-lang", newLang);
  };

  const t = translations[language];

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(cats)];
  }, []);

  // Filter by category and search term (case‑insensitive)
  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(term));
    }
    return filtered;
  }, [selectedCategory, searchTerm]);

  const handleClearSearch = () => setSearchTerm("");

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-emerald-50/20 to-white">
      <ToastContainer theme="colored" position="bottom-center" autoClose={3000} />
      <BackToTop />
      <BulkOrderModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        products={products}
        language={language}
      />

      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-emerald-800">Shabrat<span className="text-amber-600">Investment</span></h1>
            <p className="text-xs text-gray-500 hidden sm:block">{t.brandSub}</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1.5 rounded-full transition"
              aria-label="Toggle language"
            >
              <FaLanguage />
              <span className="font-medium">{language === "en" ? "Hausa" : "English"}</span>
            </button>
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-3 py-1.5 rounded-full transition"
            >
              <FaBox />
              <span className="font-medium">{t.bulkOrder}</span>
            </button>
            <a href="tel:+2349015751371" className="flex items-center gap-1 text-gray-700 hover:text-emerald-600">
              <FaPhoneAlt className="text-emerald-600" size={12} />
              <span className="hidden sm:inline">{t.callUs}</span>
            </a>
            <a href="https://wa.me/2349015751371" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-full text-sm hover:bg-green-700 transition">
              <FaWhatsapp />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-900 to-emerald-800 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            {t.heroTitle} <span className="text-amber-300">{t.heroTitleSpan}</span>
          </h1>
          <p className="text-lg md:text-xl mt-4 opacity-90 max-w-2xl mx-auto">{t.heroDesc}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              <FaTruck className="text-amber-300" />
              <span>{t.freeDelivery}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              <FaBox className="text-amber-300" />
              <span>{t.bulkDiscounts}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              <FaCheckCircle className="text-amber-300" />
              <span>{t.nitda}</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/10 to-transparent"></div>
      </section>

      <div className="bg-amber-50 border-b border-amber-100 py-2 text-center text-sm text-gray-700">
        <span className="inline-flex items-center gap-2">{t.trustBar}</span>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative max-w-md mx-auto md:mx-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>
          {searchTerm && (
            <div className="text-sm text-gray-500 mt-2 text-center md:text-left">
              Found {filteredProducts.length} product{filteredProducts.length !== 1 && "s"} for "{searchTerm}"
            </div>
          )}
        </div>
      </div>

      {/* Category Filter */}
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

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} language={language} />
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">{t.noProducts}</p>
          </div>
        )}
      </div>

      <footer className="bg-gray-900 text-white pt-10 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-bold text-lg">Shabrat Investment</h3>
              <p className="text-gray-400 text-sm mt-2">{t.footerTagline}</p>
            </div>
            <div>
              <h4 className="font-semibold text-amber-300">{t.contact}</h4>
              <p className="text-gray-400 text-sm mt-2 flex items-center justify-center md:justify-start gap-2"><FaPhoneAlt /> +234 (0) 901 575 1371</p>
              <p className="text-gray-400 text-sm flex items-center justify-center md:justify-start gap-2"><FaWhatsapp /> {t.orderViaWhatsApp}</p>
            </div>
            <div>
              <h4 className="font-semibold text-amber-300">{t.location}</h4>
              <p className="text-gray-400 text-sm mt-2 flex items-center justify-center md:justify-start gap-2"><FaMapMarkerAlt /> Kaduna, Nigeria</p>
              <p className="text-gray-400 text-sm">{t.deliveryInfo}</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-xs">
            {t.copyright}
          </div>
        </div>
      </footer>
    </main>
  );
}