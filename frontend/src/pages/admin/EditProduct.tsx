import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormSection } from '../../components/forms/FormSection';
import { FormField } from '../../components/forms/FormField';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/admin/products');
  };

  return (
    <div className="px-5 py-8 md:p-8 bg-background min-h-screen max-w-4xl font-body">
      <div className="mb-8">
        <h1 className="font-display text-headline-md text-primary font-semibold">
          Edit Product Info (ID: {id})
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Modify detail tokens, catalog price, or stock levels for this piece.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <FormSection title="General Information" description="Set the design details, brand category, and description text for this piece.">
          <FormField label="Product Name">
            <Input type="text" defaultValue="The Signature Tote" required />
          </FormField>
          <FormField label="Description">
            <textarea
              rows={4}
              defaultValue="A structural, sculptural tote bag engineered for modern business. Features a spacious main compartment, double top handles, and an internal card holder pocket."
              className="w-full px-4 py-3 border border-border-light rounded-md bg-background text-primary placeholder-neutral-400 focus:outline-none focus:border-primary transition-colors duration-200"
              required
            />
          </FormField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Category">
              <Input type="text" defaultValue="Totes" required />
            </FormField>
            <FormField label="Status Label / Tag">
              <Input type="text" defaultValue="Classic" />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Pricing & Inventory" description="Define the exclusive retail price and initial stock quantities.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Retail Price ($)">
              <Input type="number" defaultValue="850" min="0" required />
            </FormField>
            <FormField label="Initial Inventory Stock">
              <Input type="number" defaultValue="12" min="0" required />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Product Media" description="Attach high-resolution product showcase images. Recommended aspect ratio is 4:5.">
          <FormField label="Image URL">
            <Input type="url" defaultValue="https://images.unsplash.com/photo-1584917865442-de89df76afd3" required />
          </FormField>
        </FormSection>

        <div className="flex flex-col sm:flex-row justify-end gap-3 border-t border-border-light pt-8 w-full">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/products')} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="w-full sm:w-auto">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
