"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const profileCompleted = localStorage.getItem('profileCompleted');
    
    if (token && userRole === 'admin') {
      router.push('/admin1');
    } else if (token && userRole === 'farmer') {
      if (profileCompleted === 'true') {
        router.push('/farmer');
      } else {
        router.push('/signup/createprofile');
      }
    } else {
      setIsLoggedIn(false);
      setLoading(false);
    }
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading AgriSmart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-white/90 backdrop-blur-sm py-4"
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/images/logo2.jpg" 
                alt="AgriSmart Logo" 
                width={40} 
                height={40}
                className="rounded-lg object-contain"
                priority
              />
              <span className="font-bold text-xl text-green-700">AgriSmart</span>
              <span className="hidden md:inline text-sm text-gray-500">.lk</span>
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-600 hover:text-green-600 transition">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-green-600 transition">How It Works</a>
              <a href="#benefits" className="text-gray-600 hover:text-green-600 transition">Benefits</a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/signin")}
                className="px-4 py-2 text-gray-600 font-medium hover:text-green-600 transition"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-green-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                <span className="text-green-600">Fair Prices</span> for Your Harvest
              </h1>
              <p className="text-xl text-green-600 font-medium mt-4">
                Sri Lanka's Smart Farming Revolution
              </p>
              <p className="text-gray-600 mt-4">
                Grow exactly what the country needs. Get guaranteed fair prices. 
                Help meet national food requirements while securing your livelihood.
              </p>
              
              <div className="flex flex-wrap gap-4 mt-8">
                <button
                  onClick={() => router.push("/signup")}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-lg"
                >
                  Start Farming Smart
                </button>
                <a 
                  href="#features"
                  className="px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition"
                >
                  Learn More
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-gray-100">
                <div>
                  <div className="text-2xl font-bold text-green-600">500+</div>
                  <div className="text-sm text-gray-500">Registered Farmers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">1000+</div>
                  <div className="text-sm text-gray-500">Acres Cultivated</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">15+</div>
                  <div className="text-sm text-gray-500">Crop Types</div>
                </div>
              </div>
            </div>

            {/* Right Side - Animation */}
            <div className="relative">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain rounded-2xl"
                >
                  <source src="/videos/cutelogo.mp4" type="video/mp4" />
                  <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                    <Image 
                      src="/images/logo2.jpg" 
                      alt="AgriSmart Logo" 
                      width={200} 
                      height={200}
                      className="rounded-full object-cover"
                    />
                  </div>
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Why Choose AgriSmart?</h2>
            <p className="text-gray-500 mt-2">Smart farming solutions for Sri Lankan farmers</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "📊",
                title: "Supply & Demand Balance",
                description: "We analyze national food requirements to prevent overproduction and ensure fair prices"
              },
              {
                icon: "✅",
                title: "Guaranteed Fair Prices",
                description: "Get assured prices for your harvest based on actual market demand"
              },
              {
                icon: "📱",
                title: "QR Code Verification",
                description: "Download QR codes for your registrations with all your details"
              },
              {
                icon: "👨‍🌾",
                title: "Easy Registration",
                description: "Register your crops easily through our farmer dashboard"
              },
              {
                icon: "📈",
                title: "Real-time Monitoring",
                description: "Track your seasons and registrations in real-time"
              },
              {
                icon: "🔒",
                title: "Secure & Reliable",
                description: "Your data is secure with our protected system"
              }
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition group">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">How It Works</h2>
            <p className="text-gray-500 mt-2">Simple steps to start your smart farming journey</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Sign Up", desc: "Create account with phone number & password" },
              { step: "2", title: "Complete Profile", desc: "Add your personal details (NIC, address, etc.)" },
              { step: "3", title: "Start Season", desc: "Register your crop and acreage" },
              { step: "4", title: "Get QR Code", desc: "Download verification QR code" }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Benefits for Farmers</h2>
              <ul className="mt-6 space-y-3">
                {[
                  "No overproduction - grow exactly what's needed",
                  "Get guaranteed fair prices for your crops",
                  "Help meet the country's food requirements",
                  "Monthly registration opportunities",
                  "QR code verification for each registration",
                  "Easy tracking of your seasons and payments"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-green-600 text-xl">✓</span>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => router.push("/signup")}
                className="mt-8 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Join AgriSmart Today
              </button>
            </div>
            <div className="bg-green-50 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">👨‍🌾</div>
              <h3 className="text-xl font-semibold text-gray-800">Already a Farmer?</h3>
              <p className="text-gray-500 mt-2">Sign in to manage your crops and registrations</p>
              <button
                onClick={() => router.push("/signin")}
                className="mt-4 px-5 py-2 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image 
                  src="/images/logo2.jpg" 
                  alt="AgriSmart Logo" 
                  width={32} 
                  height={32}
                  className="rounded-lg object-contain"
                />
                <span className="font-bold text-xl">AgriSmart</span>
                <span className="text-sm text-gray-400">.lk</span>
              </div>
              <p className="text-gray-400 text-sm">Sri Lanka's Smart Farming Revolution</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
                <li><a href="#benefits" className="hover:text-white">Benefits</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <p className="text-gray-400 text-sm">Email: support@agrismart.lk</p>
              <p className="text-gray-400 text-sm">Phone: +94 71 234 5678</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500 text-sm">
            &copy; 2024 AgriSmart.lk - All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
}