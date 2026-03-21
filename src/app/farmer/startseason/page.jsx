"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function StartSeason() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [acresToRegister, setAcresToRegister] = useState("");
  const [availableCrops, setAvailableCrops] = useState([]);
  const [farmer, setFarmer] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    
    if (!isLoggedIn) {
      router.push("/signin");
      return;
    }

    setFarmer({
      name: userProfile.fullName || "John Doe",
      nic: userProfile.nicNumber || "821234567V",
      phone: localStorage.getItem("userPhone") || "0712345678"
    });

    // Load crops from admin
    const allCrops = JSON.parse(localStorage.getItem("crops") || "[]");
    
    // Filter active crops with remaining acres
    const activeCrops = allCrops.filter(crop => 
      crop.hasActiveSeason === true && 
      crop.seasonDetails && 
      crop.seasonDetails.remainingAcres > 0
    );
    
    const formattedCrops = activeCrops.map(crop => ({
      id: crop.id,
      name: crop.name,
      image: crop.image,
      seasonName: crop.seasonName,
      yieldPerAcre: crop.seasonDetails.yieldPerAcre,
      price: crop.seasonDetails.price,
      totalAcresNeeded: crop.seasonDetails.totalAcresNeeded,
      registeredAcres: crop.seasonDetails.registeredAcres,
      remainingAcres: crop.seasonDetails.remainingAcres,
      startDate: crop.seasonDetails.startDate,
      endDate: crop.seasonDetails.endDate
    }));
    
    setAvailableCrops(formattedCrops);
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
      "Carrot": "🥕"
    };
    return images[cropName] || "🌾";
  };

  const handleRegister = () => {
    if (!selectedCrop) {
      setMessage({ type: "error", text: "Please select a crop" });
      return;
    }
    
    if (!acresToRegister || parseFloat(acresToRegister) <= 0) {
      setMessage({ type: "error", text: "Please enter valid acres" });
      return;
    }
    
    const acresNum = parseFloat(acresToRegister);
    const crop = availableCrops.find(c => c.id === selectedCrop);
    
    if (acresNum > crop.remainingAcres) {
      setMessage({ 
        type: "error", 
        text: `Only ${crop.remainingAcres} acres remaining for ${crop.name}` 
      });
      return;
    }
    
    // Update crops in localStorage (admin side)
    const allCrops = JSON.parse(localStorage.getItem("crops") || "[]");
    const updatedCrops = allCrops.map(c => {
      if (c.id === selectedCrop && c.hasActiveSeason) {
        const newRegisteredAcres = c.seasonDetails.registeredAcres + acresNum;
        const newRemainingAcres = c.seasonDetails.remainingAcres - acresNum;
        
        return {
          ...c,
          seasonDetails: {
            ...c.seasonDetails,
            registeredAcres: newRegisteredAcres,
            remainingAcres: newRemainingAcres,
            progress: (newRegisteredAcres / c.seasonDetails.totalAcresNeeded) * 100,
            registeredFarmers: [
              ...c.seasonDetails.registeredFarmers,
              {
                id: Date.now(),
                name: farmer.name,
                nic: farmer.nic,
                phone: farmer.phone,
                acres: acresNum,
                date: new Date().toISOString().split('T')[0]
              }
            ]
          }
        };
      }
      return c;
    });
    
    localStorage.setItem("crops", JSON.stringify(updatedCrops));
    
    // Save to farmerSeasons
    const farmerSeasons = JSON.parse(localStorage.getItem("farmerSeasons") || "[]");
    
    const newSeason = {
      id: Date.now(),
      cropId: selectedCrop,
      cropName: crop.name,
      cropImage: getCropImage(crop.name),
      seasonName: crop.seasonName,
      acres: acresNum,
      yieldPerAcre: crop.yieldPerAcre,
      price: crop.price,
      startDate: crop.startDate,
      endDate: crop.endDate,
      registeredDate: new Date().toISOString().split('T')[0],
      expectedYield: acresNum * crop.yieldPerAcre,
      expectedIncome: acresNum * crop.yieldPerAcre * crop.price,
      status: "active",
      progress: 0
    };
    
    farmerSeasons.push(newSeason);
    localStorage.setItem("farmerSeasons", JSON.stringify(farmerSeasons));
    
    setMessage({ 
      type: "success", 
      text: `Successfully registered for ${crop.name}! ${acresNum} acres approved.` 
    });
    setShowSuccess(true);
    
    // Reset form
    setSelectedCrop(null);
    setAcresToRegister("");
    
    // Refresh available crops
    setTimeout(() => {
      const updatedCropsList = JSON.parse(localStorage.getItem("crops") || "[]");
      const stillAvailable = updatedCropsList.filter(c => 
        c.hasActiveSeason && c.seasonDetails?.remainingAcres > 0
      );
      setAvailableCrops(stillAvailable);
      setMessage({ type: "", text: "" });
      setShowSuccess(false);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/farmer");
      }, 1500);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-up">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading available crops...</p>
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
              <Image 
                src="/images/logo2.jpg" 
                alt="AgriSmart Logo" 
                width={40} 
                height={40}
                className="rounded-lg group-hover:scale-105 transition-transform"
              />
              <span className="font-bold text-xl text-gray-900 hidden sm:block">AgriSmart</span>
            </Link>
            <button onClick={() => router.back()} className="px-4 py-2 text-gray-600 hover:text-gray-800">
              Cancel
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-secondary">Register for a Crop Season</h1>
            <p className="text-gray-500">Select a crop and enter the acres you want to cultivate</p>
          </div>

          {availableCrops.length === 0 ? (
            <div className="card-modern text-center py-12">
              <div className="text-6xl mb-4">🌾</div>
              <p className="text-gray-500 mb-2">No active crop seasons available</p>
              <p className="text-sm text-gray-400">Please check back later when admin starts new seasons</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Available Crops */}
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-secondary">Available Crops</h2>
                {availableCrops.map((crop) => (
                  <div 
                    key={crop.id}
                    onClick={() => setSelectedCrop(crop.id)}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${
                      selectedCrop === crop.id
                        ? "border-primary bg-primary/5 shadow-modern"
                        : "border-gray-200 hover:border-primary"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{crop.image}</span>
                        <div>
                          <h3 className="font-semibold text-secondary">{crop.name}</h3>
                          <p className="text-sm text-gray-500">{crop.seasonName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-primary">LKR {crop.price}/kg</p>
                        <p className="text-xs text-gray-500">{crop.yieldPerAcre} kg/acre</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Registration Progress</span>
                        <span className="text-secondary font-medium">
                          {((crop.registeredAcres / crop.totalAcresNeeded) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="progress-modern">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${(crop.registeredAcres / crop.totalAcresNeeded) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {crop.remainingAcres} acres remaining out of {crop.totalAcresNeeded}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Registration Form */}
              {selectedCrop && (
                <div className="card-modern">
                  <h3 className="text-lg font-semibold text-secondary mb-4">
                    Register for {availableCrops.find(c => c.id === selectedCrop)?.name}
                  </h3>
                  
                  <div className="mb-4">
                    <label className="block text-secondary font-medium mb-2">
                      Acres to Cultivate <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={acresToRegister}
                      onChange={(e) => setAcresToRegister(e.target.value)}
                      placeholder={`Max: ${availableCrops.find(c => c.id === selectedCrop)?.remainingAcres} acres`}
                      className="input-modern"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Max available: {availableCrops.find(c => c.id === selectedCrop)?.remainingAcres} acres
                    </p>
                  </div>

                  {/* Summary */}
                  {acresToRegister && parseFloat(acresToRegister) > 0 && (
                    <div className="bg-primary/5 p-4 rounded-xl mb-4">
                      <h4 className="font-medium text-secondary mb-2">Registration Summary</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Crop:</span>
                          <span className="text-secondary">{availableCrops.find(c => c.id === selectedCrop)?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Acres:</span>
                          <span className="text-secondary">{acresToRegister} acres</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Expected Yield:</span>
                          <span className="text-secondary">
                            {(parseFloat(acresToRegister) * availableCrops.find(c => c.id === selectedCrop)?.yieldPerAcre).toFixed(0)} kg
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-primary/20">
                          <span className="text-gray-500">Expected Income:</span>
                          <span className="font-bold text-primary">
                            LKR {(parseFloat(acresToRegister) * availableCrops.find(c => c.id === selectedCrop)?.yieldPerAcre * availableCrops.find(c => c.id === selectedCrop)?.price).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {message.text && (
                    <div className={`p-3 rounded-lg mb-4 ${
                      message.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    }`}>
                      {message.text}
                    </div>
                  )}

                  {showSuccess && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <p className="text-green-600 text-center">
                        ✓ Registration successful! Redirecting to dashboard...
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleRegister}
                    disabled={showSuccess}
                    className="btn-primary-modern w-full disabled:opacity-50"
                  >
                    Confirm Registration
                  </button>
                </div>
              )}

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-blue-800 mb-1">ℹ️ How it works</h4>
                <p className="text-xs text-blue-600">
                  • Crops are available only when admin starts a new season<br />
                  • You can register only for available remaining acres<br />
                  • Registration is auto-approved if acres are available<br />
                  • Once total required acres are filled, registration closes<br />
                  • This ensures fair prices and prevents overproduction
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}