"use client";
import { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";

export default function CropTable({ crops = [], onEdit, onAddNew, onViewRegistrations }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const filteredCrops = crops
    .filter(crop => 
      crop.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "progress") return (b.registeredAcres/b.totalAcresNeeded) - (a.registeredAcres/a.totalAcresNeeded);
      return 0;
    });

  return (
    <div className="bg-white rounded-2xl shadow-modern p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-secondary">Crop Management</h3>
        <Button variant="primary" onClick={onAddNew}>
          + Add New Crop
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search crops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="name">Sort by Name</option>
            <option value="progress">Sort by Progress</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCrops.length > 0 ? (
          filteredCrops.map((crop, index) => {
            const progress = (crop.registeredAcres / crop.totalAcresNeeded) * 100;
            
            return (
              <div key={index} className="border border-gray-200 rounded-xl p-4 hover:border-primary transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-secondary">{crop.name}</h4>
                    <p className="text-xs text-gray-500">{crop.season} Season</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    crop.status === "active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
                  }`}>
                    {crop.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Required</p>
                    <p className="text-sm font-semibold text-secondary">{crop.totalAcresNeeded} acres</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Registered</p>
                    <p className="text-sm font-semibold text-secondary">{crop.registeredAcres} acres</p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Progress</span>
                    <span className="text-secondary font-medium">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="progress-modern">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-gray-500 mb-3">
                  <span>Yield/Acre: {crop.yieldPerAcre} kg</span>
                  <span>Price: LKR {crop.price}/kg</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onViewRegistrations(crop)}
                    className="flex-1 text-sm bg-gray-100 text-secondary py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onEdit(crop)}
                    className="flex-1 text-sm bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-3 p-8 text-center text-gray-500">
            No crops found
          </div>
        )}
      </div>
    </div>
  );
}