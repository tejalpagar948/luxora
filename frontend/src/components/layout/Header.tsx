import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container } from './Container';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../hooks/useCart';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { cart } = useCart();

  // Real-time cart quantity count
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Sirf ye check karta hai ki current page admin section ka hai
  const isAdminPage = location.pathname.startsWith('/admin');

  const links = isAdminPage
    ? [
      { name: 'Dashboard', path: '/admin' },
      // { name: 'Manage Products', path: '/admin/products' },
      // { name: 'Create Product', path: '/admin/products/new' },
      // { name: 'Orders', path: '/admin/orders' },
      { name: 'Storefront', path: '/' },
    ]
    : [
      { name: 'Home', path: '/' },
      { name: 'Collections', path: '/collections' },
      ...(!user?.isAdmin ? [{ name: 'Cart', path: '/cart' }] : []),
      ...(user?.isAdmin ? [{ name: 'Admin', path: '/admin' }] : []),
    ];

  return (
    <header className="w-full bg-background/95 backdrop-blur-md border-b border-border-light py-5 sticky top-0 z-50 transition-all duration-300">
      <Container className="flex justify-between items-center relative">

        {/* Animated Mobile Hamburger Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-primary focus:outline-none p-1.5 cursor-pointer relative z-50 w-8 h-8 flex items-center justify-center"
          aria-label="Toggle menu"
        >
          <div className="flex flex-col justify-between w-5 h-3.5 transform transition-all duration-300">
            <span className={`h-[1.5px] w-5 bg-primary rounded transform transition-all duration-300 origin-left ${isMenuOpen ? 'rotate-[42deg] translate-y-[-1px]' : ''}`}></span>
            <span className={`h-[1.5px] w-5 bg-primary rounded transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-0' : ''}`}></span>
            <span className={`h-[1.5px] w-5 bg-primary rounded transform transition-all duration-300 origin-left ${isMenuOpen ? '-rotate-[42deg] translate-y-[1px]' : ''}`}></span>
          </div>
        </button>

        {/* Brand Logo */}
        <Link
          to="/"
          className="font-display text-[22px] md:text-[26px] font-semibold tracking-widest text-primary hover:opacity-85 transition-opacity duration-200"
        >
          LUXORA
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:block">
          <nav className="flex space-x-8 font-body text-label-caps items-center">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              const isCart = link.name === 'Cart';
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`uppercase tracking-widest text-[12px] hover:text-accent transition-colors duration-200 py-1 relative flex items-center gap-1.5 ${isActive ? 'text-accent' : 'text-primary'
                    }`}
                >
                  {link.name}
                  {isCart && cartCount > 0 && (
                    <span className="bg-accent text-[#121212] text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                      {cartCount}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent"></span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Action Elements */}
        <div className="flex items-center space-x-5 md:space-x-6 font-body text-label-caps">

          {/* Shopping Cart Icon (visible only to non-admins) */}
          {!user?.isAdmin && (
            <Link
              to="/cart"
              className="relative p-1 text-primary hover:text-accent transition-colors duration-200 flex items-center"
              title="Shopping Cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-[#121212] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-fadeIn shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {isAuthenticated ? (
            <Link
              to="/profile"
              className="w-8 h-8 rounded-full overflow-hidden bg-neutral-50 border border-accent hover:border-primary flex items-center justify-center text-xs font-semibold text-neutral-600 transition-all duration-200 hover:scale-105"
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
              className="text-primary hover:text-accent transition-colors duration-200 text-xs font-medium uppercase tracking-widest"
            >
              Login
            </Link>
          )}

        </div>

        {/* Mobile Navigation Drawer with Frosted Glass */}
        {isMenuOpen && (
          <div className="absolute top-[52px] left-[-20px] w-[calc(100%+40px)] bg-background/95 backdrop-blur-md border-b border-border-light shadow-lg py-8 px-6 flex flex-col space-y-4 z-40 md:hidden animate-slideDown">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-body text-label-caps uppercase text-sm tracking-widest font-semibold transition-all duration-200 ${isActive
                    ? 'text-accent border-l-2 border-accent pl-3'
                    : 'text-primary hover:text-accent hover:pl-3'
                    }`}
                >
                  {link.name}
                  {link.name === 'Cart' && cartCount > 0 && (
                    <span className="ml-2 bg-accent/15 text-accent text-[10px] py-0.5 px-2 rounded-full font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}

      </Container>
    </header>
  );
};