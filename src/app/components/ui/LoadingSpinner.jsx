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