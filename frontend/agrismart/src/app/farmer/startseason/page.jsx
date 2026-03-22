"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { seasonAPI, registrationAPI } from "@/app/lib/api";

export default function StartSeason() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [landAcres, setLandAcres] = useState("");
  const [searched, setSearched] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [acresToRegister, setAcresToRegister] = useState("");
  const [availableSeasons, setAvailableSeasons] = useState([]);
  const [filteredSeasons, setFilteredSeasons] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showSuccess, setShowSuccess] = useState(false);

  const getCropImage = (cropName) => {
    const images = {
      "Rice": "🌾", "Chili": "🌶️", "Brinjal": "🍆", "Maize": "🌽",
      "Potato": "🥔", "Onion": "🧅", "Cabbage": "🥬", "Carrot": "🥕",
      "Tomato": "🍅", "Cucumber": "🥒", "Pumpkin": "🎃", "Beans": "🫘"
    };
    return images[cropName] || "🌾";
  };

  useEffect(() => {
    const loadSeasons = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/signin");
        return;
      }
      setLoading(true);
      try {
        const seasons = await seasonAPI.getActiveSeasons();
        setAvailableSeasons(seasons);
      } catch (error) {
        console.error(error);
        setMessage({ type: "error", text: "Failed to load available seasons" });
      } finally {
        setLoading(false);
      }
    };
    loadSeasons();
  }, [router]);

  const handleSearch = () => {
    if (!landAcres || parseFloat(landAcres) <= 0) {
      setMessage({ type: "error", text: "Please enter valid land acres" });
      return;
    }

    const acresNum = parseFloat(landAcres);
    const filtered = availableSeasons.filter(season => 
      season.remainingAcres >= acresNum && season.remainingAcres > 0
    );
    
    setFilteredSeasons(filtered);
    setSearched(true);
    setSelectedSeason(null);
    setAcresToRegister("");
    
    if (filtered.length === 0) {
      setMessage({ 
        type: "warning", 
        text: `No crops available for ${acresNum} acres. Try a smaller land area or check back later.` 
      });
    } else {
      setMessage({ type: "", text: "" });
    }
  };

  const handleRegister = async () => {
    if (!selectedSeason) {
      setMessage({ type: "error", text: "Please select a crop season" });
      return;
    }
    
    if (!acresToRegister || parseFloat(acresToRegister) <= 0) {
      setMessage({ type: "error", text: "Please enter valid acres" });
      return;
    }
    
    const acresNum = parseFloat(acresToRegister);
    const season = filteredSeasons.find(s => s._id === selectedSeason);
    
    if (acresNum > season.remainingAcres) {
      setMessage({ 
        type: "error", 
        text: `Only ${season.remainingAcres} acres remaining for ${season.crop.name}` 
      });
      return;
    }
    
    if (acresNum > parseFloat(landAcres)) {
      setMessage({ 
        type: "error", 
        text: `You cannot register more than your land area (${landAcres} acres)` 
      });
      return;
    }
    
    setSubmitting(true);
    try {
      await registrationAPI.registerCrop({ 
        seasonId: selectedSeason, 
        acres: acresNum 
      });
      
      setMessage({ 
        type: "success", 
        text: `Successfully registered for ${season.crop.name}! ${acresNum} acres approved.` 
      });
      setShowSuccess(true);
      
      setTimeout(() => {
        router.push("/farmer");
      }, 2000);
      
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Registration failed" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="navbar-modern sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/farmer" className="flex items-center gap-2 group">
              <Image src="/images/logo2.jpg" alt="AgriSmart Logo" width={40} height={40} className="rounded-lg group-hover:scale-105 transition-transform" />
              <span className="font-bold text-xl text-gray-900 hidden sm:block">AgriSmart</span>
            </Link>
            <button onClick={() => router.back()} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-secondary">Start a New Season</h1>
            <p className="text-gray-500">Enter your land acres to see available crops</p>
          </div>

          <div className="card-modern mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-secondary font-medium mb-2">Your Land Area (Acres) <span className="text-red-500">*</span></label>
                <input type="number" step="0.1" min="0.1" value={landAcres} onChange={(e) => setLandAcres(e.target.value)} placeholder="e.g., 2.5" className="input-modern" onKeyPress={(e) => e.key === 'Enter' && handleSearch()} />
                <p className="text-xs text-gray-400 mt-1">Enter the total acres you have available for cultivation</p>
              </div>
              <button onClick={handleSearch} disabled={loading} className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors shadow-modern disabled:opacity-50">{loading ? "Loading..." : "Search Available Crops"}</button>
            </div>
          </div>

          {searched && (
            <>
              {filteredSeasons.length > 0 ? (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-secondary">Crops Available for {landAcres} Acres</h2>
                    {filteredSeasons.map((season) => {
                      const maxAcresCanPlant = Math.min(season.remainingAcres, parseFloat(landAcres));
                      return (
                        <div key={season._id} onClick={() => setSelectedSeason(season._id)} className={`p-4 border rounded-xl cursor-pointer transition-all ${selectedSeason === season._id ? "border-primary bg-primary/5 shadow-modern" : "border-gray-200 hover:border-primary"}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">{getCropImage(season.crop.name)}</span>
                              <div><h3 className="font-semibold text-secondary">{season.crop.name}</h3><p className="text-sm text-gray-500">{season.name}</p></div>
                            </div>
                            <div className="text-right"><p className="font-medium text-primary">LKR {season.price}/kg</p><p className="text-xs text-gray-500">{season.yieldPerAcre} kg/acre</p></div>
                          </div>
                          <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1"><span className="text-gray-500">Registration Progress</span><span className="text-secondary font-medium">{((season.registeredAcres / season.totalAcresNeeded) * 100).toFixed(0)}%</span></div>
                            <div className="progress-modern"><div className="progress-fill" style={{ width: `${(season.registeredAcres / season.totalAcresNeeded) * 100}%` }}></div></div>
                            <p className="text-xs text-gray-400 mt-1">{season.remainingAcres} acres remaining • You can plant up to {maxAcresCanPlant} acres</p>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                            <div><p className="text-gray-500">Start Date</p><p className="text-secondary">{new Date(season.startDate).toLocaleDateString()}</p></div>
                            <div><p className="text-gray-500">End Date</p><p className="text-secondary">{new Date(season.endDate).toLocaleDateString()}</p></div>
                          </div>
                          {selectedSeason === season._id && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="mb-3"><label className="block text-secondary font-medium mb-2 text-sm">Acres to Plant</label><input type="number" step="0.1" min="0.1" max={maxAcresCanPlant} value={acresToRegister} onChange={(e) => setAcresToRegister(e.target.value)} placeholder={`Max: ${maxAcresCanPlant} acres`} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" /></div>
                              {acresToRegister && parseFloat(acresToRegister) > 0 && (
                                <div className="bg-primary/5 p-3 rounded-lg mb-3">
                                  <p className="text-sm font-medium text-secondary mb-1">Expected Output</p>
                                  <div className="space-y-1 text-sm">
                                    <div className="flex justify-between"><span className="text-gray-500">Yield:</span><span className="text-secondary font-medium">{(parseFloat(acresToRegister) * season.yieldPerAcre).toFixed(0)} kg</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Income:</span><span className="font-bold text-primary">LKR {(parseFloat(acresToRegister) * season.yieldPerAcre * season.price).toLocaleString()}</span></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {selectedSeason && acresToRegister && parseFloat(acresToRegister) > 0 && (
                    <div className="card-modern">
                      <h3 className="text-lg font-semibold text-secondary mb-4">Registration Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between"><span className="text-gray-500">Crop:</span><span className="font-medium text-secondary">{filteredSeasons.find(s => s._id === selectedSeason)?.crop.name}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Acres:</span><span className="font-medium text-secondary">{acresToRegister} acres</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Expected Yield:</span><span className="font-medium text-primary">{(parseFloat(acresToRegister) * filteredSeasons.find(s => s._id === selectedSeason)?.yieldPerAcre).toFixed(0)} kg</span></div>
                        <div className="flex justify-between pt-2 border-t border-gray-200"><span className="text-gray-500">Expected Income:</span><span className="font-bold text-primary">LKR {(parseFloat(acresToRegister) * filteredSeasons.find(s => s._id === selectedSeason)?.yieldPerAcre * filteredSeasons.find(s => s._id === selectedSeason)?.price).toLocaleString()}</span></div>
                      </div>
                    </div>
                  )}

                  {message.text && <div className={`p-3 rounded-lg ${message.type === "success" ? "bg-green-50 text-green-600" : message.type === "warning" ? "bg-yellow-50 text-yellow-600" : "bg-red-50 text-red-600"}`}>{message.text}</div>}
                  {showSuccess && <div className="bg-green-50 border border-green-200 rounded-lg p-4"><p className="text-green-600 text-center">✓ Registration successful! Redirecting to dashboard...</p></div>}
                  {selectedSeason && acresToRegister && parseFloat(acresToRegister) > 0 && (
                    <button onClick={handleRegister} disabled={submitting || showSuccess} className="btn-primary-modern w-full disabled:opacity-50">{submitting ? "Processing..." : "Confirm Registration"}</button>
                  )}
                </div>
              ) : (
                <div className="card-modern text-center py-12"><div className="text-6xl mb-4">🌾</div><p className="text-gray-500 mb-2">No crops available for {landAcres} acres</p><p className="text-sm text-gray-400">Try a smaller land area or check back later when new seasons start</p></div>
              )}
            </>
          )}

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-blue-800 mb-1">ℹ️ How it works</h4>
            <p className="text-xs text-blue-600">• First, enter your land acres to see which crops you can cultivate<br />• Only crops with enough remaining acres will be shown<br />• You can register up to your land area or available acres, whichever is smaller<br />• Registration is auto-approved if acres are available<br />• Once total required acres are filled, registration closes<br />• This ensures fair prices and prevents overproduction</p>
          </div>
        </div>
      </main>
    </div>
  );
}