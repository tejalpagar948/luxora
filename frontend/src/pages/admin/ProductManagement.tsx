import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export const ProductManagement: React.FC = () => {
  // Mock list of products
  const products = [
    { id: '1', name: 'The Signature Tote', price: 850, category: 'Totes', stock: 12 },
    { id: '2', name: 'Heritage Crossbody', price: 490, category: 'Crossbody', stock: 24 },
    { id: '3', name: 'Editorial Top Handle', price: 1200, category: 'Handbags', stock: 5 },
  ];

  return (
    <div className="px-5 py-8 md:p-8 font-body bg-background min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-baseline sm:items-center mb-8 gap-4">
        <div>
          <h1 className="font-display text-headline-md text-primary font-semibold">
            Product Management
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Manage your boutique catalog and stock levels.
          </p>
        </div>
        <Link to="/admin/products/new" className="w-full sm:w-auto">
          <Button variant="primary" className="w-full sm:w-auto">Add New Product</Button>
        </Link>
      </div>

      {/* Catalog Table */}
      <div className="bg-background border border-border-light rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-500">
            <thead className="text-xs text-neutral-400 uppercase tracking-widest bg-background-alt border-b border-border-light">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-border-light hover:bg-background-alt/50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-primary">{product.name}</td>
                  <td className="py-4 px-4">{product.category}</td>
                  <td className="py-4 px-4 font-semibold text-primary">${product.price.toFixed(2)}</td>
                  <td className="py-4 px-4">{product.stock} pcs</td>
                  <td className="py-4 px-4 text-right space-x-2">
                    <Link to={`/admin/products/${product.id}/edit`} className="text-accent hover:underline text-xs font-semibold uppercase tracking-wider">
                      Edit
                    </Link>
                    <button className="text-red-600 hover:underline text-xs font-semibold uppercase tracking-wider">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
