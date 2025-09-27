import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import logoImage from '@/assets/images/beef_images/logo.png';

// A reusable component for footer link columns
const FooterColumn = ({ title, links }) => (
  <div>
    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">{title}</h3>
    <ul className="mt-4 space-y-3">
      {links.map((link, index) => (
        <li key={index}>
          <Link to={link.href} className="text-gray-500 hover:text-gray-900 transition-colors duration-300 text-sm">
            {link.text}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default function Footer() {
  const year = new Date().getFullYear();

  // Define the links based on the routes in your App.jsx
  const mainPages = [
    { href: '/', text: 'Home' },
    { href: '/shop', text: 'Shop' },
    { href: '/lookbook', text: 'Lookbook' },
  ];

  const informationPages = [
    { href: '/about', text: 'About Us' },
    { href: '/contact', text: 'Contact' },
  ];

  const accountPages = [
    { href: '/login', text: 'Sign In' },
    { href: '/register', text: 'Create Account' },
    { href: '/dashboard', text: 'My Orders' },
  ];

  return (
    <footer className="bg-white border-t border-gray-200  bottom-0 left-0 w-full z-40">
      <div className="container mx-auto px-6 py-12">
        {/* Top section with columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* About Section with Logo */}
          <div className="col-span-2 md:col-span-1">
             <img src={logoImage} alt="Outfit Oracle Logo" className="h-12 w-auto object-contain mb-4" />
             <p className="text-sm text-gray-500">
                Timeless fashion, curated for the modern individual. Quality you can feel, style you'll love.
             </p>
          </div>
          
          <FooterColumn title="Navigate" links={mainPages} />
          <FooterColumn title="Information" links={informationPages} />
          <FooterColumn title="My Account" links={accountPages} />
        </div>

        {/* Bottom section with copyright and social media */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {year} Outfit Oracle. All Rights Reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-gray-600"><Twitter size={20} /></a>
            <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-gray-600"><Facebook size={20} /></a>
            <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-gray-600"><Instagram size={20} /></a>
            <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-gray-600"><Youtube size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

