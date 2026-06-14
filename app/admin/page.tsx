"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import AdminGuard from "@/components/AdminGuard";
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from "react-icons/fa";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  unit: string;
  image_url: string;
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: 0,
    unit: "",
    image_url: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from("products").select("*").order("name");
    if (data) setProducts(data);
    setLoading(false);
  }

  async function fetchOrders() {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (data) setOrders(data);
  }

  async function handleDelete(id: number) {
    if (confirm("Delete this product?")) {
      await supabase.from("products").delete().eq("id", id);
      fetchProducts();
    }
  }

  async function handleUpdate() {
    if (!editingProduct) return;
    await supabase.from("products").update(editingProduct).eq("id", editingProduct.id);
    setEditingProduct(null);
    fetchProducts();
  }

  async function handleAdd() {
    await supabase.from("products").insert([newProduct]);
    setShowAddForm(false);
    setNewProduct({ name: "", category: "", price: 0, unit: "", image_url: "" });
    fetchProducts();
  }

  if (loading) return <div className="p-8">Loading...</div>;

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

            {/* Add Product Form */}
            {showAddForm && (
              <div className="mb-6 p-4 border rounded bg-gray-50">
                <h3 className="font-bold mb-2">New Product</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" placeholder="Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="border p-2 rounded" />
                  <input type="text" placeholder="Category" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="border p-2 rounded" />
                  <input type="number" placeholder="Price" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) })} className="border p-2 rounded" />
                  <input type="text" placeholder="Unit" value={newProduct.unit} onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })} className="border p-2 rounded" />
                  <input type="text" placeholder="Image URL" value={newProduct.image_url} onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })} className="border p-2 rounded col-span-2" />
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={handleAdd} className="bg-emerald-600 text-white px-3 py-1 rounded flex items-center gap-1"><FaSave /> Save</button>
                  <button onClick={() => setShowAddForm(false)} className="bg-gray-400 text-white px-3 py-1 rounded flex items-center gap-1"><FaTimes /> Cancel</button>
                </div>
              </div>
            )}

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Category</th>
                    <th className="p-2 text-right">Price</th>
                    <th className="p-2 text-left">Unit</th>
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
                          <td className="p-2"><input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value) })} className="border p-1 rounded w-24" /></td>
                          <td className="p-2"><input value={editingProduct.unit} onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })} className="border p-1 rounded w-full" /></td>
                          <td className="p-2 text-center">
                            <button onClick={handleUpdate} className="text-green-600 mr-2"><FaSave /></button>
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
            <h2 className="text-2xl font-semibold mb-4">WhatsApp Orders</h2>
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
                    </tr>
                  ))}
                  {orders.length === 0 && <tr><td colSpan={7} className="p-4 text-center text-gray-500">No orders yet</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}