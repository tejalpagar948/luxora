import React from 'react';
import { NavLink } from 'react-router-dom';

export const AdminSidebar: React.FC = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/admin', end: true },
    { name: 'Manage Products', path: '/admin/products', end: false },
    { name: 'Create Product', path: '/admin/products/new', end: false },
  ];

  return (
    <aside className="w-64 bg-background-alt border-r border-border-light h-screen sticky top-[81px] p-8 hidden md:block">
      <div className="mb-8">
        <h2 className="font-display text-[20px] text-primary font-semibold tracking-wide">
          Admin Portal
        </h2>
        <p className="font-body text-xs text-neutral-400 mt-1 uppercase tracking-wider">
          Store Operations
        </p>
      </div>

      <nav className="flex flex-col space-y-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `font-body text-label-caps uppercase tracking-widest text-[11px] py-2 px-3 rounded-md transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-background'
                  : 'text-primary hover:bg-secondary'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
