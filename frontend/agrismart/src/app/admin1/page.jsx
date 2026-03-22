"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cropAPI, farmerAPI, seasonAPI } from "@/app/lib/api";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [showAddSeasonModal, setShowAddSeasonModal] = useState(false);
  const [showAddCropModal, setShowAddCropModal] = useState(false);
  const [newSeasonData, setNewSeasonData] = useState({
    cropName: "",
    cropId: null,
    seasonName: "",
    startDate: "",
    endDate: "",
    requiredHarvest: "",
    yieldPerAcre: "",
    price: ""
  });
  const [newCropData, setNewCropData] = useState({
    name: "",
    image: "🌾"
  });
  
  const [crops, setCrops] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [stats, setStats] = useState({});

  const cropImages = [
    "🌾", "🌶️", "🍆", "🌽", "🥔", "🧅", "🥬", "🥕", "🍅", "🥒", 
    "🫑", "🥦", "🧄", "🫘", "🌿", "🍠", "🥜", "🌻", "🍓", "🍊"
  ];

  const refreshData = async () => {
    try {
      const cropsData = await cropAPI.getAllCrops();
      const seasonsData = await seasonAPI.getActiveSeasons();
      
      const cropsWithSeasons = cropsData.map(crop => {
        const activeSeason = seasonsData.find(s => 
          s.crop?._id === crop._id || s.crop === crop._id
        );
        return {
          ...crop,
          hasActiveSeason: !!activeSeason,
          seasonName: activeSeason?.name || null,
          seasonDetails: activeSeason || null
        };
      });
      
      setCrops(cropsWithSeasons);
      
      const farmersData = await farmerAPI.getAllFarmers();
      setFarmers(farmersData);
      
      setStats({
        totalFarmers: farmersData.length,
        activeSeasons: seasonsData.length,
        totalCrops: cropsData.length,
        totalAcres: farmersData.reduce((sum, f) => sum + (f.totalAcres || 0), 0)
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("userRole");
      
      if (!token) {
        router.push("/signin");
        return;
      }
      
      if (role !== "admin") {
        router.push("/farmer");
        return;
      }
      
      try {
        await refreshData();
      } catch (error) {
        console.error("Error loading data:", error);
        if (error.message === "Not authorized") {
          router.push("/signin");
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  const handleViewCropDetails = (crop) => {
    if (crop.hasActiveSeason) {
      setSelectedCrop(crop);
      setShowCropModal(true);
    } else {
      setNewSeasonData({ ...newSeasonData, cropName: crop.name, cropId: crop._id });
      setShowAddSeasonModal(true);
    }
  };

  const handleAddCrop = async () => {
    if (!newCropData.name.trim()) {
      alert("Please enter crop name");
      return;
    }

    try {
      await cropAPI.addCrop({
        name: newCropData.name,
        image: newCropData.image
      });
      
      await refreshData();
      
      setShowAddCropModal(false);
      setNewCropData({ name: "", image: "🌾" });
      alert(`${newCropData.name} added successfully!`);
    } catch (error) {
      alert(error.message || "Failed to add crop");
    }
  };

  const handleAddSeason = async () => {
    if (!newSeasonData.seasonName || !newSeasonData.startDate || !newSeasonData.endDate || 
        !newSeasonData.requiredHarvest || !newSeasonData.yieldPerAcre || !newSeasonData.price) {
      alert("Please fill all fields");
      return;
    }

    try {
      await seasonAPI.startSeason({
        cropId: newSeasonData.cropId,
        name: newSeasonData.seasonName,
        startDate: newSeasonData.startDate,
        endDate: newSeasonData.endDate,
        requiredHarvest: parseFloat(newSeasonData.requiredHarvest),
        yieldPerAcre: parseFloat(newSeasonData.yieldPerAcre),
        price: parseFloat(newSeasonData.price)
      });
      
      await refreshData();
      
      setShowAddSeasonModal(false);
      setNewSeasonData({ cropName: "", cropId: null, seasonName: "", startDate: "", endDate: "", requiredHarvest: "", yieldPerAcre: "", price: "" });
      alert("New season added successfully!");
    } catch (error) {
      console.error("Add season error:", error);
      alert(error.message || "Failed to add season");
    }
  };

  const handleEndSeason = async (cropId) => {
    try {
      // Make sure we have a valid season ID
      const crop = crops.find(c => c._id === cropId);
      if (!crop || !crop.seasonDetails) {
        alert("No active season found for this crop");
        return;
      }
      
      const seasonId = crop.seasonDetails._id;
      console.log("Ending season with ID:", seasonId);
      
      await seasonAPI.endSeason(seasonId);
      await refreshData();
      setShowCropModal(false);
      alert("Season ended successfully!");
    } catch (error) {
      console.error("Error ending season:", error);
      alert(error.message || "Failed to end season");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-up">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="navbar-modern sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin1" className="flex items-center gap-2 group">
              <Image src="/images/logo2.jpg" alt="AgriSmart Logo" width={40} height={40} className="rounded-lg group-hover:scale-105 transition-transform" />
              <span className="font-bold text-xl text-gray-900 hidden sm:block">AgriSmart Admin</span>
            </Link>

            <div className="relative">
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2 focus:outline-none group">
                <div className="w-9 h-9 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center shadow-modern group-hover:scale-105 transition-transform">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
                <svg className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-modern-lg py-2 z-50 animate-scale-in">
                  <Link href="/admin1/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors">Settings</Link>
                  <hr className="my-2" />
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">Sign Out</button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-2 pb-2 overflow-x-auto">
            <button onClick={() => setActiveTab("dashboard")} className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${activeTab === "dashboard" ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-modern" : "text-gray-600 hover:bg-gray-100"}`}>
              <span className="mr-2">📊</span> Dashboard
            </button>
            <button onClick={() => setActiveTab("farmers")} className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${activeTab === "farmers" ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-modern" : "text-gray-600 hover:bg-gray-100"}`}>
              <span className="mr-2">👨‍🌾</span> Farmers
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-fade-up">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-secondary">All Crops</h2>
                <p className="text-sm text-gray-500 mt-1">{crops.filter(c => c.hasActiveSeason).length} Active • {crops.filter(c => !c.hasActiveSeason).length} Inactive</p>
              </div>
              <button onClick={() => setShowAddCropModal(true)} className="btn-primary-modern flex items-center gap-2"><span className="text-lg">+</span> Add New Crop</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {crops.map((crop) => (
                <div key={crop._id} onClick={() => handleViewCropDetails(crop)} className="bg-white rounded-2xl shadow-modern p-4 cursor-pointer transition-all duration-300 hover:shadow-modern-lg hover:-translate-y-1 text-center">
                  <div className="text-5xl mb-3">{crop.image}</div>
                  <h3 className="font-semibold text-secondary text-lg">{crop.name}</h3>
                  <div className="mt-2">
                    {crop.hasActiveSeason ? (
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">Active</span>
                    ) : (
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">Inactive</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-3">{crop.hasActiveSeason ? "Click to view details" : "Click to add season"}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "farmers" && (
          <div className="space-y-6 animate-fade-up">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-secondary">All Farmers</h2>
              <input type="text" placeholder="Search farmers..." className="input-modern w-64" />
            </div>

            <div className="card-modern overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead><tr className="bg-gray-50"><th className="p-4 text-left text-sm font-medium text-gray-500">Farmer</th><th className="p-4 text-left text-sm font-medium text-gray-500">NIC</th><th className="p-4 text-left text-sm font-medium text-gray-500">Phone</th><th className="p-4 text-left text-sm font-medium text-gray-500">District</th><th className="p-4 text-left text-sm font-medium text-gray-500">Registered Date</th><th className="p-4 text-left text-sm font-medium text-gray-500">Crops</th><th className="p-4 text-left text-sm font-medium text-gray-500">Total Acres</th><th className="p-4 text-left text-sm font-medium text-gray-500">Status</th>  </tr></thead>
                  <tbody>
                    {farmers.map((farmer) => (
                      <tr key={farmer._id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="p-4"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center"><span className="text-primary text-sm font-bold">{farmer.fullName?.charAt(0) || "F"}</span></div><span className="font-medium text-secondary">{farmer.fullName || farmer.name}</span></div></td>
                        <td className="p-4 text-gray-600">{farmer.nicNumber || farmer.nic}</td>
                        <td className="p-4 text-gray-600">{farmer.phoneNumber || farmer.phone}</td>
                        <td className="p-4 text-gray-600">{farmer.district}</td>
                        <td className="p-4 text-gray-600">{new Date(farmer.createdAt || farmer.registeredDate).toLocaleDateString()}</td>
                        <td className="p-4 text-gray-600"><div className="flex flex-wrap gap-1">{farmer.crops?.map((crop, i) => (<span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-xs">{crop}</span>)) || "-"}</div></td>
                        <td className="p-4 text-gray-600">{farmer.totalAcres || 0} acres</td>
                        <td className="p-4"><span className={`badge-modern ${farmer.status === "active" ? "badge-active" : "badge-pending"}`}>{farmer.status || "active"}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Crop Details Modal */}
      {showCropModal && selectedCrop && selectedCrop.hasActiveSeason && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-modern-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-start">
              <div className="flex items-center gap-3"><div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-3xl">{selectedCrop.image}</div><div><h2 className="text-xl font-bold text-secondary">{selectedCrop.name}</h2><p className="text-sm text-gray-500">{selectedCrop.seasonName}</p></div></div>
              <button onClick={() => setShowCropModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">✕</button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl"><p className="text-sm text-gray-500">Season Period</p><p className="font-semibold text-secondary">{new Date(selectedCrop.seasonDetails.startDate).toLocaleDateString()} → {new Date(selectedCrop.seasonDetails.endDate).toLocaleDateString()}</p></div>
                <div className="p-4 bg-gray-50 rounded-xl"><p className="text-sm text-gray-500">Days Remaining</p><p className="font-semibold text-secondary">{Math.ceil((new Date(selectedCrop.seasonDetails.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days</p></div>
              </div>

              <div className="bg-primary/5 rounded-xl p-4">
                <h3 className="font-semibold text-secondary mb-3">Crop Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Required Harvest</span><span className="font-medium text-secondary">{selectedCrop.seasonDetails.requiredHarvest.toLocaleString()} kg</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Yield per Acre</span><span className="font-medium text-secondary">{selectedCrop.seasonDetails.yieldPerAcre} kg</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Total Acres Needed</span><span className="font-medium text-secondary">{selectedCrop.seasonDetails.totalAcresNeeded} acres</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Registered Acres</span><span className="font-medium text-primary">{selectedCrop.seasonDetails.registeredAcres} acres</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Remaining Acres</span><span className="font-medium text-primary">{selectedCrop.seasonDetails.remainingAcres} acres</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Price/kg</span><span className="font-medium text-primary">LKR {selectedCrop.seasonDetails.price}</span></div>
                </div>
                <div className="mt-3"><div className="flex justify-between text-xs mb-1"><span className="text-gray-500">Registration Progress</span><span className="text-secondary font-medium">{selectedCrop.seasonDetails.progress}%</span></div><div className="progress-modern"><div className="progress-fill" style={{ width: `${selectedCrop.seasonDetails.progress}%` }}></div></div></div>
              </div>

              <div><h3 className="font-semibold text-secondary mb-3">Registered Farmers ({selectedCrop.seasonDetails.registeredFarmers?.length || 0})</h3><div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr><th className="p-3 text-left text-sm font-medium text-gray-500">Farmer Name</th><th className="p-3 text-left text-sm font-medium text-gray-500">NIC</th><th className="p-3 text-left text-sm font-medium text-gray-500">Phone</th><th className="p-3 text-left text-sm font-medium text-gray-500">Acres</th><th className="p-3 text-left text-sm font-medium text-gray-500">Registration Date</th></tr></thead><tbody>{selectedCrop.seasonDetails.registeredFarmers?.map((farmer, idx) => (<tr key={idx} className="border-t border-gray-100"><td className="p-3 text-secondary">{farmer.name}</td><td className="p-3 text-gray-600">{farmer.nic}</td><td className="p-3 text-gray-600">{farmer.phone}</td><td className="p-3 text-secondary">{farmer.acres} acres</td><td className="p-3 text-gray-600">{farmer.date}</td></tr>))}</tbody></table></div></div>

              <div className="flex gap-3 pt-4 border-t border-gray-100"><button onClick={() => handleEndSeason(selectedCrop._id)} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors">End Season</button><button onClick={() => setShowCropModal(false)} className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition-colors">Close</button></div>
            </div>
          </div>
        </div>
      )}

      {/* Add Season Modal */}
      {showAddSeasonModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-modern-xl max-w-md w-full animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4"><h2 className="text-xl font-bold text-secondary">Start New Season</h2><button onClick={() => setShowAddSeasonModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">✕</button></div>
              <p className="text-gray-500 mb-4">Starting new season for <span className="font-semibold text-primary">{newSeasonData.cropName}</span></p>
              <div className="space-y-4">
                <div><label className="block text-secondary font-medium mb-2">Season Name *</label><input type="text" placeholder="e.g., Maha 2024, Yala 2024" value={newSeasonData.seasonName} onChange={(e) => setNewSeasonData({...newSeasonData, seasonName: e.target.value})} className="input-modern" /></div>
                <div><label className="block text-secondary font-medium mb-2">Start Date *</label><input type="date" value={newSeasonData.startDate} onChange={(e) => setNewSeasonData({...newSeasonData, startDate: e.target.value})} className="input-modern" /></div>
                <div><label className="block text-secondary font-medium mb-2">End Date *</label><input type="date" value={newSeasonData.endDate} onChange={(e) => setNewSeasonData({...newSeasonData, endDate: e.target.value})} className="input-modern" /></div>
                <div><label className="block text-secondary font-medium mb-2">Required Harvest (kg) *</label><input type="number" placeholder="e.g., 500000" value={newSeasonData.requiredHarvest} onChange={(e) => setNewSeasonData({...newSeasonData, requiredHarvest: e.target.value})} className="input-modern" /></div>
                <div><label className="block text-secondary font-medium mb-2">Yield per Acre (kg) *</label><input type="number" placeholder="e.g., 1000" value={newSeasonData.yieldPerAcre} onChange={(e) => setNewSeasonData({...newSeasonData, yieldPerAcre: e.target.value})} className="input-modern" /></div>
                <div><label className="block text-secondary font-medium mb-2">Price per kg (LKR) *</label><input type="number" placeholder="e.g., 150" value={newSeasonData.price} onChange={(e) => setNewSeasonData({...newSeasonData, price: e.target.value})} className="input-modern" /></div>
                {newSeasonData.requiredHarvest && newSeasonData.yieldPerAcre && (<div className="p-3 bg-primary/10 rounded-xl"><p className="text-sm text-primary"><span className="font-medium">Total Acres Needed:</span> {(parseFloat(newSeasonData.requiredHarvest) / parseFloat(newSeasonData.yieldPerAcre)).toFixed(2)} acres</p></div>)}
              </div>
              <div className="flex gap-3 mt-6"><button onClick={handleAddSeason} className="flex-1 bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors">Start Season</button><button onClick={() => setShowAddSeasonModal(false)} className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button></div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Crop Modal */}
      {showAddCropModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-modern-xl max-w-md w-full animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4"><h2 className="text-xl font-bold text-secondary">Add New Crop</h2><button onClick={() => setShowAddCropModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">✕</button></div>
              <div className="space-y-4">
                <div><label className="block text-secondary font-medium mb-2">Crop Name *</label><input type="text" placeholder="e.g., Tomato, Watermelon" value={newCropData.name} onChange={(e) => setNewCropData({...newCropData, name: e.target.value})} className="input-modern" /></div>
                <div><label className="block text-secondary font-medium mb-2">Select Emoji *</label><div className="grid grid-cols-5 gap-2 p-3 bg-gray-50 rounded-xl">{cropImages.map((emoji, idx) => (<button key={idx} onClick={() => setNewCropData({...newCropData, image: emoji})} className={`text-3xl p-2 rounded-lg transition-all ${newCropData.image === emoji ? "bg-primary/20 ring-2 ring-primary" : "hover:bg-gray-200"}`}>{emoji}</button>))}</div></div>
                <div className="p-3 bg-blue-50 rounded-xl"><p className="text-sm text-blue-600"><span className="font-medium">Note:</span> New crop will be added as Inactive. You can add a season later by clicking on the crop card.</p></div>
              </div>
              <div className="flex gap-3 mt-6"><button onClick={handleAddCrop} className="flex-1 bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors">Add Crop</button><button onClick={() => setShowAddCropModal(false)} className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}