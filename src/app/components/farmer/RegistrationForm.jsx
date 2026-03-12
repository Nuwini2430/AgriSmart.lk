"use client";
import { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";

export default function RegistrationForm({ crop, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    acres: "",
    landLocation: "",
    expectedHarvest: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Calculate expected harvest when acres change
  const handleAcresChange = (e) => {
    const acres = parseFloat(e.target.value) || 0;
    const expectedHarvest = acres * crop.yieldPerAcre;
    
    setFormData({
      ...formData,
      acres: e.target.value,
      expectedHarvest: expectedHarvest.toFixed(2)
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.acres || parseFloat(formData.acres) <= 0) {
      newErrors.acres = "Please enter valid acres";
    } else if (parseFloat(formData.acres) > crop.remaining) {
      newErrors.acres = `Only ${crop.remaining} acres available`;
    }
    
    if (!formData.landLocation.trim()) {
      newErrors.landLocation = "Land location is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onSubmit({
        ...formData,
        cropId: crop.id,
        cropName: crop.name
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-xl shadow-modern-lg p-6">
      <h3 className="text-xl font-semibold text-[#1E293B] mb-4">
        Register for {crop.name}
      </h3>
      
      <form onSubmit={handleSubmit}>
        {/* Acres Input */}
        <Input
          label="Number of Acres"
          type="number"
          placeholder="e.g., 2.5"
          value={formData.acres}
          onChange={handleAcresChange}
          error={errors.acres}
          required
        />

        {/* Land Location */}
        <Input
          label="Land Location"
          type="text"
          placeholder="e.g., Kurunegala"
          value={formData.landLocation}
          onChange={(e) => setFormData({...formData, landLocation: e.target.value})}
          error={errors.landLocation}
          required
        />

        {/* Expected Harvest (Auto-calculated) */}
        <div className="mb-4">
          <label className="block text-[#1E293B] mb-2 font-medium">
            Expected Harvest (kg)
          </label>
          <input
            type="text"
            value={formData.expectedHarvest}
            readOnly
            className="w-full px-4 py-2 bg-[#F1F5F9] border border-[#F1F5F9] rounded-lg text-[#64748B]"
          />
          <p className="text-xs text-[#64748B] mt-1">
            Based on {crop.yieldPerAcre} kg per acre
          </p>
        </div>

        {/* Additional Notes */}
        <Input
          label="Additional Notes (Optional)"
          type="text"
          placeholder="Any special requirements?"
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
        />

        {/* Summary */}
        <div className="bg-[#F8FAFC] p-4 rounded-lg mb-6">
          <h4 className="font-medium text-[#1E293B] mb-2">Registration Summary</h4>
          <div className="space-y-1 text-sm">
            <p className="flex justify-between">
              <span className="text-[#64748B]">Crop:</span>
              <span className="text-[#1E293B] font-medium">{crop.name}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-[#64748B]">Acres:</span>
              <span className="text-[#1E293B] font-medium">{formData.acres || 0}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-[#64748B]">Expected Harvest:</span>
              <span className="text-[#00A86B] font-medium">{formData.expectedHarvest || 0} kg</span>
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="flex-1"
          >
            {loading ? "Submitting..." : "Confirm Registration"}
          </Button>
          
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}