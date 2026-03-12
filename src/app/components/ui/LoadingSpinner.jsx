"use client";
export default function LoadingSpinner({ size = "md", color = "primary", fullPage = false }) {
  const sizes = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-4"
  };

  const colors = {
    primary: "border-[#00A86B] border-t-transparent",
    white: "border-white border-t-transparent",
    gray: "border-[#64748B] border-t-transparent"
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`
          ${sizes[size]} 
          ${colors[color]}
          rounded-full
          animate-spin
        `}
      />
      <p className="mt-2 text-sm text-[#64748B]">Loading...</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}

// Small inline spinner for buttons
export function ButtonSpinner() {
  return (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
  );
}

// Skeleton loading for cards
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-modern p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-[#F1F5F9] rounded"></div>
          <div className="h-3 w-16 bg-[#F1F5F9] rounded"></div>
        </div>
        <div className="w-8 h-8 bg-[#F1F5F9] rounded-full"></div>
      </div>
      
      <div className="space-y-3">
        <div className="h-2 w-full bg-[#F1F5F9] rounded"></div>
        <div className="h-2 w-3/4 bg-[#F1F5F9] rounded"></div>
        <div className="h-2 w-1/2 bg-[#F1F5F9] rounded"></div>
      </div>
      
      <div className="mt-4 h-8 w-full bg-[#F1F5F9] rounded"></div>
    </div>
  );
}

// Table row skeleton
export function TableRowSkeleton() {
  return (
    <div className="border-t border-[#F1F5F9] p-3 animate-pulse">
      <div className="flex gap-3">
        <div className="w-8 h-8 bg-[#F1F5F9] rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 w-32 bg-[#F1F5F9] rounded"></div>
          <div className="h-3 w-24 bg-[#F1F5F9] rounded"></div>
        </div>
      </div>
    </div>
  );
}