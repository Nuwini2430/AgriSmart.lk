"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar({ user, onLogout }) {
  const router = useRouter();

  return (
    <nav className="bg-white shadow-modern">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <span className="font-bold text-[#1E293B]">AgriSmart</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link href="/farmer" className="text-[#64748B] hover:text-[#00A86B]">
                  Dashboard
                </Link>
                <Link href="/farmer/about" className="text-[#64748B] hover:text-[#00A86B]">
                  About
                </Link>
                <div className="flex items-center gap-3 ml-4">
                  <span className="text-[#1E293B]">{user.fullName}</span>
                  <button
                    onClick={onLogout}
                    className="px-4 py-2 bg-[#F1F5F9] text-[#1E293B] rounded-lg hover:bg-[#E2E8F0]"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push("/signin")}
                  className="px-4 py-2 text-[#00A86B] hover:text-[#00875A]"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push("/signup")}
                  className="px-4 py-2 bg-[#00A86B] text-white rounded-lg hover:bg-[#00875A]"
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