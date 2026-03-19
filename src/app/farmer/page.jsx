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
  const [showProfileMenu, setShowProfileMenu] = useState(false); // මෙය add කරන්න

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
      memberSince: "2024"
    });

    // Load active seasons from localStorage
    const savedActiveSeasons = JSON.parse(localStorage.getItem("activeSeasons") || "[]");
    const savedPastSeasons = JSON.parse(localStorage.getItem("pastSeasons") || "[]");
    
    if (savedActiveSeasons.length > 0) {
      setActiveSeasons(savedActiveSeasons);
    } else {
      // Mock active seasons
      setActiveSeasons([
        { 
          id: 1, 
          name: "Maha 2024", 
          crops: [{ name: "Rice", image: "🌾", yieldPerAcre: 1000, price: 150 }],
          landAcres: 2.5, 
          startDate: "2024-01-15", 
          expectedHarvest: "2024-04-15",
          progress: 65,
          status: "active",
          image: "🌾"
        },
        { 
          id: 2, 
          name: "Yala 2024", 
          crops: [{ name: "Chili", image: "🌶️", yieldPerAcre: 800, price: 300 }],
          landAcres: 1.5, 
          startDate: "2024-02-01", 
          expectedHarvest: "2024-05-01",
          progress: 40,
          status: "active",
          image: "🌶️"
        }
      ]);
    }

    if (savedPastSeasons.length > 0) {
      setPastSeasons(savedPastSeasons);
    } else {
      // Mock past seasons
      setPastSeasons([
        { 
          id: 3, 
          name: "Maha 2023", 
          crops: [{ name: "Rice", image: "🌾" }],
          landAcres: 2.0, 
          startDate: "2023-01-10", 
          endDate: "2023-04-20",
          harvest: 2000,
          income: 300000,
          status: "completed",
          image: "🌾"
        },
        { 
          id: 4, 
          name: "Yala 2023", 
          crops: [{ name: "Brinjal", image: "🍆" }],
          landAcres: 1.0, 
          startDate: "2023-05-15", 
          endDate: "2023-08-25",
          harvest: 1200,
          income: 144000,
          status: "completed",
          image: "🍆"
        }
      ]);
    }

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userProfile");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
          {/* Top Row - Logo and Profile */}
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

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 focus:outline-none"
              >
                {user?.profilePic ? (
                  <img 
                    src={user.profilePic} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover border-2 border-primary"
                  />
                ) : (
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-primary">
                    <span className="text-white text-sm font-bold">
                      {user?.name?.charAt(0) || "F"}
                    </span>
                  </div>
                )}
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-modern-lg py-2 z-50">
                  <Link href="/farmer/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    My Profile
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row - Navigation Tabs */}
          <div className="flex justify-center pb-2 overflow-x-auto">
            <div className="flex gap-2 md:gap-4">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`py-2 px-3 font-medium text-sm rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === "dashboard"
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="mr-2">📊</span>
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              
              <Link
                href="/farmer/startseason"
                className={`py-2 px-3 font-medium text-sm rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === "add-season"
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="mr-2">➕</span>
                <span className="hidden sm:inline">Add Season</span>
              </Link>
              
              <button
                onClick={() => setActiveTab("history")}
                className={`py-2 px-3 font-medium text-sm rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === "history"
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="mr-2">📜</span>
                <span className="hidden sm:inline">History</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Tab - Active Seasons */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-secondary">Active Seasons</h2>
            
            {activeSeasons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeSeasons.map((season) => (
                  <Link key={season.id} href={`/farmer/season/${season.id}`}>
                    <div className="bg-white rounded-xl shadow-modern p-6 hover:shadow-modern-lg transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-3xl">{season.image || season.crops[0]?.image || "🌾"}</span>
                          <div>
                            <h3 className="font-semibold text-secondary">{season.name}</h3>
                            <p className="text-sm text-gray-500">
                              {season.crops?.map(c => c.name).join(", ") || "Multiple crops"}
                            </p>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                          Active
                        </span>
                      </div>

                      <div className="space-y-2 text-sm mb-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Land:</span>
                          <span className="font-medium text-secondary">{season.landAcres} acres</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Started:</span>
                          <span className="font-medium text-secondary">{season.startDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Expected Harvest:</span>
                          <span className="font-medium text-secondary">{season.expectedHarvest || "N/A"}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Progress</span>
                          <span className="text-secondary font-medium">{season.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${season.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-modern p-12 text-center">
                <p className="text-gray-500 mb-4">No active seasons</p>
                <Link
                  href="/farmer/startseason"
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors inline-block"
                >
                  Start a New Season
                </Link>
              </div>
            )}
          </div>
        )}

        {/* History Tab - Past Seasons */}
        {activeTab === "history" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-secondary">Past Seasons</h2>
            
            {pastSeasons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastSeasons.map((season) => (
                  <Link key={season.id} href={`/farmer/season/${season.id}`}>
                    <div className="bg-white rounded-xl shadow-modern p-6 hover:shadow-modern-lg transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-3xl">{season.image}</span>
                          <div>
                            <h3 className="font-semibold text-secondary">{season.name}</h3>
                            <p className="text-sm text-gray-500">{season.crops[0]?.name}</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          Completed
                        </span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Land:</span>
                          <span className="font-medium text-secondary">{season.landAcres} acres</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Period:</span>
                          <span className="font-medium text-secondary">{season.startDate} to {season.endDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Harvest:</span>
                          <span className="font-medium text-secondary">{season.harvest} kg</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-100">
                          <span className="text-gray-500">Income:</span>
                          <span className="font-bold text-primary">LKR {season.income?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-modern p-12 text-center">
                <p className="text-gray-500">No past seasons found</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}