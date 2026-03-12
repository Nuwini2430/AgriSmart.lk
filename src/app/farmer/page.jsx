"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function FarmerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    // Check if logged in
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      router.push("/signin");
    } else {
      setUser(currentUser);
    }
  }, [router]);

  // Mock data
  const stats = [
    { label: "My Crops", value: "3", color: "text-[#00A86B]" },
    { label: "Total Acres", value: "5.5", color: "text-[#00A86B]" },
    { label: "Expected Income", value: "Rs. 750,000", color: "text-[#00A86B]" }
  ];

  const recentRegistrations = [
    { crop: "Rice", acres: 2.5, date: "2024-01-15", status: "Active" },
    { crop: "Chili", acres: 1.0, date: "2024-01-10", status: "Active" }
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-[#F1F5F9]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌾</span>
              <span className="font-bold text-[#1E293B]">AgriSmart</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[#1E293B]">{user?.fullName || "Farmer"}</span>
              <button 
                onClick={() => {
                  localStorage.removeItem("currentUser");
                  router.push("/");
                }}
                className="px-4 py-2 text-[#64748B] hover:text-[#00A86B] transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-[#F1F5F9] bg-white">
        <div className="container mx-auto px-4">
          <div className="flex gap-6">
            {["dashboard", "my-crops", "register", "seasons"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-2 font-medium capitalize transition-colors relative ${
                  activeTab === tab
                    ? "text-[#00A86B] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#00A86B]"
                    : "text-[#64748B] hover:text-[#1E293B]"
                }`}
              >
                {tab.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#00A86B] to-[#00875A] text-white p-6 rounded-xl mb-8">
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, {user?.fullName || "Farmer"}! 👋
          </h2>
          <p className="opacity-90">
            {new Date().toLocaleDateString("en-US", { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-modern p-6">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-[#64748B]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Registrations */}
        <div className="bg-white rounded-xl shadow-modern p-6">
          <h3 className="text-lg font-semibold text-[#1E293B] mb-4">
            Recent Registrations
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8FAFC]">
                <tr>
                  <th className="p-3 text-left text-[#64748B]">Crop</th>
                  <th className="p-3 text-left text-[#64748B]">Acres</th>
                  <th className="p-3 text-left text-[#64748B]">Date</th>
                  <th className="p-3 text-left text-[#64748B]">Status</th>
                  <th className="p-3 text-left text-[#64748B]">QR Code</th>
                </tr>
              </thead>
              <tbody>
                {recentRegistrations.map((reg, i) => (
                  <tr key={i} className="border-t border-[#F1F5F9]">
                    <td className="p-3 text-[#1E293B]">{reg.crop}</td>
                    <td className="p-3 text-[#1E293B]">{reg.acres}</td>
                    <td className="p-3 text-[#1E293B]">{reg.date}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-green-100 text-[#00A86B] rounded-full text-sm">
                        {reg.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button className="text-[#00A86B] hover:text-[#00875A]">
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}