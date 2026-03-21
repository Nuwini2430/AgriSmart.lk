"use client";
export default function Button({ 
  children, 
  onClick, 
  variant = "primary", 
  type = "button",
  disabled = false,
  className = ""
}) {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200";
  
  const variants = {
    primary: "bg-[#00A86B] text-white hover:bg-[#00875A] shadow-modern",
    secondary: "bg-[#F1F5F9] text-[#1E293B] hover:bg-[#E2E8F0]",
    outline: "border-2 border-[#00A86B] text-[#00A86B] hover:bg-[#E8F5E9]"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
}