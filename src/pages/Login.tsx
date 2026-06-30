import { useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Login() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ইউজার আগে থেকেই লগইন করা থাকলে সরাসরি ড্যাশবোর্ডে চলে যাবে
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleAuth = async (type: "login" | "register") => {
    setLoading(true);
    setError(null);

    try {
      if (type === "register") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Registration successful! You are now logged in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md border border-gray-200">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Code Bondhu ERP</h1>
          <p className="text-sm text-gray-500 mt-2">Login or create an account to continue</p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <Input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex gap-4 pt-2">
            <Button
              className="w-full"
              onClick={() => handleAuth("login")}
              disabled={loading || !email || !password}
            >
              {loading ? "Please wait..." : "Login"}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleAuth("register")}
              disabled={loading || !email || !password}
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}