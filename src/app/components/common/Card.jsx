"use client";
export default function Card({ children, className = "", hover = true }) {
  return (
    <div className={`bg-white rounded-xl shadow-modern p-6 ${
      hover ? "hover:shadow-modern-lg transition-all duration-300" : ""
    } ${className}`}>
      {children}
    </div>
  );
}