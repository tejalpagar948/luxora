import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Container } from './Container';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const location = useLocation();

  const { isAuthenticated, user } = useAuth();

  // Sirf ye check karta hai ki current page admin section ka hai
  const isAdminPage = location.pathname.startsWith('/admin');

  const links = isAdminPage
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

      // Sirf admin ko Admin link dikhega
      ...(user?.isAdmin
        ? [{ name: 'Admin', path: '/admin' }]
        : []),
    ];

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
        <Link
          to="/"
          className="font-display text-[24px] md:text-[28px] font-semibold tracking-wider text-primary hover:opacity-80 transition-opacity duration-200"
        >
          LUXORA
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:block">
          <Navbar />
        </div>

        {/* Action Elements */}
        <div className="flex items-center space-x-4 md:space-x-6 font-body text-label-caps">

          {isAuthenticated ? (
            <Link
              to="/profile"
              className="w-8 h-8 rounded-full overflow-hidden bg-neutral-100 border border-accent hover:border-primary flex items-center justify-center text-xs font-semibold text-neutral-600 transition-all duration-200"
              title="View Profile"
            >
              {user?.picture ? (
                <img src={user.picture} alt={user.fullName} className="w-full h-full object-cover" />
              ) : (
                <span className="font-display leading-none text-neutral-700">{user?.fullName?.charAt(0).toUpperCase() || 'U'}</span>
              )}
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-primary hover:text-accent transition-colors duration-200 text-xs md:text-xm uppercase tracking-widest"
            >
              Login
            </Link>
          )}

        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="absolute top-[60px] left-0 w-full bg-background border-b border-border-light shadow-md py-6 px-5 flex flex-col space-y-4 z-40 md:hidden animate-fadeIn">

            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`font-body text-label-caps uppercase text-sm ${location.pathname === link.path
                    ? 'text-accent'
                    : 'text-primary'
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