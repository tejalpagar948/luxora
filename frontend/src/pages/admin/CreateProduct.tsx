import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FormSection } from '../../components/forms/FormSection';
import { FormField } from '../../components/forms/FormField';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const CreateProduct: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/admin/products');
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
            <Input type="text" placeholder="e.g. Signature Tote Bag" required />
          </FormField>
          <FormField label="Description">
            <textarea
              rows={4}
              placeholder="Describe the silhouette, utility, and craftsmanship..."
              className="w-full px-4 py-3 border border-border-light rounded-md bg-background text-primary placeholder-neutral-400 focus:outline-none focus:border-primary transition-colors duration-200"
              required
            />
          </FormField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Category">
              <Input type="text" placeholder="e.g. Totes" required />
            </FormField>
            <FormField label="Status Label / Tag">
              <Input type="text" placeholder="e.g. Limited Edition" />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Pricing & Inventory" description="Define the exclusive retail price and initial stock quantities.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Retail Price ($)">
              <Input type="number" placeholder="850" min="0" required />
            </FormField>
            <FormField label="Initial Inventory Stock">
              <Input type="number" placeholder="10" min="0" required />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Product Media" description="Attach high-resolution product showcase images. Recommended aspect ratio is 4:5.">
          <FormField label="Image URL">
            <Input type="url" placeholder="https://images.unsplash.com/..." required />
          </FormField>
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
