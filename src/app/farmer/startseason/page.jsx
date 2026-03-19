"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function StartSeason() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [landAcres, setLandAcres] = useState("");
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [seasonName, setSeasonName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [availableCrops, setAvailableCrops] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/signin");
      return;
    }

    // Mock available crops data (from admin)
    setAvailableCrops([
      { id: 1, name: "Rice", totalRequired: 500000, yieldPerAcre: 1000, price: 150, remainingAcres: 175, season: "Maha", image: "🌾" },
      { id: 2, name: "Chili", totalRequired: 100000, yieldPerAcre: 800, price: 300, remainingAcres: 40, season: "Yala", image: "🌶️" },
      { id: 3, name: "Brinjal", totalRequired: 75000, yieldPerAcre: 1200, price: 120, remainingAcres: 17.5, season: "Maha", image: "🍆" },
      { id: 4, name: "Maize", totalRequired: 200000, yieldPerAcre: 1500, price: 90, remainingAcres: 0, season: "Yala", image: "🌽" },
      { id: 5, name: "Potato", totalRequired: 150000, yieldPerAcre: 2000, price: 180, remainingAcres: 25, season: "Maha", image: "🥔" }
    ]);

    // Set default start date to today
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
  }, [router]);

  // Update filtered crops when land acres changes
  useEffect(() => {
    if (landAcres && parseFloat(landAcres) > 0) {
      const acres = parseFloat(landAcres);
      const filtered = availableCrops.filter(crop => 
        crop.remainingAcres >= acres && crop.remainingAcres > 0
      );
      setFilteredCrops(filtered);
    } else {
      setFilteredCrops([]);
    }
    setSelectedCrops([]); // Reset selections when land changes
  }, [landAcres, availableCrops]);

  const handleCropSelection = (cropId) => {
    setSelectedCrops(prev => {
      if (prev.includes(cropId)) {
        return prev.filter(id => id !== cropId);
      } else {
        return [...prev, cropId];
      }
    });
  };

  const calculateExpectedYield = () => {
    return selectedCrops.reduce((total, cropId) => {
      const crop = availableCrops.find(c => c.id === cropId);
      return total + ((parseFloat(landAcres) || 0) * crop.yieldPerAcre);
    }, 0);
  };

  const calculateTotalValue = () => {
    return selectedCrops.reduce((total, cropId) => {
      const crop = availableCrops.find(c => c.id === cropId);
      return total + ((parseFloat(landAcres) || 0) * crop.yieldPerAcre * crop.price);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!seasonName.trim()) {
      alert("Please enter a season name");
      return;
    }

    if (!landAcres || parseFloat(landAcres) <= 0) {
      alert("Please enter valid land acres");
      return;
    }

    if (selectedCrops.length === 0) {
      alert("Please select at least one crop");
      return;
    }

    setLoading(true);

    // Mock API call - Replace with actual backend
    setTimeout(() => {
      // Create new season object
      const newSeason = {
        id: Date.now(),
        name: seasonName,
        landAcres: parseFloat(landAcres),
        crops: selectedCrops.map(id => {
          const crop = availableCrops.find(c => c.id === id);
          return {
            id: crop.id,
            name: crop.name,
            image: crop.image,
            yieldPerAcre: crop.yieldPerAcre,
            price: crop.price,
            expectedYield: parseFloat(landAcres) * crop.yieldPerAcre,
            expectedIncome: parseFloat(landAcres) * crop.yieldPerAcre * crop.price
          };
        }),
        startDate: startDate,
        expectedHarvest: calculateExpectedYield(),
        expectedIncome: calculateTotalValue(),
        status: "active",
        progress: 0,
        image: selectedCrops.length > 0 ? availableCrops.find(c => c.id === selectedCrops[0]).image : "🌾"
      };

      // Save to localStorage (temporary)
      const existingSeasons = JSON.parse(localStorage.getItem("activeSeasons") || "[]");
      localStorage.setItem("activeSeasons", JSON.stringify([...existingSeasons, newSeason]));

      // Update remaining acres in available crops (mock)
      const updatedCrops = availableCrops.map(crop => {
        if (selectedCrops.includes(crop.id)) {
          return {
            ...crop,
            remainingAcres: crop.remainingAcres - parseFloat(landAcres)
          };
        }
        return crop;
      });
      localStorage.setItem("availableCrops", JSON.stringify(updatedCrops));

      // Show success message
      alert("Season started successfully!");
      
      // Redirect to farmer dashboard
      router.push("/farmer");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
                Cancel
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-secondary">Start a New Season</h1>
            <p className="text-gray-500">Enter your land details to see available crops</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-modern p-6 space-y-6">
            {/* Season Name */}
            <div>
              <label className="block text-secondary font-medium mb-2">
                Season Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={seasonName}
                onChange={(e) => setSeasonName(e.target.value)}
                placeholder="e.g., Maha 2024, Yala 2024"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-secondary font-medium mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>

            {/* Land Acres */}
            <div>
              <label className="block text-secondary font-medium mb-2">
                Your Available Land (Acres) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={landAcres}
                onChange={(e) => setLandAcres(e.target.value)}
                placeholder="e.g., 2.5"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Enter your land acres to see which crops you can cultivate
              </p>
            </div>

            {/* Available Crops - Only show if land entered */}
            {landAcres && parseFloat(landAcres) > 0 && (
              <div>
                <label className="block text-secondary font-medium mb-3">
                  Crops Available for {landAcres} Acres
                </label>
                
                {filteredCrops.length > 0 ? (
                  <div className="space-y-3">
                    {filteredCrops.map((crop) => (
                      <div 
                        key={crop.id} 
                        onClick={() => handleCropSelection(crop.id)}
                        className={`p-4 border rounded-lg transition-all cursor-pointer ${
                          selectedCrops.includes(crop.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-primary'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {/* Custom Checkbox */}
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                              selectedCrops.includes(crop.id) 
                                ? 'bg-primary border-primary' 
                                : 'border-gray-300'
                            }`}>
                              {selectedCrops.includes(crop.id) && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            
                            {/* Crop Info */}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{crop.image}</span>
                                <h4 className="font-semibold text-secondary">{crop.name}</h4>
                              </div>
                              <p className="text-xs text-gray-500">
                                Season: {crop.season} • {crop.yieldPerAcre} kg/acre • LKR {crop.price}/kg
                              </p>
                            </div>
                          </div>
                          
                          {/* Expected Output for this land */}
                          <div className="text-right">
                            <p className="text-sm font-medium text-primary">
                              LKR {(parseFloat(landAcres) * crop.yieldPerAcre * crop.price).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(parseFloat(landAcres) * crop.yieldPerAcre).toFixed(0)} kg expected
                            </p>
                          </div>
                        </div>

                        {/* Progress bar for remaining acres */}
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500">Available Acres</span>
                            <span className="text-secondary">{crop.remainingAcres} acres left</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-primary h-1.5 rounded-full"
                              style={{ width: `${(crop.remainingAcres / 200) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <p className="text-yellow-700">
                      No crops available for {landAcres} acres at the moment.
                    </p>
                    <p className="text-sm text-yellow-600 mt-1">
                      Try a smaller land area or check back later.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Summary - Show when crops selected */}
            {selectedCrops.length > 0 && (
              <div className="bg-primary/5 p-4 rounded-lg">
                <h3 className="font-medium text-secondary mb-2">Season Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Land:</span>
                    <span className="font-medium text-secondary">{landAcres} acres</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Selected Crops:</span>
                    <span className="font-medium text-secondary">{selectedCrops.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Expected Total Yield:</span>
                    <span className="font-medium text-primary">{calculateExpectedYield().toFixed(0)} kg</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-primary/20">
                    <span className="text-gray-500">Expected Income:</span>
                    <span className="font-bold text-primary">LKR {calculateTotalValue().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Form Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading || selectedCrops.length === 0}
                className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-modern disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Starting Season...
                  </span>
                ) : "Start Season"}
              </button>
              <Link
                href="/farmer"
                className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}