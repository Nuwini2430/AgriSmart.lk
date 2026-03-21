"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function SeasonDetails() {
  const router = useRouter();
  const params = useParams();
  const [season, setSeason] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEndModal, setShowEndModal] = useState(false);
  const [harvestData, setHarvestData] = useState({
    actualHarvest: "",
    notes: ""
  });

  useEffect(() => {
    const seasonId = parseInt(params.id);
    
    // Load active seasons from localStorage
    const farmerSeasons = JSON.parse(localStorage.getItem("farmerSeasons") || "[]");
    const pastSeasons = JSON.parse(localStorage.getItem("farmerPastSeasons") || "[]");
    
    // Find in active seasons first
    let foundSeason = farmerSeasons.find(s => s.id === seasonId && s.status === "active");
    let isActive = true;
    
    if (!foundSeason) {
      foundSeason = pastSeasons.find(s => s.id === seasonId);
      isActive = false;
    }
    
    if (foundSeason) {
      // Format the season data for display
      setSeason({
        id: foundSeason.id,
        name: foundSeason.seasonName,
        landAcres: foundSeason.acres,
        startDate: foundSeason.startDate,
        endDate: foundSeason.endDate,
        crops: [{
          id: foundSeason.cropId,
          name: foundSeason.cropName,
          image: getCropImage(foundSeason.cropName),
          yieldPerAcre: foundSeason.yieldPerAcre,
          price: foundSeason.price,
          acres: foundSeason.acres,
          expectedYield: foundSeason.expectedYield,
          expectedIncome: foundSeason.expectedIncome
        }],
        progress: 0,
        status: foundSeason.status,
        expectedHarvest: foundSeason.endDate,
        expectedIncome: foundSeason.expectedIncome,
        isActive: isActive,
        actualHarvest: foundSeason.actualHarvest,
        income: foundSeason.income,
        notes: foundSeason.notes
      });
    } else {
      // Fallback mock data
      setSeason({
        id: seasonId,
        name: "Maha 2024",
        landAcres: 2.5,
        startDate: "2024-01-15",
        endDate: "2024-04-15",
        crops: [
          { id: 1, name: "Rice", image: "🌾", yieldPerAcre: 1000, price: 150, acres: 2.5, expectedYield: 2500, expectedIncome: 375000 }
        ],
        progress: 65,
        status: "active",
        expectedHarvest: "2024-04-15",
        expectedIncome: 375000,
        isActive: true
      });
    }
    
    setLoading(false);
  }, [params.id]);

  const getCropImage = (cropName) => {
    const images = {
      "Rice": "🌾",
      "Chili": "🌶️",
      "Brinjal": "🍆",
      "Maize": "🌽",
      "Potato": "🥔",
      "Onion": "🧅",
      "Cabbage": "🥬",
      "Carrot": "🥕"
    };
    return images[cropName] || "🌾";
  };

  const handleEndSeason = () => {
    setShowEndModal(true);
  };

  const handleConfirmEndSeason = () => {
    if (!harvestData.actualHarvest || parseFloat(harvestData.actualHarvest) <= 0) {
      alert("Please enter actual harvest amount");
      return;
    }

    // Get current active seasons
    const farmerSeasons = JSON.parse(localStorage.getItem("farmerSeasons") || "[]");
    const completedSeason = farmerSeasons.find(s => s.id === season.id);
    const updatedActive = farmerSeasons.filter(s => s.id !== season.id);
    
    // Add to past seasons
    const pastSeasons = JSON.parse(localStorage.getItem("farmerPastSeasons") || "[]");
    const newPastSeason = {
      ...completedSeason,
      status: "completed",
      endDate: new Date().toISOString().split('T')[0],
      actualHarvest: parseFloat(harvestData.actualHarvest),
      notes: harvestData.notes,
      income: parseFloat(harvestData.actualHarvest) * (season.crops[0]?.price || 150)
    };
    
    pastSeasons.push(newPastSeason);
    
    // Save to localStorage
    localStorage.setItem("farmerSeasons", JSON.stringify(updatedActive));
    localStorage.setItem("farmerPastSeasons", JSON.stringify(pastSeasons));
    
    setSeason({ ...newPastSeason, isActive: false });
    setShowEndModal(false);
    
    alert("Season ended successfully!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading season details...</p>
        </div>
      </div>
    );
  }

  if (!season) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Season not found</p>
          <Link href="/farmer" className="text-primary hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-modern sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/farmer" className="flex items-center gap-2">
              <Image 
                src="/images/logo2.jpg" 
                alt="AgriSmart" 
                width={40} 
                height={40}
                className="rounded-lg"
              />
              <span className="font-bold text-secondary">AgriSmart</span>
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Season Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-secondary">{season.name}</h1>
              <p className="text-gray-500">
                Started: {season.startDate} • {season.landAcres} acres
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm ${
                season.isActive 
                  ? "bg-green-100 text-green-600" 
                  : "bg-gray-100 text-gray-600"
              }`}>
                {season.isActive ? "Active" : "Completed"}
              </span>
              {season.isActive && (
                <button
                  onClick={handleEndSeason}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  End Season
                </button>
              )}
            </div>
          </div>

          {/* Crops Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {season.crops?.map((crop, index) => (
              <div key={index} className="bg-white rounded-xl shadow-modern p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{crop.image}</span>
                  <div>
                    <h3 className="font-semibold text-lg text-secondary">{crop.name}</h3>
                    <p className="text-sm text-gray-500">{crop.acres} acres</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Yield per acre:</span>
                    <span className="font-medium text-secondary">{crop.yieldPerAcre} kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Expected total:</span>
                    <span className="font-medium text-secondary">
                      {crop.expectedYield || (crop.acres * crop.yieldPerAcre)} kg
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Price per kg:</span>
                    <span className="font-medium text-primary">LKR {crop.price}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                    <span className="text-gray-500">Expected income:</span>
                    <span className="font-bold text-primary">
                      LKR {(crop.expectedIncome || (crop.acres * crop.yieldPerAcre * crop.price)).toLocaleString()}
                    </span>
                  </div>
                </div>

                {!season.isActive && season.actualHarvest && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">
                      Actual harvest: {season.actualHarvest} kg
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary Card */}
          <div className="bg-primary/5 rounded-xl p-6">
            <h3 className="font-semibold text-secondary mb-3">Season Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Expected Yield</p>
                <p className="text-xl font-bold text-secondary">
                  {season.crops?.reduce((total, c) => total + (c.expectedYield || (c.acres * c.yieldPerAcre)), 0).toLocaleString()} kg
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Expected Income</p>
                <p className="text-xl font-bold text-primary">
                  LKR {season.crops?.reduce((total, c) => total + (c.expectedIncome || (c.acres * c.yieldPerAcre * c.price)), 0).toLocaleString()}
                </p>
              </div>
            </div>
            
            {!season.isActive && (
              <div className="mt-4 pt-4 border-t border-primary/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Actual Harvest</p>
                    <p className="text-lg font-bold text-secondary">
                      {season.actualHarvest?.toLocaleString()} kg
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Actual Income</p>
                    <p className="text-lg font-bold text-primary">
                      LKR {season.income?.toLocaleString()}
                    </p>
                  </div>
                </div>
                {season.notes && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="text-sm text-secondary">{season.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* End Season Modal */}
      {showEndModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-modern-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-secondary mb-4">End Season</h2>
              <p className="text-sm text-gray-500 mb-4">
                Please enter the actual harvest details for {season.name}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-secondary font-medium mb-2">
                    Actual Harvest (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={harvestData.actualHarvest}
                    onChange={(e) => setHarvestData({...harvestData, actualHarvest: e.target.value})}
                    placeholder="e.g., 2500"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-secondary font-medium mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={harvestData.notes}
                    onChange={(e) => setHarvestData({...harvestData, notes: e.target.value})}
                    placeholder="Any remarks about this season..."
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleConfirmEndSeason}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    End Season
                  </button>
                  <button
                    onClick={() => setShowEndModal(false)}
                    className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}