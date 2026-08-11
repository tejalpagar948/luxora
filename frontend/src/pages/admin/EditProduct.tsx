import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormSection } from '../../components/forms/FormSection';
import { FormField } from '../../components/forms/FormField';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { getProductById, updateProduct } from '../../../services/productService';

interface Product {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

export const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!product?.image) {
      setImageUrl(null);
      return;
    }

    setImageUrl(product.image);
  }, [product?.image]);

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        setError('');

        if (!id) {
          throw new Error('Product ID not found.');
        }

        const res = await getProductById(id);

        // Backend response:
        // {
        //   success: true,
        //   data: { ...product }
        // }

        if (!res.data.success) {
          throw new Error(res.data.message || 'Unable to fetch product.');
        }

        setProduct(res.data.data);

      } catch (err: any) {
        console.error(err);

        setError(
          err.response?.data?.message ||
          err.message ||
          'Something went wrong.'
        );

      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  const handleChange = (
    field: keyof Product,
    value: string | number | File | null
  ) => {
    if (!product) return;

    setProduct({
      ...product,
      [field]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !product) return;

    try {
      setSubmitting(true);
      setSubmitError('');

      const formData = new FormData();

      formData.append("title", product.title);
      formData.append("description", product.description);
      formData.append("category", product.category);
      formData.append("price", product.price.toString());
      formData.append("stock", product.stock.toString());

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      await updateProduct(id, formData);
      navigate('/admin/products');

    } catch (err: any) {
      console.error(err);

      setSubmitError(
        err.response?.data?.message ||
        err.message ||
        'Something went wrong while saving.'
      );

    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading Product...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4">
        <p className="text-red-500 font-medium">{error}</p>

        <Button
          variant="outline"
          onClick={() => navigate('/admin/products')}
        >
          Back to Products
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4">
        <p className="text-neutral-400 font-medium">Product not found.</p>

        <Button
          variant="outline"
          onClick={() => navigate('/admin/products')}
        >
          Back to Products
        </Button>
      </div>
    );
  }


  console.log("product", product)

  return (
    <div className="px-5 py-8 md:p-8 bg-background min-h-screen max-w-4xl font-body">
      <div className="mb-8">
        <h1 className="font-display text-headline-md text-primary font-semibold">
          Edit Product
        </h1>

        <p className="text-sm text-neutral-400 mt-1">
          Modify detail tokens, catalog price, or stock levels for this piece.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <FormSection
          title="General Information"
          description="Set the design details, brand category, and description."
        >
          <FormField label="Product Name">
            <Input
              type="text"
              value={product.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </FormField>

          <FormField label="Description">
            <textarea
              rows={4}
              value={product.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-4 py-3 border border-border-light rounded-md bg-background"
              required
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Category">
              <Input
                type="text"
                value={product.category}
                onChange={(e) => handleChange('category', e.target.value)}
                required
              />
            </FormField>

            <FormField label="Stock">
              <Input
                type="number"
                value={product.stock}
                onChange={(e) => handleChange('stock', Number(e.target.value))}
                min="0"
                required
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection
          title="Pricing"
          description="Update the retail price."
        >
          <FormField label="Price">
            <Input
              type="number"
              value={product.price}
              onChange={(e) => handleChange('price', Number(e.target.value))}
              min="0"
              required
            />
          </FormField>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Product Preview"
              className="w-40 h-40 object-cover rounded mb-4 border"
            />
          )}
          <div className="flex flex-col gap-2 mt-2">
            <label
              htmlFor="product-image-upload"
              className="font-body text-button px-6 py-3 rounded-md transition-all duration-300 focus:outline-none uppercase font-semibold text-center inline-block cursor-pointer bg-transparent text-primary hover:bg-primary hover:text-background border border-primary w-fit"
            >
              {selectedImage ? selectedImage.name : (product?.image ? "Update Image" : "Upload Image")}
            </label>
            <input
              id="product-image-upload"
              type="file"
              name="image"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                setSelectedImage(file);

                // New image ka preview turant dikhao
                const previewUrl = URL.createObjectURL(file);
                setImageUrl(previewUrl);
              }}
            />
          </div>
        </FormSection>

        {submitError && (
          <p className="text-red-500 text-sm mt-4">{submitError}</p>
        )}

        <div className="flex justify-end gap-3 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/products')}
            disabled={submitting}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={submitting} >
            {submitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};