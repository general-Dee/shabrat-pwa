"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import AdminGuard from "@/components/AdminGuard";
import AdminCharts from "@/components/AdminCharts";
import AdminReports from "@/components/AdminReports";
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaUpload } from "react-icons/fa";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  unit: string;
  image_url: string;
  description?: string;
  stock: number;
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: 0,
    unit: "",
    image_url: "",
    description: "",
    stock: 0,
  });

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase.from("products").select("*").order("name");
    if (error) console.error("Fetch products error:", error);
    else setProducts(data || []);
    setLoading(false);
  }

  async function fetchOrders() {
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (error) console.error("Fetch orders error:", error);
    else setOrders(data || []);
  }

  async function uploadImage(file: File): Promise<string> {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/cloudinary/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setUploading(false);
    if (data.url) return data.url;
    throw new Error("Upload failed");
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert("Delete failed: " + error.message);
    } else {
      fetchProducts();
    }
  }

  async function handleUpdate() {
    if (!editingProduct) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("products")
        .update({
          name: editingProduct.name,
          category: editingProduct.category,
          price: editingProduct.price,
          unit: editingProduct.unit,
          stock: editingProduct.stock,
          image_url: editingProduct.image_url,
          description: editingProduct.description,
        })
        .eq("id", editingProduct.id);
      if (error) {
        alert("Update failed: " + error.message);
        console.error(error);
      } else {
        setEditingProduct(null);
        await fetchProducts(); // refresh list
      }
    } catch (err: any) {
      alert("Unexpected error: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleAdd() {
    if (!newProduct.name || !newProduct.category || newProduct.price <= 0) {
      alert("Please fill name, category and price.");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("products").insert([newProduct]);
      if (error) {
        alert("Add failed: " + error.message);
      } else {
        setShowAddForm(false);
        setNewProduct({ name: "", category: "", price: 0, unit: "", image_url: "", description: "", stock: 0 });
        await fetchProducts();
      }
    } catch (err: any) {
      alert("Unexpected error: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  const handleImageUpload = async (file: File, isEdit: boolean) => {
    try {
      const url = await uploadImage(file);
      if (isEdit && editingProduct) {
        setEditingProduct({ ...editingProduct, image_url: url });
      } else {
        setNewProduct({ ...newProduct, image_url: url });
      }
    } catch (err) {
      alert("Image upload failed");
    }
  };

  const exportToCSV = () => {
    if (orders.length === 0) return;
    const headers = ["ID", "Product", "Quantity", "Total (₦)", "Type", "Phone", "Status", "Date", "Source", "Medium", "Campaign", "Content", "Term"];
    const rows = orders.map(o => [
      o.id,
      o.product_name || "Bulk",
      o.quantity,
      o.total_price,
      o.type,
      o.customer_phone || "",
      o.status,
      new Date(o.created_at).toLocaleString(),
      o.utm_source || "",
      o.utm_medium || "",
      o.utm_campaign || "",
      o.utm_content || "",
      o.utm_term || "",
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <button
              onClick={() => supabase.auth.signOut()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>

          <AdminReports />
          <AdminCharts />

          {/* Products Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Products</h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-emerald-600 text-white px-3 py-1 rounded flex items-center gap-1"
              >
                <FaPlus /> Add Product
              </button>
            </div>

            {showAddForm && (
              <div className="mb-6 p-4 border rounded bg-gray-50">
                <h3 className="font-bold mb-2">New Product</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" placeholder="Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="border p-2 rounded" />
                  <input type="text" placeholder="Category" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="border p-2 rounded" />
                  <input type="number" placeholder="Price" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) || 0 })} className="border p-2 rounded" />
                  <input type="text" placeholder="Unit" value={newProduct.unit} onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })} className="border p-2 rounded" />
                  <input type="number" placeholder="Stock" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })} className="border p-2 rounded" />
                  <textarea placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="border p-2 rounded col-span-2" rows={2} />
                  <div className="col-span-2">
                    <div className="flex gap-2 items-center">
                      <input type="text" placeholder="Image URL" value={newProduct.image_url} onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })} className="border p-2 rounded flex-1" />
                      <label className="bg-blue-600 text-white px-3 py-2 rounded cursor-pointer hover:bg-blue-700 flex items-center gap-1">
                        <FaUpload /> Upload
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], false)} />
                      </label>
                      {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={handleAdd} disabled={saving} className="bg-emerald-600 text-white px-3 py-1 rounded flex items-center gap-1">
                    <FaSave /> {saving ? "Saving..." : "Save"}
                  </button>
                  <button onClick={() => setShowAddForm(false)} className="bg-gray-400 text-white px-3 py-1 rounded flex items-center gap-1"><FaTimes /> Cancel</button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Category</th>
                    <th className="p-2 text-right">Price</th>
                    <th className="p-2 text-left">Unit</th>
                    <th className="p-2 text-right">Stock</th>
                    <th className="p-2 text-left">Image</th>
                    <th className="p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b">
                      {editingProduct?.id === p.id ? (
                        <>
                          <td className="p-2">{p.id}</td>
                          <td className="p-2"><input value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} className="border p-1 rounded w-full" /></td>
                          <td className="p-2"><input value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} className="border p-1 rounded w-full" /></td>
                          <td className="p-2"><input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value) || 0 })} className="border p-1 rounded w-24" /></td>
                          <td className="p-2"><input value={editingProduct.unit} onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })} className="border p-1 rounded w-full" /></td>
                          <td className="p-2"><input type="number" value={editingProduct.stock} onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })} className="border p-1 rounded w-20" /></td>
                          <td className="p-2">
                            <div className="flex gap-1 items-center">
                              <input value={editingProduct.image_url} onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })} className="border p-1 rounded w-32 text-xs" />
                              <label className="bg-blue-600 text-white p-1 rounded cursor-pointer text-xs">
                                <FaUpload size={12} />
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], true)} />
                              </label>
                            </div>
                          </td>
                          <td className="p-2 text-center">
                            <button onClick={handleUpdate} disabled={saving} className="text-green-600 mr-2"><FaSave /></button>
                            <button onClick={() => setEditingProduct(null)} className="text-gray-600"><FaTimes /></button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-2">{p.id}</td>
                          <td className="p-2">{p.name}</td>
                          <td className="p-2">{p.category}</td>
                          <td className="p-2 text-right">₦{p.price.toLocaleString()}</td>
                          <td className="p-2">{p.unit}</td>
                          <td className="p-2 text-right">{p.stock}</td>
                          <td className="p-2">
                            {p.image_url ? (
                              <img src={p.image_url} alt={p.name} className="w-8 h-8 object-cover rounded" />
                            ) : (
                              <span className="text-gray-400 text-xs">No image</span>
                            )}
                          </td>
                          <td className="p-2 text-center">
                            <button onClick={() => setEditingProduct(p)} className="text-blue-600 mr-2"><FaEdit /></button>
                            <button onClick={() => handleDelete(p.id)} className="text-red-600"><FaTrash /></button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Orders Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">WhatsApp Orders</h2>
              <button
                onClick={exportToCSV}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                Export to CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Product</th>
                    <th className="p-2 text-right">Qty</th>
                    <th className="p-2 text-right">Total (₦)</th>
                    <th className="p-2 text-left">Type</th>
                    <th className="p-2 text-left">Phone</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Source</th>
                    <th className="p-2 text-left">Medium</th>
                    <th className="p-2 text-left">Campaign</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b">
                      <td className="p-2">{new Date(o.created_at).toLocaleString()}</td>
                      <td className="p-2">{o.product_name || "Bulk"}</td>
                      <td className="p-2 text-right">{o.quantity}</td>
                      <td className="p-2 text-right">{o.total_price?.toLocaleString()}</td>
                      <td className="p-2">{o.type}</td>
                      <td className="p-2">{o.customer_phone || "-"}</td>
                      <td className="p-2">{o.status}</td>
                      <td className="p-2">{o.utm_source || "-"}</td>
                      <td className="p-2">{o.utm_medium || "-"}</td>
                      <td className="p-2">{o.utm_campaign || "-"}</td>
                    </tr>
                  ))}
                  {orders.length === 0 && <tr><td colSpan={10} className="p-4 text-center text-gray-500">No orders yet</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}