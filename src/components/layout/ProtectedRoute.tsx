import { Navigate } from "react-router-dom";
// আগের মতোই @/ ব্যবহার করছি কারণ এখন আমরা জানি আসল সমস্যা কী ছিল
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // ইউজার না থাকলে লগইন পেজে রিডাইরেক্ট করবে
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ইউজার থাকলে মেইন পেজ দেখাবে
  return <>{children}</>;
}