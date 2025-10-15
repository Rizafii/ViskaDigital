import React from "react";
import { Globe, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo and App Downloads */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold">
                ViskaDigital<span className="align-super text-xs">©</span>
              </span>
            </div>

            {/* Language and Region */}
            <div className="space-y-2">
              <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                <MapPin className="w-4 h-4" />
                <span>Surakarta, Indonesia</span>
              </button>
            </div>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >
                <Facebook className="w-5 h-5 text-gray-700" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >
                <Twitter className="w-5 h-5 text-gray-700" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >
                <Instagram className="w-5 h-5 text-gray-700" />
              </a>
            </div>
          </div>

          {/* Discover */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Discover</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Explore
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Leaderboard
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  For Creators
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  What is a Twibbon?
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Use Cases
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Testimonials
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3 mb-6">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Media Assets
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            © 2025 Rizafi Dev - All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6 text-sm">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Terms & Conditions
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Cookie Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Site Map
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
