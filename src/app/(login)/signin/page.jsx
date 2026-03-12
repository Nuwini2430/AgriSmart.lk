"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./signin.module.css";

export default function SignIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Mock login - replace with actual API call
    setTimeout(() => {
      // Check if user exists (you'll connect to backend later)
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(u => u.phoneNumber === formData.phoneNumber);
      
      if (user && user.password === formData.password) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        router.push(user.role === "admin" ? "/admin1" : "/farmer");
      } else {
        setError("Invalid phone number or password");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAFC]">
      <div className="bg-white rounded-xl shadow-modern-lg p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#00A86B] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">🌾</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Welcome Back</h1>
          <p className="text-[#64748B] mt-1">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[#1E293B] mb-2">Phone Number</label>
            <input
              type="tel"
              placeholder="07XXXXXXXX"
              className="w-full px-4 py-2 border border-[#F1F5F9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A86B]/20 focus:border-[#00A86B] transition-all"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-[#1E293B] mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-[#F1F5F9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A86B]/20 focus:border-[#00A86B] transition-all"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#00A86B] text-white py-2 rounded-lg hover:bg-[#00875A] transition-colors shadow-modern disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-4 text-[#64748B]">
          Don't have an account?{" "}
          <Link href="/signup" className="text-[#00A86B] font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}