"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function FarmerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeSeasons, setActiveSeasons] = useState([]);
  const [pastSeasons, setPastSeasons] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    
    if (!isLoggedIn) {
      router.push("/signin");
      return;
    }

    setUser({
      name: userProfile.fullName || "John Doe",
      phone: localStorage.getItem("userPhone") || "0712345678",
      profilePic: userProfile.profilePic || null,
      memberSince: "2024"
    });

    // ========== LOAD ACTIVE SEASONS FROM FARMER SEASONS ==========
    const farmerSeasons = JSON.parse(localStorage.getItem("farmerSeasons") || "[]");
    
    if (farmerSeasons.length > 0) {
      // Get active seasons
      const active = farmerSeasons.filter(s => s.status === "active");
      const formattedActive = active.map(season => ({
        id: season.id,
        name: season.seasonName,
        crops: [{
          name: season.cropName,
          image: season.cropImage || getCropImage(season.cropName),
          yieldPerAcre: season.yieldPerAcre,
          price: season.price,
          acres: season.acres
        }],
        landAcres: season.acres,
        startDate: season.startDate,
        expectedHarvest: season.endDate,
        progress: season.progress || 0,
        status: "active",
        image: season.cropImage || getCropImage(season.cropName)
      }));
      setActiveSeasons(formattedActive);
      
      // Get past seasons (completed)
      const completed = farmerSeasons.filter(s => s.status === "completed");
      const formattedPast = completed.map(season => ({
        id: season.id,
        name: season.seasonName,
        crops: [{
          name: season.cropName,
          image: season.cropImage || getCropImage(season.cropName)
        }],
        landAcres: season.acres,
        startDate: season.startDate,
        endDate: season.endDate,
        harvest: season.actualHarvest || season.expectedYield,
        income: season.income || season.expectedIncome,
        status: "completed",
        image: season.cropImage || getCropImage(season.cropName)
      }));
      setPastSeasons(formattedPast);
    } else {
      // Mock data for demo when no seasons exist
      setActiveSeasons([
        { 
          id: 1, 
          name: "Maha 2024", 
          crops: [{ name: "Rice", image: "🌾", yieldPerAcre: 1000, price: 150, acres: 2.5 }],
          landAcres: 2.5, 
          startDate: "2024-01-15", 
          expectedHarvest: "2024-04-15",
          progress: 65, 
          status: "active", 
          image: "🌾"
        }
      ]);
      
      setPastSeasons([
        { 
          id: 2, 
          name: "Maha 2023", 
          crops: [{ name: "Rice", image: "🌾" }],
          landAcres: 2.0, 
          startDate: "2023-01-10", 
          endDate: "2023-04-20",
          harvest: 2000, 
          income: 300000, 
          status: "completed", 
          image: "🌾"
        }
      ]);
    }

    setLoading(false);
  }, [router]);

  const getCropImage = (cropName) => {
    const images = {
      "Rice": "🌾",
      "Chili": "🌶️",
      "Brinjal": "🍆",
      "Maize": "🌽",
      "Potato": "🥔",
      "Onion": "🧅",
      "Cabbage": "🥬",
      "Carrot": "🥕",
      "Tomato": "🍅",
      "Cucumber": "🥒"
    };
    return images[cropName] || "🌾";
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userProfile");
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
      {/* Header */}
      <header className="navbar-modern sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/farmer" className="flex items-center gap-2 group">
              <Image 
                src="/images/logo2.jpg" 
                alt="AgriSmart Logo" 
                width={40} 
                height={40}
                className="rounded-lg group-hover:scale-105 transition-transform"
              />
              <span className="font-bold text-xl text-gray-900 hidden sm:block">
                AgriSmart
              </span>
            </Link>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 focus:outline-none group"
              >
                {user?.profilePic ? (
                  <img 
                    src={user.profilePic} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover border-2 border-primary"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center shadow-modern group-hover:scale-105 transition-transform">
                    <span className="text-white text-sm font-bold">
                      {user?.name?.charAt(0) || "F"}
                    </span>
                  </div>
                )}
                <svg className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-modern-lg py-2 z-50 animate-scale-in">
                  <Link href="/farmer/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors">
                    My Profile
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center gap-2 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-modern"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="mr-2">📊</span>
              Dashboard
            </button>
            
            <Link
              href="/farmer/startseason"
              className="px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 text-gray-600 hover:bg-gray-100"
            >
              <span className="mr-2">➕</span>
              Add Season
            </Link>
            
            <button
              onClick={() => setActiveTab("history")}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeTab === "history"
                  ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-modern"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="mr-2">📜</span>
              History
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Tab - Active Seasons */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary flex items-center gap-2 animate-fade-up">
              <span className="text-3xl">🌱</span> Active Seasons
            </h2>
            
            {activeSeasons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeSeasons.map((season, index) => (
                  <Link key={season.id} href={`/farmer/season/${season.id}`}>
                    <div 
                      className="card-modern cursor-pointer animate-fade-up hover:shadow-modern-lg transition-all duration-300" 
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl">
                            {season.image}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-secondary">{season.name}</h3>
                            <p className="text-sm text-gray-500">{season.crops[0]?.name}</p>
                          </div>
                        </div>
                        <span className="badge-modern badge-active">Active</span>
                      </div>

                      <div className="space-y-3 text-sm mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Land</span>
                          <span className="font-semibold text-secondary">{season.landAcres} acres</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Started</span>
                          <span className="font-semibold text-secondary">{season.startDate}</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-gray-500">Progress</span>
                          <span className="font-semibold text-primary">{season.progress}%</span>
                        </div>
                        <div className="progress-modern">
                          <div className="progress-fill" style={{ width: `${season.progress}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="card-modern text-center py-12 animate-fade-up">
                <div className="text-6xl mb-4">🌾</div>
                <p className="text-gray-500 mb-4">No active seasons</p>
                <Link href="/farmer/startseason" className="btn-primary-modern inline-block">
                  Start a New Season
                </Link>
              </div>
            )}
          </div>
        )}

        {/* History Tab - Past Seasons */}
        {activeTab === "history" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary flex items-center gap-2 animate-fade-up">
              <span className="text-3xl">📜</span> Past Seasons
            </h2>
            
            {pastSeasons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastSeasons.map((season, index) => (
                  <Link key={season.id} href={`/farmer/season/${season.id}`}>
                    <div 
                      className="card-modern cursor-pointer animate-fade-up" 
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                            {season.image}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-secondary">{season.name}</h3>
                            <p className="text-sm text-gray-500">{season.crops[0]?.name}</p>
                          </div>
                        </div>
                        <span className="badge-modern badge-completed">Completed</span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Land</span>
                          <span className="font-semibold text-secondary">{season.landAcres} acres</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Period</span>
                          <span className="font-semibold text-secondary">{season.startDate} → {season.endDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Harvest</span>
                          <span className="font-semibold text-secondary">{season.harvest} kg</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-100">
                          <span className="text-gray-500">Income</span>
                          <span className="font-bold text-primary">LKR {season.income?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="card-modern text-center py-12 animate-fade-up">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-500">No past seasons found</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}