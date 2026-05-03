"use client";
import { useState } from "react";
import { FaTimes, FaWhatsapp } from "react-icons/fa";
import { Product } from "@/lib/products";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  language: "en" | "ha";
}

type Quantities = Record<string, number>;

const translations = {
  en: {
    title: "Bulk Order (Wholesale)",
    subtitle: "Select quantities for products you wish to order",
    product: "Product",
    unit: "Unit",
    price: "Price (₦)",
    qty: "Qty",
    total: "Total",
    send: "Send Bulk Order via WhatsApp",
    cancel: "Cancel",
    totalItems: "Total items",
    totalPrice: "Total price",
    empty: "No items selected. Please add at least one product.",
  },
  ha: {
    title: "Oda mai yawa (Jumla)",
    subtitle: "Zaɓi adadin kayayyakin da kuke son siya",
    product: "Kayan",
    unit: "Nau'in",
    price: "Farashi (₦)",
    qty: "Adadi",
    total: "Jimla",
    send: "Aika Oda mai yawa ta WhatsApp",
    cancel: "Soke",
    totalItems: "Jimlar kayayyaki",
    totalPrice: "Jimlar kuɗi",
    empty: "Ba a zaɓi kayan ba. Da fatan za a ƙara aƙalla kayan guda ɗaya.",
  },
};

export default function BulkOrderModal({ isOpen, onClose, products, language }: Props) {
  const [quantities, setQuantities] = useState<Quantities>({});

  const t = translations[language];

  const updateQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      const newQuantities = { ...quantities };
      delete newQuantities[productId];
      setQuantities(newQuantities);
    } else {
      setQuantities({ ...quantities, [productId]: newQty });
    }
  };

  const selectedProducts = products.filter((p) => quantities[p._id] && quantities[p._id] > 0);
  const totalItems = selectedProducts.reduce((sum, p) => sum + quantities[p._id], 0);
  const totalPrice = selectedProducts.reduce((sum, p) => sum + p.price * quantities[p._id], 0);

  const generateWhatsAppMessage = () => {
    if (selectedProducts.length === 0) return "";
    let message = language === "en"
      ? "Hello Shabrat Investment,%0A%0AI would like to place a BULK ORDER:%0A%0A"
      : "Assalamu alaikum Shabrat Investment,%0A%0AIna son yin ODA MAI YAWA:%0A%0A";

    selectedProducts.forEach((p) => {
      const qty = quantities[p._id];
      message += `📦 ${p.name} × ${qty} ${p.unit} = ₦${(p.price * qty).toLocaleString()}%0A`;
    });
    message += `%0A📊 *Total items:* ${totalItems}%0A💰 *Total price:* ₦${totalPrice.toLocaleString()}%0A%0A`;
    message += language === "en"
      ? "Please provide payment details and delivery options (Kaduna State). Thank you!"
      : "Don Allah ku aiko min da hanyoyin biyan kuɗi da isar da kaya (Jihar Kaduna). Nagode!";
    return `https://wa.me/2349015751371?text=${message}`;
  };

  const handleSend = () => {
    if (selectedProducts.length === 0) {
      alert(t.empty);
      return;
    }
    window.open(generateWhatsAppMessage(), "_blank");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <div>
            <h2 className="text-xl font-bold text-emerald-800">{t.title}</h2>
            <p className="text-sm text-gray-500">{t.subtitle}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Product list (scrollable) */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="text-left p-3">{t.product}</th>
                  <th className="text-left p-3">{t.unit}</th>
                  <th className="text-right p-3">{t.price}</th>
                  <th className="text-center p-3">{t.qty}</th>
                  <th className="text-right p-3">{t.total}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const qty = quantities[product._id] || 0;
                  const total = product.price * qty;
                  return (
                    <tr key={product._id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{product.name}</td>
                      <td className="p-3 text-gray-500">{product.unit}</td>
                      <td className="p-3 text-right">₦{product.price.toLocaleString()}</td>
                      <td className="p-3 text-center">
                        <input
                          type="number"
                          min="0"
                          value={qty}
                          onChange={(e) => updateQuantity(product._id, parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                        />
                      </td>
                      <td className="p-3 text-right font-medium">₦{total.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer summary & buttons */}
        <div className="border-t p-5 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-700">{t.totalItems}: <strong>{totalItems}</strong></span>
            <span className="text-gray-700">{t.totalPrice}: <strong className="text-emerald-700 text-lg">₦{totalPrice.toLocaleString()}</strong></span>
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
              {t.cancel}
            </button>
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <FaWhatsapp /> {t.send}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}