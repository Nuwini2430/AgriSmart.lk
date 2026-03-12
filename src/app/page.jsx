"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-white">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-modern py-2" : "bg-transparent py-4"
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Left - Home Icon */}
            <Link 
              href="https://agrismart.lk" 
              target="_blank"
              className="group flex items-center gap-2 text-[#1E293B] hover:text-[#00A86B] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                />
              </svg>
              <span className="hidden md:inline font-medium">AgriSmart.lk</span>
            </Link>

            {/* Center - Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div className="w-12 h-12 bg-[#00A86B] rounded-full flex items-center justify-center shadow-modern">
                <span className="text-white text-xl font-bold">🌾</span>
              </div>
            </div>

            {/* Right - Auth Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/signin")}
                className="px-4 py-2 text-[#1E293B] font-medium hover:text-[#00A86B] transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="px-4 py-2 bg-[#00A86B] text-white rounded-lg hover:bg-[#00875A] transition-colors shadow-modern"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24">
        <div className="grid md:grid-cols-2 gap-8 items-center min-h-[80vh]">
          {/* Left Side */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1E293B] leading-tight">
              <span className="text-[#00A86B]">Fair Prices</span> for Your Harvest
            </h1>
            <p className="text-xl text-[#64748B]">
              Grow only what the country needs, get guaranteed fair prices
            </p>
            
            {/* Features */}
            <div className="space-y-3">
              {[
                "No overproduction - grow exactly what's needed",
                "Get guaranteed fair prices for your crops",
                "Help meet the country's food requirements"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#00A86B] rounded-full flex items-center justify-center text-white text-xs">✓</div>
                  <span className="text-[#1E293B]">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => router.push("/signup")}
                className="px-6 py-3 bg-[#00A86B] text-white rounded-lg hover:bg-[#00875A] transition-colors shadow-modern"
              >
                Get Started
              </button>
              <button
                onClick={() => window.open("https://agrismart.lk", "_blank")}
                className="px-6 py-3 border-2 border-[#00A86B] text-[#00A86B] rounded-lg hover:bg-[#F1F5F9] transition-colors"
              >
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div>
                <div className="text-2xl font-bold text-[#00A86B]">500+</div>
                <div className="text-sm text-[#64748B]">Farmers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#00A86B]">1000+</div>
                <div className="text-sm text-[#64748B]">Acres</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#00A86B]">15+</div>
                <div className="text-sm text-[#64748B]">Crops</div>
              </div>
            </div>
          </div>

          {/* Right Side - Video */}
          <div className="relative">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-[#00A86B] rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative w-full h-full flex items-center justify-center">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain rounded-2xl"
                >
                  <source src="/videos/logo-animation.mp4" type="video/mp4" />
                  <div className="w-64 h-64 bg-gradient-to-br from-[#00A86B] to-[#00875A] rounded-full flex items-center justify-center shadow-2xl">
                    <span className="text-8xl text-white animate-bounce">🌾</span>
                  </div>
                </video>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}