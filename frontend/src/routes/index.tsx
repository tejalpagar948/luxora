import React from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { AdminSidebar } from '../components/layout/AdminSidebar';

// Storefront Pages
import { Home } from '../pages/storefront/Home';
import { Collections } from '../pages/storefront/Collections';
import { ProductDetails } from '../pages/storefront/ProductDetails';
import { Cart } from '../pages/storefront/Cart';
import { Login } from '../pages/storefront/Login';
import { Register } from '../pages/storefront/Register';

// Admin Pages
import { Dashboard } from '../pages/admin/Dashboard';
import { ProductManagement } from '../pages/admin/ProductManagement';
import { CreateProduct } from '../pages/admin/CreateProduct';
import { EditProduct } from '../pages/admin/EditProduct';

// Storefront Layout Wrapper
const StorefrontLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen bg-background text-primary">
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// Admin Layout Wrapper
const AdminLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen bg-background text-primary">
    <Header />
    <div className="flex flex-1">
      <AdminSidebar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <StorefrontLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'collections', element: <Collections /> },
      { path: 'products/:id', element: <ProductDetails /> },
      { path: 'cart', element: <Cart /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'products', element: <ProductManagement /> },
      { path: 'products/new', element: <CreateProduct /> },
      { path: 'products/:id/edit', element: <EditProduct /> },
    ],
  },
]);
