"use client";
export default function StatsCard({ title, value, icon, trend, color = "primary" }) {
  const colors = {
    primary: {
      bg: "bg-primary/10",
      text: "text-primary",
      border: "border-primary/20"
    },
    warning: {
      bg: "bg-yellow-500/10",
      text: "text-yellow-600",
      border: "border-yellow-500/20"
    },
    info: {
      bg: "bg-blue-500/10",
      text: "text-blue-600",
      border: "border-blue-500/20"
    },
    success: {
      bg: "bg-green-500/10",
      text: "text-green-600",
      border: "border-green-500/20"
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-modern p-6 border ${colors[color].border} hover:shadow-modern-lg transition-all duration-300`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-secondary">{value}</h3>
          
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '↑' : '↓'} {trend.percentage}%
              </span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        
        <div className={`w-12 h-12 ${colors[color].bg} rounded-xl flex items-center justify-center`}>
          <span className={`text-2xl ${colors[color].text}`}>{icon}</span>
        </div>
      </div>

      {trend?.progress && (
        <div className="mt-4">
          <div className="w-full bg-gray-100 rounded-full h-1.5">
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