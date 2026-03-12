"use client";
export default function CropCard({ crop, onRegister }) {
  // Calculate progress percentage
  const progress = (crop.registered / crop.total) * 100;
  const remaining = crop.total - crop.registered;

  return (
    <div className="bg-white rounded-xl shadow-modern p-6 hover:shadow-modern-lg transition-all duration-300 border border-[#F1F5F9] hover:border-[#00A86B]">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-[#1E293B]">{crop.name}</h3>
          <p className="text-sm text-[#64748B]">{crop.season} Season</p>
        </div>
        <span className="px-3 py-1 bg-[#E8F5E9] text-[#00A86B] rounded-full text-sm font-medium">
          {crop.status}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-[#64748B]">Yield per Acre</p>
          <p className="text-lg font-semibold text-[#1E293B]">{crop.yieldPerAcre} kg</p>
        </div>
        <div>
          <p className="text-xs text-[#64748B]">Expected Price</p>
          <p className="text-lg font-semibold text-[#00A86B]">Rs. {crop.price}/kg</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-[#64748B]">Registration Progress</span>
          <span className="text-[#1E293B] font-medium">{crop.registered}/{crop.total} acres</span>
        </div>
        <div className="w-full bg-[#F1F5F9] rounded-full h-2.5">
          <div 
            className="bg-[#00A86B] h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Remaining and Register Button */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-[#64748B]">Remaining</p>
          <p className="text-lg font-bold text-[#1E293B]">{remaining} acres</p>
        </div>
        
        <button
          onClick={() => onRegister(crop)}
          disabled={remaining === 0}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            remaining > 0
              ? "bg-[#00A86B] text-white hover:bg-[#00875A] shadow-modern"
              : "bg-[#F1F5F9] text-[#64748B] cursor-not-allowed"
          }`}
        >
          {remaining > 0 ? "Register Now" : "Full"}
        </button>
      </div>

      {/* Additional Info if Available */}
      {crop.description && (
        <p className="text-sm text-[#64748B] mt-4 pt-4 border-t border-[#F1F5F9]">
          {crop.description}
        </p>
      )}
    </div>
  );
}