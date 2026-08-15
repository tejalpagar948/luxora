import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = location.pathname.startsWith('/admin');

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
    <nav className="flex space-x-8 font-body text-label-caps">
      {links.map((link) => {
        const isActive = location.pathname === link.path;
        return (
          <Link
            key={link.name}
            to={link.path}
            className={`uppercase tracking-widest text-[12px] hover:text-accent transition-colors duration-200 py-1 relative ${isActive ? 'text-accent' : 'text-primary'
              }`}
          >
            {link.name}
            {isActive && (
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent"></span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};
