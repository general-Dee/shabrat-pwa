"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Order {
  id: number;
  total_price: number;
  created_at: string;
  product_name: string;
  utm_campaign: string | null;
}

export default function AdminReports() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [campaignFilter, setCampaignFilter] = useState("");
  const [productsList, setProductsList] = useState<{ name: string }[]>([]);
  const [campaignsList, setCampaignsList] = useState<string[]>([]);

  useEffect(() => {
    fetchOrders();
    fetchProductsAndCampaigns();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [startDate, endDate, productFilter, campaignFilter]);

  async function fetchOrders() {
    let query = supabase.from("orders").select("*").order("created_at", { ascending: true });
    if (startDate) query = query.gte("created_at", startDate);
    if (endDate) query = query.lte("created_at", endDate + "T23:59:59");
    if (productFilter) query = query.eq("product_name", productFilter);
    if (campaignFilter) query = query.eq("utm_campaign", campaignFilter);
    const { data } = await query;
    if (data) setOrders(data);
  }

  async function fetchProductsAndCampaigns() {
    const { data: products } = await supabase.from("products").select("name");
    if (products) setProductsList(products);
    const { data: campaigns } = await supabase.from("orders").select("utm_campaign").not("utm_campaign", "is", null);
    if (campaigns) {
      const unique = [...new Set(campaigns.map(c => c.utm_campaign).filter(Boolean))] as string[];
      setCampaignsList(unique);
    }
  }

  const revenueByDay: Record<string, number> = {};
  orders.forEach(o => {
    const day = o.created_at.split("T")[0];
    revenueByDay[day] = (revenueByDay[day] || 0) + (o.total_price || 0);
  });
  const labels = Object.keys(revenueByDay).sort();
  const revenueData = labels.map(l => revenueByDay[l]);

  const barData = {
    labels,
    datasets: [
      {
        label: "Revenue (₦)",
        data: revenueData,
        backgroundColor: "rgba(5, 150, 105, 0.6)",
      },
    ],
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_price || 0), 0);
  const totalOrders = orders.length;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4">Advanced Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Product</label>
          <select value={productFilter} onChange={(e) => setProductFilter(e.target.value)} className="border p-2 rounded w-full">
            <option value="">All Products</option>
            {productsList.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Campaign</label>
          <select value={campaignFilter} onChange={(e) => setCampaignFilter(e.target.value)} className="border p-2 rounded w-full">
            <option value="">All Campaigns</option>
            {campaignsList.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-emerald-50 p-4 rounded">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold">₦{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-emerald-50 p-4 rounded">
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>
      </div>
      <Bar data={barData} />
    </div>
  );
}