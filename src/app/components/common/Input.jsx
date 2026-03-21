"use client";
export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = ""
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-[#1E293B] mb-2 font-medium">
          {label} {required && <span className="text-[#EF4444]">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-2 border ${
          error ? "border-[#EF4444]" : "border-[#F1F5F9]"
        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A86B]/20 focus:border-[#00A86B] transition-all ${className}`}
      />
      {error && <p className="text-[#EF4444] text-sm mt-1">{error}</p>}
    </div>
  );
}