"use client";
import { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";

export default function CropTable({ crops = [], onEdit, onAddNew, onViewRegistrations }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Filter and sort crops
  const filteredCrops = crops
    .filter(crop => 
      crop.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "progress") return (b.registered/b.total) - (a.registered/a.total);
      return 0;
    });

  return (
    <div className="bg-white rounded-xl shadow-modern p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-[#1E293B]">Crop Management</h3>
        
        <Button
          variant="primary"
          onClick={onAddNew}
        >
          + Add New Crop
        </Button>
      </div>

      {/* Search and Sort */}
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
            className="px-4 py-2 border border-[#F1F5F9] rounded-lg bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#00A86B]/20 focus:border-[#00A86B]"
          >
            <option value="name">Sort by Name</option>
            <option value="progress">Sort by Progress</option>
          </select>
        </div>
      </div>

      {/* Crops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCrops.length > 0 ? (
          filteredCrops.map((crop, index) => {
            const progress = (crop.registered / crop.total) * 100;
            
            return (
              <div key={index} className="border border-[#F1F5F9] rounded-lg p-4 hover:border-[#00A86B] transition-all">
                {/* Crop Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-[#1E293B]">{crop.name}</h4>
                    <p className="text-xs text-[#64748B]">{crop.season} Season</p>
                  </div>
                  <span className="text-xs bg-[#E8F5E9] text-[#00A86B] px-2 py-1 rounded-full">
                    {crop.status}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <p className="text-xs text-[#64748B]">Required</p>
                    <p className="text-sm font-semibold text-[#1E293B]">{crop.total} acres</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B]">Registered</p>
                    <p className="text-sm font-semibold text-[#1E293B]">{crop.registered} acres</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#64748B]">Progress</span>
                    <span className="text-[#1E293B] font-medium">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-[#F1F5F9] rounded-full h-2">
                    <div 
                      className="bg-[#00A86B] h-2 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Yield Info */}
                <div className="flex justify-between text-xs text-[#64748B] mb-3">
                  <span>Yield/Acre: {crop.yieldPerAcre} kg</span>
                  <span>Price: Rs.{crop.price}/kg</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onViewRegistrations(crop)}
                    className="flex-1 text-sm bg-[#F1F5F9] text-[#1E293B] py-2 rounded-lg hover:bg-[#E2E8F0] transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onEdit(crop)}
                    className="flex-1 text-sm bg-[#00A86B] text-white py-2 rounded-lg hover:bg-[#00875A] transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-3 p-8 text-center text-[#64748B]">
            No crops found
          </div>
        )}
      </div>
    </div>
  );
}