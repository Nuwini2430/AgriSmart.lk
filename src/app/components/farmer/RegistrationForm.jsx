"use client";
import { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";

export default function RegistrationForm({ crop, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    acres: "",
    landLocation: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleAcresChange = (e) => {
    const acres = parseFloat(e.target.value) || 0;
    setFormData({
      ...formData,
      acres: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.acres || parseFloat(formData.acres) <= 0) {
      newErrors.acres = "Please enter valid acres";
    } else if (parseFloat(formData.acres) > crop.remainingAcres) {
      newErrors.acres = `Only ${crop.remainingAcres} acres available`;
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
    
    setTimeout(() => {
      onSubmit({
        ...formData,
        cropId: crop.id,
        cropName: crop.name,
        expectedYield: parseFloat(formData.acres) * crop.yieldPerAcre,
        expectedIncome: parseFloat(formData.acres) * crop.yieldPerAcre * crop.price
      });
      setLoading(false);
    }, 1000);
  };

  const expectedYield = formData.acres ? parseFloat(formData.acres) * crop.yieldPerAcre : 0;
  const expectedIncome = formData.acres ? parseFloat(formData.acres) * crop.yieldPerAcre * crop.price : 0;

  return (
    <div className="bg-white rounded-2xl shadow-modern-lg p-6">
      <h3 className="text-xl font-semibold text-secondary mb-4">
        Register for {crop.name}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <Input
          label="Number of Acres"
          type="number"
          step="0.1"
          placeholder={`Max: ${crop.remainingAcres} acres`}
          value={formData.acres}
          onChange={handleAcresChange}
          error={errors.acres}
          required
        />

        <Input
          label="Land Location"
          type="text"
          placeholder="e.g., Kurunegala"
          value={formData.landLocation}
          onChange={(e) => setFormData({...formData, landLocation: e.target.value})}
          error={errors.landLocation}
          required
        />

        <Input
          label="Additional Notes (Optional)"
          type="text"
          placeholder="Any special requirements?"
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
        />

        {formData.acres && parseFloat(formData.acres) > 0 && (
          <div className="bg-primary/5 p-4 rounded-lg mb-6">
            <h4 className="font-medium text-secondary mb-2">Registration Summary</h4>
            <div className="space-y-1 text-sm">
              <p className="flex justify-between">
                <span className="text-gray-500">Crop:</span>
                <span className="text-secondary font-medium">{crop.name}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Acres:</span>
                <span className="text-secondary font-medium">{formData.acres}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Expected Yield:</span>
                <span className="text-primary font-medium">{expectedYield.toFixed(0)} kg</span>
              </p>
              <p className="flex justify-between pt-2 border-t border-primary/20">
                <span className="text-gray-500">Expected Income:</span>
                <span className="font-bold text-primary">LKR {expectedIncome.toLocaleString()}</span>
              </p>
            </div>
          </div>
        )}

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