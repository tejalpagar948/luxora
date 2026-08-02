import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Container } from './Container';
import { logoutUser } from '../../../services/authService';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const navigate = useNavigate();

  const links = isAdmin
    ? [
      { name: 'Dashboard', path: '/admin' },
      { name: 'Manage Products', path: '/admin/products' },
      { name: 'Create Product', path: '/admin/products/new' },
      { name: 'Storefront', path: '/' },
    ]
    : [
      { name: 'Home', path: '/' },
      { name: 'Collections', path: '/collections' },
      { name: 'Cart', path: '/cart' },
      { name: 'Admin', path: '/admin' },
    ];

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <header className="w-full bg-background border-b border-border-light py-6 sticky top-0 z-50">
      <Container className="flex justify-between items-center relative">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-primary focus:outline-none p-1 text-xl cursor-pointer"
        >
          ☰
        </button>

        {/* Brand Logo */}
        <Link to="/" className="font-display text-[24px] md:text-[28px] font-semibold tracking-wider text-primary hover:opacity-80 transition-opacity duration-200">
          LUXORA
        </Link>

        {/* Navigation Links (Desktop only) */}
        <div className="hidden md:block">
          <Navbar />
        </div>

        {/* Action Elements */}
        <div className="flex items-center space-x-4 md:space-x-6 font-body text-label-caps">
          <button
            onClick={handleLogout}
            className="text-primary hover:text-accent transition-colors duration-200 text-xs md:text-sm"
          >
            Logout
          </button>
          <Link to="/cart" className="relative p-1 text-xs md:text-sm">
            <span className="text-primary hover:text-accent transition-colors duration-200 uppercase tracking-widest">
              Cart (0)
            </span>
          </Link>
        </div>

        {/* Mobile Navigation Drawer Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-[60px] left-0 w-full bg-background border-b border-border-light shadow-md py-6 px-5 flex flex-col space-y-4 z-40 md:hidden animate-fadeIn">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`font-body text-label-caps uppercase text-sm ${location.pathname === link.path ? 'text-accent' : 'text-primary'
                  } hover:text-accent`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </Container>
    </header>
  );
};
