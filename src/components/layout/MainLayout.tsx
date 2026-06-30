import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  Truck
} from "lucide-react";

export function MainLayout() {
  const { signOut, user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Products", icon: Package, path: "/products" },
    { name: "Sales", icon: ShoppingCart, path: "/sales" },
    { name: "Purchases", icon: Truck, path: "/purchases" },
    { name: "Customers", icon: Users, path: "/customers" },
    { name: "Suppliers", icon: Truck, path: "/suppliers" }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (বাম দিকের মেনু) */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Mini ERP</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="mb-4 px-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Logged in as</p>
            <p className="text-sm text-gray-900 truncate">{user?.email}</p>
          </div>
          <Button variant="outline" className="w-full justify-start gap-2" onClick={signOut}>
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content (ডান দিকের পেজগুলো) */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header (শুধু মোবাইলের জন্য) */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 md:hidden">
          <h1 className="text-xl font-bold text-gray-800">Mini ERP</h1>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-auto p-6">
          <Outlet /> {/* এখানে অন্য পেজগুলো রেন্ডার হবে */}
        </div>
      </main>
    </div>
  );
}