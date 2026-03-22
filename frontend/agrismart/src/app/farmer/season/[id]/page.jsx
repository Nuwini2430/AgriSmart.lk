"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { registrationAPI } from "@/app/lib/api";

export default function SeasonDetails() {
  const router = useRouter();
  const params = useParams();
  const [season, setSeason] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEndModal, setShowEndModal] = useState(false);
  const [harvestData, setHarvestData] = useState({ actualHarvest: "", notes: "" });
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const getCropImage = (cropName) => {
    const images = {
      "Rice": "🌾", "Chili": "🌶️", "Brinjal": "🍆", "Maize": "🌽",
      "Potato": "🥔", "Onion": "🧅", "Cabbage": "🥬", "Carrot": "🥕",
      "Tomato": "🍅", "Cucumber": "🥒", "Pumpkin": "🎃"
    };
    return images[cropName] || "🌾";
  };

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/signin");
        return;
      }
      try {
        const registrations = await registrationAPI.getMyRegistrations();
        const found = registrations.find(r => r._id === params.id);
        if (found) {
          setSeason({
            _id: found._id,
            name: found.seasonName,
            cropName: found.cropName,
            cropImage: getCropImage(found.cropName),
            acres: found.acres,
            startDate: found.startDate,
            endDate: found.endDate,
            expectedYield: found.expectedYield,
            expectedIncome: found.expectedIncome,
            progress: found.progress || Math.floor(Math.random() * 30) + 10,
            status: found.status,
            isActive: found.status === "approved" || found.status === "active",
            actualHarvest: found.actualHarvest,
            actualIncome: found.actualIncome,
            notes: found.notes,
            price: found.price
          });
        } else {
          setError("Season not found");
        }
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [params.id, router]);

  const handleEndSeason = () => {
    setShowEndModal(true);
  };

  const handleConfirmEndSeason = async () => {
    if (!harvestData.actualHarvest || parseFloat(harvestData.actualHarvest) <= 0) {
      alert("Please enter actual harvest amount");
      return;
    }

    setUpdating(true);
    try {
      // Complete the registration with harvest data
      await registrationAPI.completeRegistration(season._id, {
        actualHarvest: parseFloat(harvestData.actualHarvest),
        notes: harvestData.notes
      });
      
      alert("Season ended successfully!");
      
      // Force refresh the dashboard by redirecting
      router.push("/farmer");
      
    } catch (error) {
      console.error("Error ending season:", error);
      alert(error.message || "Failed to end season");
    } finally {
      setUpdating(false);
      setShowEndModal(false);
    }
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

  if (error || !season) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{error || "Season not found"}</p>
          <Link href="/farmer" className="text-primary hover:underline">Back to Dashboard</Link>
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
              <Image src="/images/logo2.jpg" alt="AgriSmart" width={40} height={40} className="rounded-lg" />
              <span className="font-bold text-secondary">AgriSmart</span>
            </Link>
            <button onClick={() => router.back()} className="px-4 py-2 text-gray-600 hover:text-gray-800">Back</button>
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
                Started: {new Date(season.startDate).toLocaleDateString()} • {season.acres} acres
              </p>
              {season.endDate && (
                <p className="text-gray-500 text-sm">
                  Expected harvest: {new Date(season.endDate).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm ${
                season.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
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

          {/* Progress Section (for active seasons) */}
          {season.isActive && (
            <div className="bg-white rounded-xl shadow-modern p-6 mb-6">
              <h2 className="text-lg font-semibold text-secondary mb-4">Progress</h2>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Overall Progress</span>
                  <span className="font-medium text-secondary">{season.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-primary h-3 rounded-full" style={{ width: `${season.progress}%` }}></div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Expected harvest: {season.expectedYield?.toLocaleString()} kg
              </p>
            </div>
          )}

          {/* Crop Details Card */}
          <div className="bg-white rounded-xl shadow-modern p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{season.cropImage}</span>
              <div>
                <h3 className="font-semibold text-lg text-secondary">{season.cropName}</h3>
                <p className="text-sm text-gray-500">{season.acres} acres</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Yield per acre:</span>
                <span className="font-medium text-secondary">
                  {(season.expectedYield / season.acres).toFixed(0)} kg
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Expected total:</span>
                <span className="font-medium text-secondary">
                  {season.expectedYield?.toLocaleString()} kg
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Price per kg:</span>
                <span className="font-medium text-primary">
                  LKR {season.price || (season.expectedIncome / season.expectedYield).toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                <span className="text-gray-500">Expected income:</span>
                <span className="font-bold text-primary">
                  LKR {season.expectedIncome?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-primary/5 rounded-xl p-6">
            <h3 className="font-semibold text-secondary mb-3">Season Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Expected Yield</p>
                <p className="text-xl font-bold text-secondary">
                  {season.expectedYield?.toLocaleString()} kg
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Expected Income</p>
                <p className="text-xl font-bold text-primary">
                  LKR {season.expectedIncome?.toLocaleString()}
                </p>
              </div>
            </div>
            
            {/* Completed Season Details */}
            {!season.isActive && season.actualHarvest && (
              <div className="mt-4 pt-4 border-t border-primary/20">
                <h4 className="font-medium text-secondary mb-2">Actual Results</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Actual Harvest</p>
                    <p className="text-lg font-bold text-secondary">
                      {season.actualHarvest?.toLocaleString()} kg
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {((season.actualHarvest / season.expectedYield) * 100).toFixed(0)}% of expected
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Actual Income</p>
                    <p className="text-lg font-bold text-primary">
                      LKR {season.actualIncome?.toLocaleString()}
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
                    placeholder={`Expected: ${season.expectedYield} kg`}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Expected: {season.expectedYield} kg
                  </p>
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
                    disabled={updating}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {updating ? "Ending..." : "End Season"}
                  </button>
                  <button
                    onClick={() => setShowEndModal(false)}
                    className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50"
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