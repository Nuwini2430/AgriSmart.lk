"use client";
import { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";

export default function FarmerTable({ farmers = [], onViewDetails, onExport }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Filter farmers based on search and status
  const filteredFarmers = farmers.filter(farmer => {
    const matchesSearch = 
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.nic.includes(searchTerm) ||
      farmer.phone.includes(searchTerm);
    
    const matchesStatus = filterStatus === "all" || farmer.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-xl shadow-modern p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-[#1E293B]">Farmers Management</h3>
        
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={onExport}
          >
            Export List
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search by name, NIC, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          {["all", "active", "pending", "completed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === status
                  ? "bg-[#00A86B] text-white"
                  : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F8FAFC]">
            <tr>
              <th className="p-3 text-left text-sm font-medium text-[#64748B]">Farmer</th>
              <th className="p-3 text-left text-sm font-medium text-[#64748B]">NIC</th>
              <th className="p-3 text-left text-sm font-medium text-[#64748B]">Phone</th>
              <th className="p-3 text-left text-sm font-medium text-[#64748B]">Registered Crops</th>
              <th className="p-3 text-left text-sm font-medium text-[#64748B]">Total Acres</th>
              <th className="p-3 text-left text-sm font-medium text-[#64748B]">Status</th>
              <th className="p-3 text-left text-sm font-medium text-[#64748B]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFarmers.length > 0 ? (
              filteredFarmers.map((farmer, index) => (
                <tr key={index} className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#00A86B]/10 rounded-full flex items-center justify-center">
                        <span className="text-[#00A86B] text-sm">🌾</span>
                      </div>
                      <span className="text-[#1E293B] font-medium">{farmer.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-[#64748B]">{farmer.nic}</td>
                  <td className="p-3 text-[#64748B]">{farmer.phone}</td>
                  <td className="p-3 text-[#1E293B]">{farmer.cropCount}</td>
                  <td className="p-3 text-[#1E293B]">{farmer.totalAcres}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${farmer.status === 'active' ? 'bg-[#E8F5E9] text-[#00A86B]' : 
                        farmer.status === 'pending' ? 'bg-[#FEF3C7] text-[#F59E0B]' : 
                        'bg-[#F1F5F9] text-[#64748B]'}`}>
                      {farmer.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => onViewDetails(farmer)}
                      className="text-[#00A86B] hover:text-[#00875A] font-medium text-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-8 text-center text-[#64748B]">
                  No farmers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#F1F5F9]">
        <p className="text-sm text-[#64748B]">
          Showing {filteredFarmers.length} of {farmers.length} farmers
        </p>
        
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">Previous</Button>
          <Button variant="secondary" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
}