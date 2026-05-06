'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function EditorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          device_name: 'editor_portal',
        }),
      });

      const result = await response.json();

      if (result.success && result.token) {
        localStorage.setItem('editor_token', result.token);
        localStorage.setItem('editor_user', JSON.stringify(result.user));
        router.push("/editor/dashboard");
      } else {
        setError(result.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during login. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2d6b] via-[#0a1e4a] to-[#051430] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#c9a227] flex items-center justify-center shadow-lg">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-white" style={{ fontSize: "1.1rem", fontWeight: 700 }}>Advanced Materials Letters</div>
              <div className="text-white/60 text-sm mt-0.5">IAAM Journal Management System</div>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-[#0f2d6b] mb-1" style={{ fontSize: "1.3rem", fontWeight: 700 }}>Editor Login</h1>
          <p className="text-[#5a6a8a] text-sm mb-6">Access your editorial dashboard</p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5 text-red-700 text-xs">
              {error}
            </div>
          )}

          {/* Demo credentials notice */}
          <div className="bg-[#f0f4fb] border border-[#0f2d6b]/15 rounded-lg px-4 py-3 mb-5 flex items-start gap-2">
            <div className="w-4 h-4 rounded-full bg-[#0f2d6b]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[#0f2d6b] text-[10px]" style={{ fontWeight: 700 }}>i</span>
            </div>
            <div className="text-xs text-[#5a6a8a]">
              <span style={{ fontWeight: 600 }} className="text-[#0f2d6b]">Live System:</span> Use your assigned editorial credentials to access the dashboard.
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[#0f1a2e] text-sm mb-1.5" style={{ fontWeight: 600 }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aabcc]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="editor@iaam.org"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-[#f4f7fc] text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[#0f1a2e] text-sm mb-1.5" style={{ fontWeight: 600 }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aabcc]" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 bg-[#f4f7fc] text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9aabcc] hover:text-[#5a6a8a]"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-[#0f2d6b]" />
                <span className="text-[#5a6a8a]">Remember me</span>
              </label>
              <a href="#" className="text-[#0f2d6b] hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#0f2d6b] text-white rounded-lg text-sm hover:bg-[#0d2560] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ fontWeight: 700 }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-border text-center text-xs text-[#9aabcc]">
            <p>Reviewer? Access your review via the secure link sent to your email.</p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-white/60 text-xs hover:text-white transition-colors">
            ← Return to Journal Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
