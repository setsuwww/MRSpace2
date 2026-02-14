import { Link } from "@inertiajs/react";
import React from "react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50">
      <div className="mx-2 mt-2">
        <div className="flex justify-between items-center px-8 py-4 rounded-2xl
            bg-white/5 backdrop-blur-2xl
            border border-white/10
            shadow-[0px_16px_44px_-5px_rgba(0,0,0,0.46)]">

          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold tracking-wide
              bg-gradient-to-r from-blue-400 to-purple-500
              bg-clip-text text-transparent"
          >
            MR:Space
          </Link>

          {/* Menu */}
          <div className="hidden md:flex items-center space-x-8 text-white/80">
            <a href="#services" className="hover:text-white transition">
              Services
            </a>
            <a href="#pricing" className="hover:text-white transition">
              Pricing
            </a>
            <a href="#contact" className="hover:text-white transition">
              Contact
            </a>

            {/* Login Button */}
            <Link
              href="/login"
              className="
                relative inline-flex items-center justify-center
                px-6 py-2.5
                font-semibold
                rounded-xl
                text-gray-900
                bg-white
                hover:scale-105
                transition-all duration-300
              "
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
