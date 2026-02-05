import React from 'react';
import Navbar from '../Components/Navbar';
import Services from './Landing/Services';
import Pricing from './Landing/Pricing';

export default function Home() {
  return (
    <div className="">

      <Navbar />

      <section className="bg-gradient-to-r from-red-600/70 via-pink-600/60 to-indigo-600/50 text-white rounded-r-full">
        <div className="container mx-auto px-6 py-32 text-center md:text-left md:flex md:items-center md:justify-between">
          <div className="md:w-1/2">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-shadow-xs">Build your inventory-management aplication</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">Modern Multisector platform with analytics, management, and functional flexible content with Modern UI</p>
            <div className="flex gap-4 justify-center md:justify-start">
              <a href="/register" className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition">Get Started</a>
              <a href="#pricing" className="px-6 py-3 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">See Pricing</a>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
          </div>
        </div>
      </section>

      {/* Services */}
      <Services />

      {/* Pricing / Subscription */}
      <Pricing />

      {/* About */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 md:flex md:items-center md:gap-12">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h2 className="text-4xl font-bold mb-4">About MR:Space</h2>
            <p className="text-gray-700 mb-6">
              MR:Space is a modern SaaS platform designed to help startups and enterprises scale operations efficiently.
            </p>
            <a href="/register" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">Get Started</a>
          </div>
          <div className="md:w-1/2">
            <img src="https://source.unsplash.com/600x400/?office,technology" alt="About" className="rounded-lg shadow-lg"/>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-2xl">
          <h2 className="text-4xl font-bold text-center mb-12">Contact Us</h2>
          <form className="grid gap-6">
            <input type="text" placeholder="Name" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:outline-none"/>
            <input type="email" placeholder="Email" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:outline-none"/>
            <textarea placeholder="Message" rows="4" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:outline-none"></textarea>
            <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">Send Message</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} MR:Space. All rights reserved.</p>
          <div className="flex justify-center mt-4 gap-6">
            <a href="#" className="hover:text-blue-400 transition">Twitter</a>
            <a href="#" className="hover:text-blue-400 transition">LinkedIn</a>
            <a href="#" className="hover:text-blue-400 transition">GitHub</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
