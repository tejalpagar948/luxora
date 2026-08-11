import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormSection } from '../../components/forms/FormSection';
import { FormField } from '../../components/forms/FormField';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { createProduct } from '../../../services/productService';

import { toast } from 'react-hot-toast';

export const CreateProduct: React.FC = () => {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    image: File | null;
  }>({
    title: "",
    description: "",
    category: "",
    price: 0,
    stock: 0,
    image: null,
  })
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("price", String(formData.price));
      data.append("stock", String(formData.stock));
      if (!formData.image) {
        toast.error("Please upload a product image");
        return;
      }
      data.append("image", formData.image);

      const res = await createProduct(data);
      toast.success(res.data.message);
      navigate('/admin/products');
    }
    catch (err: any) {
      console.log(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="px-5 py-8 md:p-8 bg-background min-h-screen max-w-4xl font-body">
      <div className="mb-8">
        <h1 className="font-display text-headline-md text-primary font-semibold">
          Create New Product
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Publish a new design to the Luxora collection catalog.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <FormSection title="General Information" description="Set the design details, brand category, and description text for this piece.">
          <FormField label="Product Name">
            <Input type="text" placeholder="e.g. Signature Tote Bag" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </FormField>
          <FormField label="Description">
            <textarea
              rows={4}
              placeholder="Describe the silhouette, utility, and craftsmanship..."
              className="w-full px-4 py-3 border border-border-light rounded-md bg-background text-primary placeholder-neutral-400 focus:outline-none focus:border-primary transition-colors duration-200"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </FormField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Category">
              <Input type="text" placeholder="e.g. Totes" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Pricing & Inventory" description="Define the exclusive retail price and initial stock quantities.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Retail Price ($)">
              <Input type="number" placeholder="850" min="0" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
            </FormField>
            <FormField label="Initial Inventory Stock">
              <Input type="number" placeholder="10" min="0" required value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Product Media" description="Attach high-resolution product showcase images. Recommended aspect ratio is 4:5.">
          <div className="flex flex-col gap-2 mt-2">
            <label
              htmlFor="product-image-upload"
              className="font-body text-button px-6 py-3 rounded-md transition-all duration-300 focus:outline-none uppercase font-semibold text-center inline-block cursor-pointer bg-transparent text-primary hover:bg-primary hover:text-background border border-primary w-fit"
            >
              {formData.image ? formData.image.name : "Upload Image"}
            </label>
            <input
              id="product-image-upload"
              type="file"
              name="image"
              className="hidden"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  image: e.target.files?.[0] || null,
                })
              }
            />
          </div>
        </FormSection>

        <div className="flex flex-col sm:flex-row justify-end gap-3 border-t border-border-light pt-8 w-full">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/products')} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="w-full sm:w-auto">
            Create Product
          </Button>
        </div>
      </form>
    </div>
  );
};
