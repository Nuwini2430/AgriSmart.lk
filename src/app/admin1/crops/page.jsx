"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminCrops() {
  const router = useRouter();
  const [crops, setCrops] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    season: "Maha",
    requiredHarvest: "",
    yieldPerAcre: "",
    price: "",
    deadline: ""
  });

  // Mock data
  useEffect(() => {
    setCrops([
      {
        id: 1,
        name: "Rice",
        season: "Maha",
        requiredHarvest: 500000,
        yieldPerAcre: 1000,
        totalAcres: 500,
        registeredAcres: 325,
        price: 150,
        deadline: "2024-04-30",
        status: "active"
      },
      {
        id: 2,
        name: "Chili",
        season: "Yala",
        requiredHarvest: 100000,
        yieldPerAcre: 800,
        totalAcres: 125,
        registeredAcres: 85,
        price: 300,
        deadline: "2024-05-15",
        status: "active"
      },
      {
        id: 3,
        name: "Brinjal",
        season: "Maha",
        requiredHarvest: 75000,
        yieldPerAcre: 1200,
        totalAcres: 62.5,
        registeredAcres: 45,
        price: 120,
        deadline: "2024-04-20",
        status: "active"
      }
    ]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Calculate total acres based on required harvest and yield per acre
  const calculateTotalAcres = () => {
    const required = parseFloat(formData.requiredHarvest) || 0;
    const yieldPerAcre = parseFloat(formData.yieldPerAcre) || 1;
    return (required / yieldPerAcre).toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredHarvest = parseFloat(formData.requiredHarvest);
    const yieldPerAcre = parseFloat(formData.yieldPerAcre);
    const totalAcres = requiredHarvest / yieldPerAcre;

    const newCrop = {
      id: editingCrop ? editingCrop.id : Date.now(),
      name: formData.name,
      season: formData.season,
      requiredHarvest: requiredHarvest,
      yieldPerAcre: yieldPerAcre,
      totalAcres: totalAcres,
      registeredAcres: editingCrop ? editingCrop.registeredAcres : 0,
      price: parseFloat(formData.price),
      deadline: formData.deadline,
      status: "active"
    };

    if (editingCrop) {
      // Update existing crop
      setCrops(crops.map(c => c.id === editingCrop.id ? newCrop : c));
    } else {
      // Add new crop
      setCrops([...crops, newCrop]);
    }

    // Reset form and close modal
    setFormData({
      name: "",
      season: "Maha",
      requiredHarvest: "",
      yieldPerAcre: "",
      price: "",
      deadline: ""
    });
    setEditingCrop(null);
    setShowAddModal(false);
  };

  const handleEdit = (crop) => {
    setEditingCrop(crop);
    setFormData({
      name: crop.name,
      season: crop.season,
      requiredHarvest: crop.requiredHarvest,
      yieldPerAcre: crop.yieldPerAcre,
      price: crop.price,
      deadline: crop.deadline
    });
    setShowAddModal(true);
  };

  const handleDelete = (cropId) => {
    if (confirm("Are you sure you want to delete this crop?")) {
      setCrops(crops.filter(c => c.id !== cropId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-modern sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin1" className="text-2xl">←</Link>
              <h1 className="text-xl font-bold text-secondary">Crop Management</h1>
            </div>
            <button
              onClick={() => {
                setEditingCrop(null);
                setFormData({
                  name: "",
                  season: "Maha",
                  requiredHarvest: "",
                  yieldPerAcre: "",
                  price: "",
                  deadline: ""
                });
                setShowAddModal(true);
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-modern"
            >
              + Add New Crop
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Crops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {crops.map((crop) => (
            <div key={crop.id} className="bg-white rounded-xl shadow-modern p-6">
              {/* Crop Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-secondary">{crop.name}</h3>
                  <p className="text-sm text-gray-500">{crop.season} Season</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                  {crop.status}
                </span>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Required Harvest</p>
                    <p className="font-medium text-secondary">{crop.requiredHarvest.toLocaleString()} kg</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Yield/Acre</p>
                    <p className="font-medium text-secondary">{crop.yieldPerAcre} kg</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Total Acres</p>
                    <p className="font-medium text-secondary">{crop.totalAcres.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Registered</p>
                    <p className="font-medium text-secondary">{crop.registeredAcres}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Registration Progress</span>
                    <span className="text-secondary font-medium">
                      {((crop.registeredAcres / crop.totalAcres) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(crop.registeredAcres / crop.totalAcres) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Price and Deadline */}
                <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t border-gray-100">
                  <div>
                    <p className="text-gray-500">Price/kg</p>
                    <p className="font-medium text-primary">LKR {crop.price}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Deadline</p>
                    <p className="font-medium text-secondary">{crop.deadline}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleEdit(crop)}
                    className="flex-1 px-3 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(crop.id)}
                    className="flex-1 px-3 py-2 border border-red-300 text-red-600 text-sm rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Crop Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-modern-lg max-w-md w-full">
              <div className="p-6">
                <h2 className="text-xl font-bold text-secondary mb-4">
                  {editingCrop ? "Edit Crop" : "Add New Crop"}
                </h2>

                <form onSubmit={handleSubmit}>
                  {/* Crop Name */}
                  <div className="mb-4">
                    <label className="block text-secondary font-medium mb-2">
                      Crop Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Rice, Chili, Brinjal"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                  </div>

                  {/* Season */}
                  <div className="mb-4">
                    <label className="block text-secondary font-medium mb-2">
                      Season <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="season"
                      value={formData.season}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    >
                      <option value="Maha">Maha</option>
                      <option value="Yala">Yala</option>
                    </select>
                  </div>

                  {/* Required Harvest */}
                  <div className="mb-4">
                    <label className="block text-secondary font-medium mb-2">
                      Required Harvest (kg) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="requiredHarvest"
                      value={formData.requiredHarvest}
                      onChange={handleInputChange}
                      placeholder="e.g., 500000"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Total kilograms needed for the season
                    </p>
                  </div>

                  {/* Yield Per Acre */}
                  <div className="mb-4">
                    <label className="block text-secondary font-medium mb-2">
                      Yield Per Acre (kg) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="yieldPerAcre"
                      value={formData.yieldPerAcre}
                      onChange={handleInputChange}
                      placeholder="e.g., 1000"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Average yield per acre
                    </p>
                  </div>

                  {/* Auto-calculated Total Acres */}
                  {formData.requiredHarvest && formData.yieldPerAcre && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Total Acres Required:</span>{' '}
                        {calculateTotalAcres()} acres
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        (Based on {formData.requiredHarvest}kg required and {formData.yieldPerAcre}kg per acre)
                      </p>
                    </div>
                  )}

                  {/* Price per kg */}
                  <div className="mb-4">
                    <label className="block text-secondary font-medium mb-2">
                      Price per kg (LKR) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="e.g., 150"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                  </div>

                  {/* Deadline */}
                  <div className="mb-6">
                    <label className="block text-secondary font-medium mb-2">
                      Registration Deadline <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                  </div>

                  {/* Form Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      {editingCrop ? "Update Crop" : "Add Crop"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}