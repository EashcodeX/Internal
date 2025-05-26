import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                alt="Logo"
              />
              <span className="ml-2 text-xl font-bold text-gray-800">TechSolutions</span>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <a href="#home" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Home</a>
            <a href="#about" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">About</a>
            <a href="#services" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Services</a>
            <a href="#reviews" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Reviews</a>
            <a href="#domains" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Domains</a>
            <a href="#hosting" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Hosting</a>
            <a href="#contact" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">Contact Us</a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#home" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Home</a>
            <a href="#about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">About</a>
            <a href="#services" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Services</a>
            <a href="#reviews" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Reviews</a>
            <a href="#domains" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Domains</a>
            <a href="#hosting" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Hosting</a>
            <a href="#contact" className="block px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700">Contact Us</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 