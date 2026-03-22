"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { profileAPI, registrationAPI } from "@/app/lib/api";

export default function FarmerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [activeSeasons, setActiveSeasons] = useState([]);
  const [pastSeasons, setPastSeasons] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getCropImage = (cropName) => {
    const images = {
      "Rice": "🌾", "Chili": "🌶️", "Brinjal": "🍆", "Maize": "🌽",
      "Potato": "🥔", "Onion": "🧅", "Cabbage": "🥬", "Carrot": "🥕",
      "Tomato": "🍅", "Cucumber": "🥒", "Pumpkin": "🎃", "Beans": "🫘"
    };
    return images[cropName] || "🌾";
  };

  const loadData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }
    
    try {
      const profile = await profileAPI.getProfile();
      setUser({
        name: profile.fullName,
        phone: profile.phoneNumber,
        profilePic: profile.profilePicture,
        memberSince: profile.createdAt ? new Date(profile.createdAt).getFullYear() : "2024"
      });
      
      const registrations = await registrationAPI.getMyRegistrations();
      
      const active = registrations.filter(r => r.status === "approved" || r.status === "active");
      const formattedActive = active.map(reg => ({
        _id: reg._id,
        name: reg.seasonName || "Season",
        cropName: reg.cropName || "Crop",
        cropImage: reg.cropImage || getCropImage(reg.cropName),
        acres: reg.acres,
        startDate: reg.startDate,
        endDate: reg.endDate,
        expectedYield: reg.expectedYield,
        expectedIncome: reg.expectedIncome,
        progress: reg.progress || Math.floor(Math.random() * 30) + 10,
        status: "active"
      }));
      setActiveSeasons(formattedActive);
      
      const completed = registrations.filter(r => r.status === "completed");
      const formattedCompleted = completed.map(reg => ({
        _id: reg._id,
        name: reg.seasonName || "Season",
        cropName: reg.cropName || "Crop",
        cropImage: reg.cropImage || getCropImage(reg.cropName),
        acres: reg.acres,
        startDate: reg.startDate,
        endDate: reg.endDate,
        expectedYield: reg.expectedYield,
        expectedIncome: reg.expectedIncome,
        actualHarvest: reg.actualHarvest,
        actualIncome: reg.actualIncome,
        notes: reg.notes,
        status: "completed"
      }));
      setPastSeasons(formattedCompleted);
      
    } catch (error) {
      console.error("Error loading data:", error);
      if (error.message === "Not authorized") {
        router.push("/signin");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  useEffect(() => {
    loadData();
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-up">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your farm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="navbar-modern sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/farmer" className="flex items-center gap-2 group">
              <Image src="/images/logo2.jpg" alt="AgriSmart Logo" width={40} height={40} className="rounded-lg group-hover:scale-105 transition-transform" />
              <span className="font-bold text-xl text-gray-900 hidden sm:block">AgriSmart</span>
            </Link>
            <div className="flex items-center gap-3">
              <button onClick={handleRefresh} disabled={refreshing} className="p-2 text-gray-500 hover:text-primary transition-colors disabled:opacity-50" title="Refresh">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <div className="relative">
                <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2 focus:outline-none group">
                  {user?.profilePic ? (
                    <img src={user.profilePic} alt="Profile" className="w-8 h-8 rounded-full object-cover border-2 border-primary" />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center shadow-modern group-hover:scale-105 transition-transform">
                      <span className="text-white text-sm font-bold">{user?.name?.charAt(0) || "F"}</span>
                    </div>
                  )}
                  <svg className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-modern-lg py-2 z-50 animate-scale-in">
                    <Link href="/farmer/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary">My Profile</Link>
                    <hr className="my-2" />
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Sign Out</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-2 pb-2 overflow-x-auto">
            <button onClick={() => setActiveTab("dashboard")} className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${activeTab === "dashboard" ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-modern" : "text-gray-600 hover:bg-gray-100"}`}>
              <span className="mr-2">📊</span> Dashboard
            </button>
            <Link href="/farmer/startseason" className="px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 text-gray-600 hover:bg-gray-100">
              <span className="mr-2">➕</span> Add Season
            </Link>
            <button onClick={() => setActiveTab("history")} className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${activeTab === "history" ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-modern" : "text-gray-600 hover:bg-gray-100"}`}>
              <span className="mr-2">📜</span> History
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-secondary flex items-center gap-2"><span className="text-3xl">🌱</span> My Active Seasons</h2>
              {refreshing && <div className="text-sm text-gray-400 animate-pulse">Refreshing...</div>}
            </div>
            {activeSeasons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeSeasons.map((season, index) => (
                  <Link key={season._id} href={`/farmer/season/${season._id}`}>
                    <div className="card-modern cursor-pointer animate-fade-up hover:shadow-modern-lg transition-all duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl">{season.cropImage}</div>
                          <div><h3 className="font-bold text-lg text-secondary">{season.name}</h3><p className="text-sm text-gray-500 font-medium">{season.cropName}</p></div>
                        </div>
                        <span className="badge-modern badge-active">Active</span>
                      </div>
                      <div className="space-y-3 text-sm mb-4">
                        <div className="flex justify-between"><span className="text-gray-500">Acres</span><span className="font-semibold text-secondary">{season.acres} acres</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Started</span><span className="font-semibold text-secondary">{season.startDate ? new Date(season.startDate).toLocaleDateString() : "N/A"}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Expected Yield</span><span className="font-semibold text-primary">{season.expectedYield?.toLocaleString()} kg</span></div>
                      </div>
                      <div><div className="flex justify-between text-xs mb-2"><span className="text-gray-500">Progress</span><span className="font-semibold text-primary">{season.progress}%</span></div><div className="progress-modern"><div className="progress-fill" style={{ width: `${season.progress}%` }}></div></div></div>
                      <div className="mt-3 text-center text-xs text-gray-400">Click to view details</div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="card-modern text-center py-12 animate-fade-up">
                <div className="text-6xl mb-4">🌾</div><p className="text-gray-500 mb-4">No active seasons</p>
                <Link href="/farmer/startseason" className="btn-primary-modern inline-block">Register for a Season</Link>
              </div>
            )}
            {activeSeasons.length > 0 && (
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 mt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div><div className="text-2xl font-bold text-primary">{activeSeasons.length}</div><div className="text-xs text-gray-500">Active Seasons</div></div>
                  <div><div className="text-2xl font-bold text-primary">{activeSeasons.reduce((sum, s) => sum + s.acres, 0).toFixed(1)}</div><div className="text-xs text-gray-500">Total Acres</div></div>
                  <div><div className="text-2xl font-bold text-primary">{activeSeasons.reduce((sum, s) => sum + (s.expectedYield || 0), 0).toLocaleString()}</div><div className="text-xs text-gray-500">Expected Yield (kg)</div></div>
                  <div><div className="text-2xl font-bold text-primary">LKR {activeSeasons.reduce((sum, s) => sum + (s.expectedIncome || 0), 0).toLocaleString()}</div><div className="text-xs text-gray-500">Expected Income</div></div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary flex items-center gap-2 animate-fade-up"><span className="text-3xl">📜</span> Past Seasons</h2>
            {pastSeasons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastSeasons.map((season, index) => (
                  <Link key={season._id} href={`/farmer/season/${season._id}`}>
                    <div className="card-modern cursor-pointer animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">{season.cropImage}</div>
                          <div><h3 className="font-bold text-lg text-secondary">{season.name}</h3><p className="text-sm text-gray-500 font-medium">{season.cropName}</p></div>
                        </div>
                        <span className="badge-modern badge-completed">Completed</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">Acres</span><span className="font-semibold text-secondary">{season.acres} acres</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Period</span><span className="font-semibold text-secondary">{season.startDate ? new Date(season.startDate).toLocaleDateString() : "N/A"} {season.endDate ? ` → ${new Date(season.endDate).toLocaleDateString()}` : ""}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Harvest</span><span className="font-semibold text-secondary">{season.actualHarvest || season.expectedYield} kg</span></div>
                        <div className="flex justify-between pt-2 border-t border-gray-100"><span className="text-gray-500">Income</span><span className="font-bold text-primary">LKR {season.actualIncome || season.expectedIncome?.toLocaleString()}</span></div>
                      </div>
                      <div className="mt-3 text-center text-xs text-gray-400">View Details</div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="card-modern text-center py-12 animate-fade-up"><div className="text-6xl mb-4">📭</div><p className="text-gray-500">No past seasons found</p></div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}