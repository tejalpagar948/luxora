import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../hooks/useCart';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { cart } = useCart();
  const isAdmin = location.pathname.startsWith('/admin');

  // Calculate live cart item count
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const links = isAdmin
    ? [
      { name: 'Dashboard', path: '/admin' },
      { name: 'Products', path: '/admin/products' },
      { name: 'Create Product', path: '/admin/products/new' },
      { name: 'Storefront', path: '/' },
    ]
    : [
      { name: 'Home', path: '/' },
      { name: 'Collections', path: '/collections' },
      ...(user?.isAdmin
        ? [{ name: 'Admin', path: '/admin' }]
        : [{ name: 'Cart', path: '/cart' }])
    ];

  return (
    <nav className="flex space-x-8 font-body text-label-caps items-center">
      {links.map((link) => {
        const isActive = location.pathname === link.path;
        const isCart = link.name === 'Cart';
        return (
          <Link
            key={link.name}
            to={link.path}
            className={`uppercase tracking-widest text-[12px] hover:text-accent transition-colors duration-200 py-1 relative flex items-center gap-1.5 ${
              isActive ? 'text-accent' : 'text-primary'
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
  );
};
