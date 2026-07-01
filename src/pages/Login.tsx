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
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-4">
    <div className="w-full max-w-md p-6 sm:p-8 space-y-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white">
      
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Mini<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">ERP</span>
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Welcome back! Login or create an account.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 p-3.5 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p>{error}</p>
        </div>
      )}

      {/* Form Section */}
      <div className="space-y-5">
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">Email Address</label>
          <Input
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-5 bg-slate-50 border-slate-200 focus:bg-white transition-colors rounded-xl"
          />
        </div>
        
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">Password</label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-5 bg-slate-50 border-slate-200 focus:bg-white transition-colors rounded-xl"
          />
        </div>

        {/* Action Buttons - Stack on mobile, inline on larger screens */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            className="w-full sm:w-1/2 py-6 rounded-xl text-base font-semibold shadow-md hover:shadow-lg transition-all"
            onClick={() => handleAuth("login")}
            disabled={loading || !email || !password}
          >
            {loading ? "Wait..." : "Login"}
          </Button>
          
          <Button
            variant="outline"
            className="w-full sm:w-1/2 py-6 rounded-xl text-base font-semibold border-slate-200 hover:bg-slate-50 transition-all"
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