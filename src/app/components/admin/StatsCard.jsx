"use client";
export default function StatsCard({ title, value, icon, trend, color = "primary" }) {
  const colors = {
    primary: {
      bg: "bg-[#00A86B]/10",
      text: "text-[#00A86B]",
      border: "border-[#00A86B]/20"
    },
    warning: {
      bg: "bg-[#F59E0B]/10",
      text: "text-[#F59E0B]",
      border: "border-[#F59E0B]/20"
    },
    info: {
      bg: "bg-[#3B82F6]/10",
      text: "text-[#3B82F6]",
      border: "border-[#3B82F6]/20"
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-modern p-6 border ${colors[color].border} hover:shadow-modern-lg transition-all duration-300`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#64748B] mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-[#1E293B]">{value}</h3>
          
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-xs ${trend.isPositive ? 'text-[#00A86B]' : 'text-[#EF4444]'}`}>
                {trend.isPositive ? '↑' : '↓'} {trend.percentage}%
              </span>
              <span className="text-xs text-[#64748B]">vs last month</span>
            </div>
          )}
        </div>
        
        <div className={`w-12 h-12 ${colors[color].bg} rounded-lg flex items-center justify-center`}>
          <span className={`text-2xl ${colors[color].text}`}>{icon}</span>
        </div>
      </div>

      {/* Mini Progress Bar (optional) */}
      {trend?.progress && (
        <div className="mt-4">
          <div className="w-full bg-[#F1F5F9] rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full ${colors[color].bg.replace('/10', '')}`}
              style={{ width: `${trend.progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}