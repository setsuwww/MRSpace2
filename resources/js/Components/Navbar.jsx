import React from 'react';

export default function Navbar() {
    return (
        <nav className="bg-white shadow sticky top-0 z-50">
            <div className="container mx-auto px-7 py-4.5 flex justify-between items-center">
                <a href="/" className="text-2xl font-bold text-blue-600">MR:Space</a>
                <div className="hidden md:flex space-x-6 items-center">
                    <a href="#services" className="hover:text-blue-600 transition">Services</a>
                    <a href="#pricing" className="hover:text-blue-600 transition">Pricing</a>
                    <a href="#about" className="hover:text-blue-600 transition">About</a>
                    <a href="#contact" className="hover:text-blue-600 transition">Contact</a>

                    <div className="space-x-2">
                        <a href="/login" className="px-6 py-2 bg-gradient-to-r from-rose-300 to-indigo-300 text-white rounded-2xl">Login</a>
                    </div>
                </div>
            </div>
        </nav>
    )
}
