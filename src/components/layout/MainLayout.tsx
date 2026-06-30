import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Menu, X, Home, Package, ShoppingCart, Truck, Users, LogOut, UserCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { signOut } = useAuth();
  const location = useLocation();

  // মেনু আইটেমের লিস্ট
  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Products", href: "/products", icon: Package },
    { name: "Sales", href: "/sales", icon: ShoppingCart },
    { name: "Purchases", href: "/purchases", icon: Truck },
    { name: "Suppliers", href: "/suppliers", icon: Users },
    { name: "Customers", href: "/customers", icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                type="button"
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 mr-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              
              {/* Logo */}
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="font-bold text-xl">MyApp</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.href
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </div>
                </Link>
              ))}
              
              {/* Logout Button */}
              <button
                onClick={signOut}
                className="ml-4 inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === item.href
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </div>
                </Link>
              ))}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  signOut();
                }}
                className="w-full mt-2 flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Outlet হলো সেই জায়গা যেখানে অন্য সব পেজ লোড হবে */}
        <Outlet /> 
      </main>
    </div>
  );
}