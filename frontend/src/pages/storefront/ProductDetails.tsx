import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container } from '../../components/layout/Container';
import { ProductGallery } from '../../components/product/ProductGallery';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const PRODUCTS_MAP: Record<string, {
  name: string;
  price: number;
  category: string;
  description: string;
  details: string[];
  images: string[];
  tag?: string;
}> = {
  '1': {
    name: 'The Signature Tote',
    price: 850,
    category: 'Totes',
    description: 'A structural, sculptural tote bag engineered for modern business. Features a spacious main compartment, double top handles, and an internal card holder pocket. Designed to sit comfortably under the arm or hold in-hand.',
    details: [
      '100% full-grain Italian calf leather',
      'Hand-painted raw edges',
      'Bonded suede lining in Soft Beige',
      'Internal zippered separator compartment',
      'Dimensions: 14" W x 11.5" H x 6" D',
      'Made in Italy'
    ],
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800'
    ],
    tag: 'Classic'
  },
  '2': {
    name: 'Heritage Crossbody',
    price: 490,
    category: 'Crossbody',
    description: 'A compact everyday companion crafted from structured pebble leather. Features a secure magnetic front closure and a fully adjustable shoulder strap. Designed to soften and develop a custom patina over time.',
    details: [
      'Genuine pebbled calf leather',
      'Adjustable leather strap (22" drop)',
      'Polished brass hardware with gold finish',
      'Dual internal card compartments',
      'Dimensions: 8.5" W x 6" H x 3" D',
      'Made in Italy'
    ],
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800'
    ],
    tag: 'New'
  }
};

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = PRODUCTS_MAP[id || '1'] || PRODUCTS_MAP['1'];

  return (
    <div className="w-full bg-background min-h-screen py-[64px]">
      <Container>
        {/* Breadcrumb */}
        <div className="mb-8 font-body text-xs text-neutral-400">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/collections" className="hover:text-primary">Collections</Link>
          <span className="mx-2">/</span>
          <span className="text-primary font-semibold">{product.name}</span>
        </div>

        {/* Product Spec Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[64px] items-start">
          {/* Product Gallery wrapper */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} />
          </div>

          {/* Product Purchase Actions Info */}
          <div className="lg:col-span-5 font-body flex flex-col">
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">
              {product.category}
            </span>
            <div className="flex justify-between items-baseline mb-4">
              <h1 className="font-display text-headline-md text-primary font-semibold">
                {product.name}
              </h1>
              {product.tag && (
                <Badge variant="accent">{product.tag}</Badge>
              )}
            </div>
            <span className="text-[22px] font-semibold text-primary mb-6">
              ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>

            <div className="border-t border-border-light pt-6">
              <p className="text-body-md text-neutral-600 mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Add To Cart actions */}
              <div className="flex flex-col gap-3 mb-8">
                <Button variant="accent" className="w-full">
                  Add to Cart
                </Button>
                <Button variant="outline" className="w-full">
                  Add to Wishlist
                </Button>
              </div>

              {/* Product Specifications list */}
              <div className="border-t border-border-light pt-6">
                <h3 className="font-body text-label-caps text-primary mb-4">
                  Product Specifications
                </h3>
                <ul className="list-disc pl-4 space-y-2 text-sm text-neutral-600">
                  {product.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
