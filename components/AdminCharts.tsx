"use client";
import { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { supabase } from "@/lib/supabaseClient";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface Order {
  id: number;
  total_price: number;
  created_at: string;
  product_name: string;
}

export default function AdminCharts() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const { data } = await supabase.from("orders").select("*").order("created_at");
    if (data) setOrders(data);
    setLoading(false);
  }

  if (loading) return <div className="text-center py-4">Loading charts...</div>;

  // Prepare data for last 7 days
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  }).reverse();

  const dailyRevenue = last7Days.map(date => {
    const dayOrders = orders.filter(o => o.created_at?.startsWith(date));
    return dayOrders.reduce((sum, o) => sum + (o.total_price || 0), 0);
  });

  const barData = {
    labels: last7Days,
    datasets: [
      {
        label: "Revenue (₦)",
        data: dailyRevenue,
        backgroundColor: "rgba(5, 150, 105, 0.6)",
        borderColor: "rgb(5, 150, 105)",
        borderWidth: 1,
      },
    ],
  };

  // Top 5 products by order count
  const productCounts: Record<string, number> = {};
  orders.forEach(o => {
    const name = o.product_name || "Bulk";
    productCounts[name] = (productCounts[name] || 0) + 1;
  });
  const topProducts = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const doughnutData = {
    labels: topProducts.map(p => p[0]),
    datasets: [
      {
        label: "Orders",
        data: topProducts.map(p => p[1]),
        backgroundColor: ["#059669", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0"],
      },
    ],
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_price || 0), 0);
  const totalOrders = orders.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Summary Cards */}
      <div className="bg-emerald-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
        <p className="text-3xl font-bold text-emerald-700">{totalOrders}</p>
      </div>
      <div className="bg-emerald-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-600">Total Revenue (₦)</h3>
        <p className="text-3xl font-bold text-emerald-700">{totalRevenue.toLocaleString()}</p>
      </div>

      {/* Daily Revenue Chart */}
      <div className="md:col-span-2 bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Daily Revenue (Last 7 Days)</h3>
        <Bar data={barData} />
      </div>

      {/* Top Products Doughnut */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Top Products (by orders)</h3>
        <Doughnut data={doughnutData} />
      </div>
    </div>
  );
}