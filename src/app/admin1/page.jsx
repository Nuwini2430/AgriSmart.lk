"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [farmers, setFarmers] = useState([]);
  const [crops, setCrops] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showFarmerModal, setShowFarmerModal] = useState(false);

  // Mock data - Replace with API calls
  useEffect(() => {
    // Check if admin is logged in (mock)
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    
    if (!isLoggedIn) {
      router.push("/signin");
      return;
    }

    // Mock stats
    setStats({
      totalFarmers: 156,
      activeFarmers: 142,
      totalCrops: 23,
      activeSeasons: 3,
      totalRegistrations: 412,
      pendingApprovals: 28,
      totalAcres: 1250.5,
      estimatedHarvest: 1250000,
      revenue: 18750000
    });

    // Mock farmers data
    setFarmers([
      { 
        id: 1, 
        name: "Kamal Perera", 
        nic: "821234567V", 
        phone: "0712345678",
        address: "Kurunegala",
        district: "Kurunegala",
        registeredDate: "2024-01-15",
        status: "active",
        crops: 3,
        totalAcres: 5.5,
        profilePic: null
      },
      { 
        id: 2, 
        name: "Nimali Fernando", 
        nic: "88654321V", 
        phone: "0723456789",
        address: "Matale",
        district: "Matale",
        registeredDate: "2024-01-20",
        status: "active",
        crops: 2,
        totalAcres: 3.2,
        profilePic: null
      },
      { 
        id: 3, 
        name: "Sunil Bandara", 
        nic: "912345678V", 
        phone: "0774567890",
        address: "Anuradhapura",
        district: "Anuradhapura",
        registeredDate: "2024-02-01",
        status: "pending",
        crops: 1,
        totalAcres: 2.0,
        profilePic: null
      },
      { 
        id: 4, 
        name: "Priyani Jayawardena", 
        nic: "200012345678", 
        phone: "0765678901",
        address: "Galle",
        district: "Galle",
        registeredDate: "2024-02-10",
        status: "active",
        crops: 4,
        totalAcres: 7.8,
        profilePic: null
      }
    ]);

    // Mock crops data
    setCrops([
      { 
        id: 1, 
        name: "Rice", 
        season: "Maha",
        requiredHarvest: 500000,
        yieldPerAcre: 1000,
        totalAcres: 500,
        registeredAcres: 325,
        remainingAcres: 175,
        price: 150,
        status: "active",
        farmers: 98,
        expectedHarvest: 325000,
        deadline: "2024-04-30"
      },
      { 
        id: 2, 
        name: "Chili", 
        season: "Yala",
        requiredHarvest: 100000,
        yieldPerAcre: 800,
        totalAcres: 125,
        registeredAcres: 85,
        remainingAcres: 40,
        price: 300,
        status: "active",
        farmers: 42,
        expectedHarvest: 68000,
        deadline: "2024-05-15"
      },
      { 
        id: 3, 
        name: "Brinjal", 
        season: "Maha",
        requiredHarvest: 75000,
        yieldPerAcre: 1200,
        totalAcres: 62.5,
        registeredAcres: 45,
        remainingAcres: 17.5,
        price: 120,
        status: "active",
        farmers: 28,
        expectedHarvest: 54000,
        deadline: "2024-04-20"
      }
    ]);

    // Mock registrations
    setRegistrations([
      { 
        id: 1, 
        farmerId: 1,
        farmerName: "Kamal Perera",
        cropId: 1,
        cropName: "Rice",
        acres: 2.5,
        registrationDate: "2024-01-10",
        status: "approved",
        qrCode: "/qrcodes/001.png",
        expectedYield: 2500
      },
      { 
        id: 2, 
        farmerId: 1,
        farmerName: "Kamal Perera",
        cropId: 2,
        cropName: "Chili",
        acres: 1.5,
        registrationDate: "2024-01-15",
        status: "approved",
        qrCode: "/qrcodes/002.png",
        expectedYield: 1200
      },
      { 
        id: 3, 
        farmerId: 2,
        farmerName: "Nimali Fernando",
        cropId: 1,
        cropName: "Rice",
        acres: 2.0,
        registrationDate: "2024-01-20",
        status: "approved",
        qrCode: "/qrcodes/003.png",
        expectedYield: 2000
      },
      { 
        id: 4, 
        farmerId: 3,
        farmerName: "Sunil Bandara",
        cropId: 3,
        cropName: "Brinjal",
        acres: 2.0,
        registrationDate: "2024-02-01",
        status: "pending",
        qrCode: null,
        expectedYield: 2400
      }
    ]);

    // Mock seasons
    setSeasons([
      { 
        id: 1, 
        name: "Maha 2024", 
        startDate: "2024-01-01", 
        endDate: "2024-04-30",
        status: "active",
        crops: 3,
        farmers: 98,
        totalAcres: 430,
        progress: 65
      },
      { 
        id: 2, 
        name: "Yala 2024", 
        startDate: "2024-05-01", 
        endDate: "2024-08-31",
        status: "upcoming",
        crops: 2,
        farmers: 42,
        totalAcres: 85,
        progress: 0
      }
    ]);

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userProfile");
    router.push("/");
  };

  const handleViewFarmer = (farmer) => {
    setSelectedFarmer(farmer);
    setShowFarmerModal(true);
  };

  const handleApproveRegistration = (registrationId) => {
    setRegistrations(prev => 
      prev.map(reg => 
        reg.id === registrationId ? {...reg, status: "approved"} : reg
      )
    );
  };

  const handleRejectRegistration = (registrationId) => {
    setRegistrations(prev => 
      prev.map(reg => 
        reg.id === registrationId ? {...reg, status: "rejected"} : reg
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading admin dashboard...</p>
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
            <Link href="/admin1" className="flex items-center gap-2">
              <Image 
                src="/images/logo2.jpg" 
                alt="AgriSmart Admin" 
                width={40} 
                height={40}
                className="rounded-lg"
              />
              <span className="font-bold text-secondary hidden sm:block">AgriSmart Admin</span>
            </Link>

            {/* Admin Menu */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden md:block">
                Admin Panel
              </span>
              <div className="relative group">
                <button className="flex items-center gap-2 focus:outline-none">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">A</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-modern-lg py-2 hidden group-hover:block">
                  <Link href="/admin1/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
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
          <div className="flex gap-6 mt-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-3 px-1 font-medium text-sm border-b-2 whitespace-nowrap transition-colors ${
                activeTab === "dashboard"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="mr-2">📊</span> Dashboard
            </button>
            <button
              onClick={() => setActiveTab("farmers")}
              className={`py-3 px-1 font-medium text-sm border-b-2 whitespace-nowrap transition-colors ${
                activeTab === "farmers"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="mr-2">👨‍🌾</span> Farmers
            </button>
            <Link
              href="/admin1/crops"
              className={`py-3 px-1 font-medium text-sm border-b-2 whitespace-nowrap transition-colors ${
                activeTab === "crops"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="mr-2">🌱</span> Crops
            </Link>
            <button
              onClick={() => setActiveTab("registrations")}
              className={`py-3 px-1 font-medium text-sm border-b-2 whitespace-nowrap transition-colors ${
                activeTab === "registrations"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="mr-2">📝</span> Registrations
            </button>
            <button
              onClick={() => setActiveTab("seasons")}
              className={`py-3 px-1 font-medium text-sm border-b-2 whitespace-nowrap transition-colors ${
                activeTab === "seasons"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="mr-2">📅</span> Seasons
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`py-3 px-1 font-medium text-sm border-b-2 whitespace-nowrap transition-colors ${
                activeTab === "reports"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="mr-2">📈</span> Reports
            </button>
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
                Admin Dashboard 👋
              </h2>
              <p className="opacity-90">
                Welcome back! Here's an overview of the AgriSmart platform.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-modern p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500">Total Farmers</span>
                  <span className="text-2xl">👨‍🌾</span>
                </div>
                <div className="text-3xl font-bold text-secondary">{stats.totalFarmers}</div>
                <p className="text-sm text-green-600 mt-1">↑ {stats.activeFarmers} active</p>
              </div>

              <div className="bg-white rounded-xl shadow-modern p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500">Active Crops</span>
                  <span className="text-2xl">🌱</span>
                </div>
                <div className="text-3xl font-bold text-secondary">{stats.totalCrops}</div>
                <p className="text-sm text-green-600 mt-1">{stats.activeSeasons} active seasons</p>
              </div>

              <div className="bg-white rounded-xl shadow-modern p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500">Registrations</span>
                  <span className="text-2xl">📝</span>
                </div>
                <div className="text-3xl font-bold text-secondary">{stats.totalRegistrations}</div>
                <p className="text-sm text-yellow-600 mt-1">{stats.pendingApprovals} pending</p>
              </div>

              <div className="bg-white rounded-xl shadow-modern p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500">Total Acres</span>
                  <span className="text-2xl">🌾</span>
                </div>
                <div className="text-3xl font-bold text-secondary">{stats.totalAcres}</div>
                <p className="text-sm text-blue-600 mt-1">{stats.estimatedHarvest.toLocaleString()} kg est.</p>
              </div>
            </div>

            {/* Recent Activity & Pending Approvals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pending Approvals */}
              <div className="bg-white rounded-xl shadow-modern p-6">
                <h3 className="text-lg font-semibold text-secondary mb-4">Pending Approvals</h3>
                <div className="space-y-3">
                  {registrations.filter(r => r.status === "pending").map((reg) => (
                    <div key={reg.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium text-secondary">{reg.farmerName}</p>
                        <p className="text-sm text-gray-500">{reg.cropName} • {reg.acres} acres</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveRegistration(reg.id)}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectRegistration(reg.id)}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Registrations */}
              <div className="bg-white rounded-xl shadow-modern p-6">
                <h3 className="text-lg font-semibold text-secondary mb-4">Recent Registrations</h3>
                <div className="space-y-3">
                  {registrations.slice(0, 3).map((reg) => (
                    <div key={reg.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-secondary">{reg.farmerName}</p>
                        <p className="text-sm text-gray-500">{reg.cropName} • {reg.acres} acres</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        reg.status === "approved" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                      }`}>
                        {reg.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Farmers Tab */}
        {activeTab === "farmers" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-secondary">Farmers Management</h2>
              <input
                type="text"
                placeholder="Search farmers..."
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="bg-white rounded-xl shadow-modern overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">Farmer</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">NIC</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">Phone</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">District</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">Crops</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">Acres</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {farmers.map((farmer) => (
                    <tr key={farmer.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {farmer.profilePic ? (
                            <img src={farmer.profilePic} alt={farmer.name} className="w-8 h-8 rounded-full" />
                          ) : (
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-primary text-sm font-bold">{farmer.name.charAt(0)}</span>
                            </div>
                          )}
                          <span className="font-medium text-secondary">{farmer.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{farmer.nic}</td>
                      <td className="p-4 text-gray-600">{farmer.phone}</td>
                      <td className="p-4 text-gray-600">{farmer.district}</td>
                      <td className="p-4 text-gray-600">{farmer.crops}</td>
                      <td className="p-4 text-gray-600">{farmer.totalAcres}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          farmer.status === "active" ? "bg-green-100 text-green-600" :
                          farmer.status === "pending" ? "bg-yellow-100 text-yellow-600" :
                          "bg-gray-100 text-gray-600"
                        }`}>
                          {farmer.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleViewFarmer(farmer)}
                          className="text-primary hover:text-primary-dark text-sm font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Registrations Tab */}
        {activeTab === "registrations" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-secondary">Registration Approvals</h2>

            <div className="bg-white rounded-xl shadow-modern overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">Farmer</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">Crop</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">Acres</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">Date</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">Expected Yield</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="p-4 font-medium text-secondary">{reg.farmerName}</td>
                      <td className="p-4 text-gray-600">{reg.cropName}</td>
                      <td className="p-4 text-gray-600">{reg.acres}</td>
                      <td className="p-4 text-gray-600">{reg.registrationDate}</td>
                      <td className="p-4 text-gray-600">{reg.expectedYield} kg</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          reg.status === "approved" ? "bg-green-100 text-green-600" :
                          reg.status === "pending" ? "bg-yellow-100 text-yellow-600" :
                          "bg-red-100 text-red-600"
                        }`}>
                          {reg.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {reg.status === "pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveRegistration(reg.id)}
                              className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectRegistration(reg.id)}
                              className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <button
                            className="text-primary hover:text-primary-dark text-sm font-medium"
                          >
                            View QR
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Seasons Tab */}
        {activeTab === "seasons" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-secondary">Season Management</h2>
              <button
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-modern"
              >
                + New Season
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {seasons.map((season) => (
                <div key={season.id} className="bg-white rounded-xl shadow-modern p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg text-secondary">{season.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      season.status === "active" ? "bg-green-100 text-green-600" :
                      season.status === "upcoming" ? "bg-blue-100 text-blue-600" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {season.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Duration:</span>
                      <span className="text-secondary">{season.startDate} to {season.endDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Crops:</span>
                      <span className="text-secondary">{season.crops}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Farmers:</span>
                      <span className="text-secondary">{season.farmers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Acres:</span>
                      <span className="text-secondary">{season.totalAcres}</span>
                    </div>
                  </div>

                  {season.status === "active" && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">Progress</span>
                        <span className="text-secondary font-medium">{season.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${season.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-secondary">Reports & Analytics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Summary Cards */}
              <div className="bg-white rounded-xl shadow-modern p-6">
                <h3 className="text-lg font-semibold text-secondary mb-4">Season Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Total Farmers</span>
                    <span className="font-bold text-secondary">{stats.totalFarmers}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Active Farmers</span>
                    <span className="font-bold text-secondary">{stats.activeFarmers}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Total Crops</span>
                    <span className="font-bold text-secondary">{stats.totalCrops}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Total Registrations</span>
                    <span className="font-bold text-secondary">{stats.totalRegistrations}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Total Acres</span>
                    <span className="font-bold text-secondary">{stats.totalAcres}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Estimated Revenue</span>
                    <span className="font-bold text-primary">LKR {stats.revenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Download Reports */}
              <div className="bg-white rounded-xl shadow-modern p-6">
                <h3 className="text-lg font-semibold text-secondary mb-4">Download Reports</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="block font-medium text-secondary">Farmer Report</span>
                    <span className="text-sm text-gray-500">All farmers data with registrations</span>
                  </button>
                  <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="block font-medium text-secondary">Crop Report</span>
                    <span className="text-sm text-gray-500">Crop-wise registration summary</span>
                  </button>
                  <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="block font-medium text-secondary">Season Report</span>
                    <span className="text-sm text-gray-500">Season performance analytics</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Farmer Details Modal */}
      {showFarmerModal && selectedFarmer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-modern-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-secondary">Farmer Details</h2>
                <button
                  onClick={() => setShowFarmerModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Name:</span>
                  <span className="font-medium text-secondary">{selectedFarmer.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">NIC:</span>
                  <span className="font-medium text-secondary">{selectedFarmer.nic}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Phone:</span>
                  <span className="font-medium text-secondary">{selectedFarmer.phone}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Address:</span>
                  <span className="font-medium text-secondary">{selectedFarmer.address}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">District:</span>
                  <span className="font-medium text-secondary">{selectedFarmer.district}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Registered:</span>
                  <span className="font-medium text-secondary">{selectedFarmer.registeredDate}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Crops:</span>
                  <span className="font-medium text-secondary">{selectedFarmer.crops}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Total Acres:</span>
                  <span className="font-medium text-secondary">{selectedFarmer.totalAcres}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Status:</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    selectedFarmer.status === "active" ? "bg-green-100 text-green-600" :
                    selectedFarmer.status === "pending" ? "bg-yellow-100 text-yellow-600" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {selectedFarmer.status}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowFarmerModal(false)}
                  className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}