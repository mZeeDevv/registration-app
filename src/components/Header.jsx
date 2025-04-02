import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`w-full bg-white py-4 text-primary-600 print:hidden relative z-30 shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="text-2xl font-display font-bold tracking-wide flex items-center">
          <img src={logo} alt="Nepdent Logo" className="w-[80px]" />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-primary-300 transition-colors duration-300 font-medium">
                Home
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-primary-300 transition-colors duration-300 font-medium">
                Register
              </Link>
            </li>
            <li>
              <Link to="/verify-registration" className="hover:text-primary-300 transition-colors duration-300 font-medium">
                Verify Registration
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden flex items-center p-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            ) : (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            )}
          </svg>
        </button>
      </div>
      
      {/* Mobile Navigation */}
      <div 
        className={`md:hidden fixed top-[60px] left-0 right-0 bg-white border-t border-gray-200 transition-all duration-300 ease-in-out z-20 ${
          isMenuOpen ? 'block opacity-100 shadow-lg' : 'hidden opacity-0'
        }`}
      >
        <nav className="px-4 py-2">
          <ul className="flex flex-col space-y-3 py-3">
            <li>
              <Link 
                to="/" 
                className="block py-2 hover:text-primary-300 transition-colors duration-300 font-medium text-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/register" 
                className="block py-2 hover:text-primary-300 transition-colors duration-300 font-medium text-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </li>
            <li>
              <Link 
                to="/verify-registration" 
                className="block py-2 hover:text-primary-300 transition-colors duration-300 font-medium text-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Verify Registration
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
