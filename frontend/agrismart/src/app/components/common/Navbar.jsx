"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar({ user, onLogout }) {
  const router = useRouter();

  return (
    <nav className="bg-white shadow-modern sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image 
              src="/images/logo2.jpg" 
              alt="AgriSmart Logo" 
              width={40} 
              height={40}
              className="rounded-lg group-hover:scale-105 transition-transform"
            />
            <span className="font-bold text-xl text-gradient hidden sm:block">
              AgriSmart
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link href="/farmer" className="text-gray-600 hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Link href="/farmer/about" className="text-gray-600 hover:text-primary transition-colors">
                  About
                </Link>
                <div className="flex items-center gap-3 ml-4">
                  <span className="text-gray-700">{user.fullName}</span>
                  <button
                    onClick={onLogout}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push("/signin")}
                  className="px-4 py-2 text-primary hover:text-primary-dark transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push("/signup")}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}