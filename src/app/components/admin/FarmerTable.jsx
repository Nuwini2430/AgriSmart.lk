"use client";
import { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";

export default function FarmerTable({ farmers = [], onViewDetails, onExport }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredFarmers = farmers.filter(farmer => {
    const matchesSearch = 
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.nic.includes(searchTerm) ||
      farmer.phone.includes(searchTerm);
    
    const matchesStatus = filterStatus === "all" || farmer.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-2xl shadow-modern p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-secondary">Farmers Management</h3>
        <Button variant="secondary" onClick={onExport}>
          Export List
        </Button>
      </div>

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
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-sm font-medium text-gray-500">Farmer</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">NIC</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">Phone</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">District</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">Crops</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">Acres</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="p-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFarmers.length > 0 ? (
              filteredFarmers.map((farmer, index) => (
                <tr key={index} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary text-sm font-bold">{farmer.name.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-secondary">{farmer.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-gray-600">{farmer.nic}</td>
                  <td className="p-3 text-gray-600">{farmer.phone}</td>
                  <td className="p-3 text-gray-600">{farmer.district}</td>
                  <td className="p-3 text-gray-600">{farmer.crops}</td>
                  <td className="p-3 text-gray-600">{farmer.totalAcres}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      farmer.status === "active" ? "bg-green-100 text-green-600" : 
                      farmer.status === "pending" ? "bg-yellow-100 text-yellow-600" : 
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {farmer.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => onViewDetails(farmer)}
                      className="text-primary hover:text-primary-dark text-sm font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-8 text-center text-gray-500">
                  No farmers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-500">
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