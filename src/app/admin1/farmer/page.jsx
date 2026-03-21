"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function AdminFarmers() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [farmers, setFarmers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showFarmerModal, setShowFarmerModal] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/signin");
      return;
    }

    // ========== LOAD FARMERS FROM LOCALSTORAGE ==========
    // Get all registered farmers from userProfile
    const allUsers = [];
    
    // Check if there are any registered users
    // In a real app, you'd have a users array in localStorage
    // For now, we'll get from userProfile and add mock data
    
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    const userPhone = localStorage.getItem("userPhone") || "";
    
    // Get farmer seasons to know which crops they have
    const farmerSeasons = JSON.parse(localStorage.getItem("farmerSeasons") || "[]");
    
    // Create farmers list
    const farmersList = [];
    
    // Add current logged in farmer (if profile exists)
    if (userProfile.fullName) {
      // Get crops from farmerSeasons
      const farmerCrops = farmerSeasons
        .filter(s => s.status === "active" || s.status === "completed")
        .map(s => s.cropName);
      const uniqueCrops = [...new Set(farmerCrops)];
      
      farmersList.push({
        id: 1,
        name: userProfile.fullName,
        nic: userProfile.nicNumber || "N/A",
        phone: userPhone,
        address: userProfile.address || "N/A",
        district: userProfile.district || "N/A",
        registeredDate: new Date().toISOString().split('T')[0],
        status: "active",
        crops: uniqueCrops.length > 0 ? uniqueCrops : ["No crops yet"],
        totalAcres: farmerSeasons.reduce((sum, s) => sum + s.acres, 0),
        email: userProfile.email || "N/A",
        birthday: userProfile.birthday || "N/A",
        profilePic: userProfile.profilePic || null
      });
    }
    
    // Add mock farmers for demo (if no real farmers)
    if (farmersList.length === 0) {
      farmersList.push(
        { 
          id: 1, 
          name: "Kamal Perera", 
          nic: "821234567V", 
          phone: "0712345678", 
          address: "123 Main Street, Kurunegala",
          district: "Kurunegala", 
          registeredDate: "2024-01-10", 
          status: "active", 
          crops: ["Rice", "Chili"], 
          totalAcres: 4.0,
          email: "kamal@email.com",
          birthday: "1982-05-15",
          profilePic: null
        },
        { 
          id: 2, 
          name: "Nimali Fernando", 
          nic: "88654321V", 
          phone: "0723456789", 
          address: "45 Lake Road, Matale",
          district: "Matale", 
          registeredDate: "2024-01-12", 
          status: "active", 
          crops: ["Rice", "Brinjal"], 
          totalAcres: 3.5,
          email: "nimali@email.com",
          birthday: "1985-08-22",
          profilePic: null
        },
        { 
          id: 3, 
          name: "Priyani Jayawardena", 
          nic: "200012345678", 
          phone: "0765678901", 
          address: "78 Beach Road, Galle",
          district: "Galle", 
          registeredDate: "2024-01-15", 
          status: "active", 
          crops: ["Rice"], 
          totalAcres: 3.0,
          email: "priyani@email.com",
          birthday: "1990-03-10",
          profilePic: null
        }
      );
    }
    
    setFarmers(farmersList);
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

  const filteredFarmers = farmers.filter(farmer =>
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.nic.includes(searchTerm) ||
    farmer.phone.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-up">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading farmers data...</p>
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
            <Link href="/admin1" className="flex items-center gap-2 group">
              <Image 
                src="/images/logo2.jpg" 
                alt="AgriSmart Logo" 
                width={40} 
                height={40}
                className="rounded-lg group-hover:scale-105 transition-transform"
              />
              <span className="font-bold text-xl text-gray-900 hidden sm:block">
                AgriSmart Admin
              </span>
            </Link>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 focus:outline-none group"
              >
                <div className="w-9 h-9 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center shadow-modern group-hover:scale-105 transition-transform">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
                <svg className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-modern-lg py-2 z-50 animate-scale-in">
                  <Link href="/admin1/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors">
                    Settings
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

          <div className="flex justify-center gap-2 pb-2 overflow-x-auto">
            <Link href="/admin1" className="px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 text-gray-600 hover:bg-gray-100">
              <span className="mr-2">📊</span> Dashboard
            </Link>
            <button className="px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 bg-gradient-to-r from-primary to-primary-dark text-white shadow-modern">
              <span className="mr-2">👨‍🌾</span> Farmers
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6 animate-fade-up">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-secondary">All Farmers</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search by name, NIC, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-modern w-64"
              />
              <button className="btn-primary-modern px-4 py-2 text-sm">
                Export
              </button>
            </div>
          </div>

          <div className="card-modern overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-4 text-left text-sm font-medium text-gray-500">Farmer</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">NIC</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">Phone</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">District</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">Registered Date</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">Crops</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">Total Acres</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFarmers.map((farmer) => (
                    <tr key={farmer.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {farmer.profilePic ? (
                            <img src={farmer.profilePic} alt={farmer.name} className="w-8 h-8 rounded-full object-cover" />
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
                      <td className="p-4 text-gray-600">{farmer.registeredDate}</td>
                      <td className="p-4 text-gray-600">
                        <div className="flex flex-wrap gap-1">
                          {farmer.crops.map((crop, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-xs">{crop}</span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{farmer.totalAcres} acres</td>
                      <td className="p-4">
                        <span className={`badge-modern ${
                          farmer.status === "active" ? "badge-active" : "badge-pending"
                        }`}>
                          {farmer.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleViewFarmer(farmer)}
                          className="text-primary hover:text-primary-dark text-sm font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Farmer Details Modal */}
      {showFarmerModal && selectedFarmer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-modern-xl max-w-md w-full animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-secondary">Farmer Details</h2>
                <button
                  onClick={() => setShowFarmerModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Name:</span>
                  <span className="font-medium text-secondary">{selectedFarmer.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">NIC:</span>
                  <span className="font-medium text-secondary">{selectedFarmer.nic}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Phone:</span>
                  <span className="font-medium text-secondary">{selectedFarmer.phone}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium text-secondary">{selectedFarmer.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Address:</span>
                  <span className="font-medium text-secondary">{selectedFarmer.address}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">District:</span>
                  <span className="font-medium text-secondary">{selectedFarmer.district}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Birthday:</span>
                  <span className="font-medium text-secondary">{selectedFarmer.birthday}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Registered Date:</span>
                  <span className="font-medium text-secondary">{selectedFarmer.registeredDate}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Crops:</span>
                  <span className="font-medium text-secondary">{selectedFarmer.crops.join(", ")}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Total Acres:</span>
                  <span className="font-medium text-secondary">{selectedFarmer.totalAcres} acres</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Status:</span>
                  <span className={`badge-modern ${
                    selectedFarmer.status === "active" ? "badge-active" : "badge-pending"
                  }`}>
                    {selectedFarmer.status}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowFarmerModal(false)}
                  className="w-full btn-primary-modern"
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