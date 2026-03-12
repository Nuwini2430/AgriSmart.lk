"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function FarmerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [crops, setCrops] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [availableCrops, setAvailableCrops] = useState([]);

  // Mock data - Replace with API calls
  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    
    if (!isLoggedIn) {
      router.push("/signin");
      return;
    }

    // Mock user data
    setUser({
      name: userProfile.fullName || "John Doe",
      phone: localStorage.getItem("userPhone") || "0712345678",
      profilePic: userProfile.profilePic || null,
      memberSince: "2024",
      totalCrops: 3,
      totalAcres: 5.5,
      estimatedIncome: 750000
    });

    // Mock crops data
    setCrops([
      { id: 1, name: "Rice", acres: 2.5, status: "active", progress: 65, plantedDate: "2024-01-15", expectedHarvest: "2024-04-15", yield: 2500 },
      { id: 2, name: "Chili", acres: 1.5, status: "active", progress: 40, plantedDate: "2024-02-01", expectedHarvest: "2024-05-01", yield: 800 },
      { id: 3, name: "Brinjal", acres: 1.5, status: "pending", progress: 0, plantedDate: "-", expectedHarvest: "-", yield: 0 }
    ]);

    // Mock registrations
    setRegistrations([
      { id: 1, crop: "Rice", acres: 2.5, date: "2024-01-10", status: "approved", qrCode: "/qrcodes/rice-001.png" },
      { id: 2, crop: "Chili", acres: 1.5, date: "2024-01-15", status: "approved", qrCode: "/qrcodes/chili-001.png" },
      { id: 3, crop: "Brinjal", acres: 1.5, date: "2024-02-01", status: "pending", qrCode: null }
    ]);

    // Mock available crops for registration
    setAvailableCrops([
      { id: 1, name: "Rice", remaining: 45, total: 200, yieldPerAcre: 1000, price: 150, season: "Maha", status: "open" },
      { id: 2, name: "Chili", remaining: 15, total: 50, yieldPerAcre: 800, price: 300, season: "Yala", status: "open" },
      { id: 3, name: "Brinjal", remaining: 8, total: 30, yieldPerAcre: 1200, price: 120, season: "Maha", status: "open" },
      { id: 4, name: "Maize", remaining: 0, total: 100, yieldPerAcre: 1500, price: 90, season: "Yala", status: "closed" }
    ]);

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userProfile");
    router.push("/");
  };

  const handleRegisterCrop = (crop) => {
    // Navigate to registration page or open modal
    console.log("Registering for:", crop);
    // router.push(`/farmer/register/${crop.id}`);
  };

  const handleViewQR = (registration) => {
    // Show QR code modal or download
    console.log("Viewing QR for:", registration);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-modern sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/farmer" className="flex items-center gap-2">
              <Image 
                src="/images/logo2.jpg" 
                alt="AgriSmart" 
                width={40} 
                height={40}
                className="rounded-lg"
              />
              <span className="font-bold text-secondary hidden sm:block">AgriSmart</span>
            </Link>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden md:block">
                Welcome, {user?.name}
              </span>
              <div className="relative group">
                <button className="flex items-center gap-2 focus:outline-none">
                  {user?.profilePic ? (
                    <img 
                      src={user.profilePic} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover border-2 border-primary"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary">
                      <span className="text-primary text-sm font-bold">
                        {user?.name?.charAt(0) || "F"}
                      </span>
                    </div>
                  )}
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-modern-lg py-2 hidden group-hover:block">
                  <Link href="/farmer/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    My Profile
                  </Link>
                  <Link href="/farmer/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Settings
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-6 mt-2">
            {[
              { id: "dashboard", label: "Dashboard", icon: "📊" },
              { id: "my-crops", label: "My Crops", icon: "🌱" },
              { id: "register", label: "Register Crop", icon: "➕" },
              { id: "history", label: "History", icon: "📜" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl p-6 shadow-modern">
              <h2 className="text-2xl font-bold mb-2">
                Welcome back, {user?.name}! 👋
              </h2>
              <p className="opacity-90">
                Here's what's happening with your farm today.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-modern p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500">Active Crops</span>
                  <span className="text-2xl">🌱</span>
                </div>
                <div className="text-3xl font-bold text-secondary">{user?.totalCrops}</div>
                <p className="text-sm text-gray-500 mt-1">+2 from last season</p>
              </div>

              <div className="bg-white rounded-xl shadow-modern p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500">Total Acres</span>
                  <span className="text-2xl">🌾</span>
                </div>
                <div className="text-3xl font-bold text-secondary">{user?.totalAcres}</div>
                <p className="text-sm text-gray-500 mt-1">Across 3 locations</p>
              </div>

              <div className="bg-white rounded-xl shadow-modern p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500">Est. Income</span>
                  <span className="text-2xl">💰</span>
                </div>
                <div className="text-3xl font-bold text-primary">LKR {user?.estimatedIncome.toLocaleString()}</div>
                <p className="text-sm text-gray-500 mt-1">Expected this season</p>
              </div>
            </div>

            {/* Current Crops */}
            <div className="bg-white rounded-xl shadow-modern p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-secondary">Current Crops</h3>
                <Link href="/farmer/my-crops" className="text-primary text-sm hover:underline">
                  View All →
                </Link>
              </div>

              <div className="space-y-4">
                {crops.filter(c => c.status === "active").map((crop) => (
                  <div key={crop.id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-secondary">{crop.name}</h4>
                        <p className="text-sm text-gray-500">{crop.acres} acres • Planted: {crop.plantedDate}</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                        Active
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">Growth Progress</span>
                        <span className="text-secondary font-medium">{crop.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${crop.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Harvest Info */}
                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                      <div>
                        <p className="text-gray-500">Expected Harvest</p>
                        <p className="font-medium text-secondary">{crop.expectedHarvest}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Est. Yield</p>
                        <p className="font-medium text-secondary">{crop.yield} kg</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-modern p-6">
              <h3 className="text-lg font-semibold text-secondary mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600">🌱</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary">Registered for Rice</p>
                    <p className="text-xs text-gray-500">2 days ago • 2.5 acres</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Approved</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600">🌶️</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary">Registered for Chili</p>
                    <p className="text-xs text-gray-500">5 days ago • 1.5 acres</p>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">Pending</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">📄</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary">Profile Updated</p>
                    <p className="text-xs text-gray-500">1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Crops Tab */}
        {activeTab === "my-crops" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-secondary">My Crops</h2>
            
            {/* Crop Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {crops.map((crop) => (
                <div key={crop.id} className="bg-white rounded-xl shadow-modern p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg text-secondary">{crop.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      crop.status === "active" ? "bg-green-100 text-green-600" :
                      crop.status === "pending" ? "bg-yellow-100 text-yellow-600" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {crop.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Acres:</span>
                      <span className="font-medium text-secondary">{crop.acres}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Planted:</span>
                      <span className="font-medium text-secondary">{crop.plantedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Harvest:</span>
                      <span className="font-medium text-secondary">{crop.expectedHarvest}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Est. Yield:</span>
                      <span className="font-medium text-secondary">{crop.yield} kg</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Progress</span>
                      <span className="text-secondary font-medium">{crop.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${crop.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Register Crop Tab */}
        {activeTab === "register" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-secondary">Register for New Crop</h2>
            
            {/* Available Crops */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableCrops.map((crop) => (
                <div key={crop.id} className="bg-white rounded-xl shadow-modern p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-secondary">{crop.name}</h3>
                      <p className="text-sm text-gray-500">{crop.season} Season</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      crop.status === "open" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}>
                      {crop.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Remaining</p>
                        <p className="font-bold text-secondary">{crop.remaining} acres</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total</p>
                        <p className="font-bold text-secondary">{crop.total} acres</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Yield/Acre</p>
                        <p className="font-medium text-secondary">{crop.yieldPerAcre} kg</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Price/kg</p>
                        <p className="font-medium text-primary">LKR {crop.price}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Registration Progress</span>
                        <span className="text-secondary font-medium">
                          {((crop.total - crop.remaining) / crop.total * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(crop.total - crop.remaining) / crop.total * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Register Button */}
                    <button
                      onClick={() => handleRegisterCrop(crop)}
                      disabled={crop.status !== "open"}
                      className={`w-full py-2 rounded-lg font-medium transition-colors ${
                        crop.status === "open"
                          ? "bg-primary text-white hover:bg-primary-dark"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {crop.status === "open" ? "Register Now" : "Registration Closed"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-secondary">Registration History</h2>
            
            <div className="bg-white rounded-xl shadow-modern overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">Crop</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">Acres</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">Date</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">QR Code</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="border-t border-gray-100">
                      <td className="p-4 text-secondary">{reg.crop}</td>
                      <td className="p-4 text-secondary">{reg.acres}</td>
                      <td className="p-4 text-secondary">{reg.date}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          reg.status === "approved" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                        }`}>
                          {reg.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {reg.qrCode ? (
                          <button
                            onClick={() => handleViewQR(reg)}
                            className="text-primary hover:text-primary-dark text-sm font-medium"
                          >
                            View QR
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">Pending</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}