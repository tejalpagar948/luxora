import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { getProducts, deleteProduct } from '../../../services/productService';

interface Product {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

export const ProductManagement: React.FC = () => {

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // --- naye states delete confirmation ke liye ---
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {

    const fetchProducts = async () => {
      try {
        const res = await getProducts();

        console.log("API RESPONSE:", res.data);

        if (res.data.data) {
          setProducts(res.data.data);
        }
        else if (Array.isArray(res.data)) {
          setProducts(res.data);
        }

      } catch (error) {
        console.log("Fetch Products Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="font-body text-neutral-400">
          Loading products...
        </p>
      </div>
    );
  }

  // delete button click hone par popup kholna
  const openDeleteConfirm = (product: Product) => {
    setDeleteTarget(product);
    setDeleteError('');
  };

  // cancel/close popup
  const closeDeleteConfirm = () => {
    if (deleting) return; // deleting ke time band na ho
    setDeleteTarget(null);
  };

  // confirm hone par actual delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      setDeleteError('');

      await deleteProduct(deleteTarget._id);

      setProducts((prev) =>
        prev.filter((product) => product._id !== deleteTarget._id)
      );

      setDeleteTarget(null);

    } catch (error: any) {
      console.log("Delete Product Error:", error);
      setDeleteError(
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong while deleting.'
      );
    } finally {
      setDeleting(false);
    }
  };

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


        <Link to="/admin/products/new" className="w-full sm:w-auto block sm:inline-block">
          <Button variant="primary" className="w-full">
            Add New Product
          </Button>
        </Link>

      </div>



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

                <tr
                  key={product._id}
                  className="border-b border-border-light hover:bg-background-alt/50 transition-colors"
                >

                  <td className="py-4 px-4 font-semibold text-primary">
                    {product.title}
                  </td>


                  <td className="py-4 px-4">
                    {product.category}
                  </td>


                  <td className="py-4 px-4 font-semibold text-primary">
                    ${product.price.toFixed(2)}
                  </td>


                  <td className="py-4 px-4">
                    {product.stock} pcs
                  </td>


                  <td className="py-4 px-4 text-right space-x-2">

                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="text-accent hover:underline text-xs font-semibold uppercase tracking-wider"
                    >
                      Edit
                    </Link>


                    <button
                      className="text-red-600 hover:underline text-xs font-semibold uppercase tracking-wider"
                      onClick={() => openDeleteConfirm(product)}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* Delete confirmation popup */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteConfirm}
      />

      {deleteError && (
        <p className="text-red-500 text-sm mt-4 px-1">{deleteError}</p>
      )}

    </div >
  );
};