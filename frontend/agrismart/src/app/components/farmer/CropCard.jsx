"use client";
export default function CropCard({ crop, onRegister }) {
  const progress = (crop.registeredAcres / crop.totalAcresNeeded) * 100;
  const remaining = crop.remainingAcres;

  return (
    <div className="bg-white rounded-2xl shadow-modern p-6 hover:shadow-modern-lg transition-all duration-300 border border-gray-100 hover:border-primary">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">{crop.image}</span>
            <h3 className="text-xl font-semibold text-secondary">{crop.name}</h3>
          </div>
          <p className="text-sm text-gray-500 mt-1">{crop.season} Season</p>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
          {crop.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">Yield per Acre</p>
          <p className="text-lg font-semibold text-secondary">{crop.yieldPerAcre} kg</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Price</p>
          <p className="text-lg font-semibold text-primary">LKR {crop.price}/kg</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-500">Registration Progress</span>
          <span className="text-secondary font-medium">{crop.registeredAcres}/{crop.totalAcresNeeded} acres</span>
        </div>
        <div className="progress-modern">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Remaining</p>
          <p className="text-lg font-bold text-secondary">{remaining} acres</p>
        </div>
        
        <button
          onClick={() => onRegister(crop)}
          disabled={remaining === 0}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            remaining > 0
              ? "bg-primary text-white hover:bg-primary-dark shadow-modern"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {remaining > 0 ? "Register Now" : "Full"}
        </button>
      </div>

      {crop.description && (
        <p className="text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
          {crop.description}
        </p>
      )}
    </div>
  );
}