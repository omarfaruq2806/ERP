import { useEffect, useState } from "react";
import { getSales } from "@/services/saleService";
import { getProducts } from "@/services/productService";
import { getCustomers } from "@/services/customerService";
import { getPurchases } from "@/services/purchaseService";
import { TrendingUp, Users, Package, AlertCircle } from "lucide-react";
import type { Product } from "@/types";

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    totalCustomers: 0,
    lowStockCount: 0,
  });
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [sales, purchases, products, customers] = await Promise.all([
          getSales(),
          getPurchases(),
          getProducts(),
          getCustomers(),
        ]);

        // ১. মোট আয়ের হিসাব
        const revenue = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
        
        // ২. মোট খরচের হিসাব
        const expenses = purchases.reduce((sum, purchase) => sum + (purchase.total || 0), 0);

        // ৩. লো-স্টক প্রোডাক্ট বের করা (যাদের স্টক min_stock এর সমান বা কম)
        const lowStock = products.filter((p) => p.stock <= p.min_stock);

        setStats({
          totalRevenue: revenue,
          totalExpenses: expenses,
          totalCustomers: customers.length,
          lowStockCount: lowStock.length,
        });

        setLowStockProducts(lowStock);
      } catch (error) {
        console.error("Dashboard data load error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-[80vh] text-gray-500">Loading Dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome to your ERP summary.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Revenue (Sales)</p>
            <h3 className="text-2xl font-bold text-gray-900">৳ {stats.totalRevenue.toLocaleString()}</h3>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-full">
            <TrendingUp className="w-6 h-6 transform rotate-180" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Expenses (Purchases)</p>
            <h3 className="text-2xl font-bold text-gray-900">৳ {stats.totalExpenses.toLocaleString()}</h3>
          </div>
        </div>

        {/* Customers Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Customers</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</h3>
          </div>
        </div>

        {/* Low Stock Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.lowStockCount}</h3>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center space-x-2 bg-red-50">
          <Package className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-semibold text-red-700">Low Stock Alerts</h2>
        </div>
        <div className="p-0">
          {lowStockProducts.length === 0 ? (
            <p className="p-6 text-gray-500 text-center">All products have sufficient stock!</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-500">Product Name</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Category</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Current Stock</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Min Stock (Alert At)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {lowStockProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{product.name}</td>
                    <td className="px-6 py-4 text-gray-500">{product.category}</td>
                    <td className="px-6 py-4 font-bold text-red-600">{product.stock}</td>
                    <td className="px-6 py-4 text-gray-500">{product.min_stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}