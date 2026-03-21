"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-modern py-2" : "bg-white/80 backdrop-blur-sm py-4"
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Left - Home Icon */}
            <Link 
              href="https://agrismart.lk" 
              target="_blank"
              className="group flex items-center gap-2 text-secondary hover:text-primary transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                />
              </svg>
              <span className="hidden md:inline font-medium">AgriSmart.lk</span>
            </Link>

            {/* Right - Auth Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/signin")}
                className="px-4 py-2 text-secondary font-medium hover:text-primary transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-modern"
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
          
          {/* LEFT SIDE - Logo Animation Video */}
          <div className="relative">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain rounded-2xl mix-blend-multiply"
              >
                <source src="/videos/cutelogo.mp4" type="video/mp4" />
                <div className="w-64 h-64 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center shadow-2xl">
                  <span className="text-8xl text-white animate-bounce">🌾</span>
                </div>
              </video>
            </div>
            <p className="text-center text-sm text-gray-500 mt-3">
              AgriSmart - Sri Lanka's Smart Farming Revolution
            </p>
          </div>

          {/* RIGHT SIDE - Text Content */}
          <div className="space-y-5">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary leading-tight">
              <span className="text-primary">Fair Prices</span> for Your Harvest
            </h1>
            
            <p className="text-xl text-primary font-medium">
              Sri Lanka's Smart Farming Revolution
            </p>
            
            {/* Features */}
            <div className="space-y-2">
              {[
                "No overproduction - grow exactly what's needed",
                "Get guaranteed fair prices for your crops",
                "Help meet the country's food requirements"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs">✓</div>
                  <span className="text-secondary">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 pt-2">
              <button
                onClick={() => router.push("/signup")}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-modern"
              >
                Get Started
              </button>
              <button
                onClick={() => window.open("https://agrismart.lk", "_blank")}
                className="px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
              >
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div>
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-gray-600">Farmers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">1000+</div>
                <div className="text-sm text-gray-600">Acres</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">15+</div>
                <div className="text-sm text-gray-600">Crops</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}