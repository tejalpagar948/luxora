import React, { useState } from 'react';
import { Container } from '../../components/layout/Container';
import { ProductGrid } from '../../components/product/ProductGrid';
import { Chip } from '../../components/ui/Chip';
import type { Product } from '../../components/product/ProductCard';

const ALL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'The Signature Tote',
    price: 850,
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600',
    category: 'Totes',
    tag: 'Classic',
  },
  {
    id: '2',
    name: 'Heritage Crossbody',
    price: 490,
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600',
    category: 'Crossbody',
    tag: 'New',
  },
  {
    id: '3',
    name: 'Editorial Top Handle',
    price: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=600',
    category: 'Handbags',
    tag: 'Limited Edition',
  },
  {
    id: '4',
    name: 'Sleek Mini Clutch',
    price: 320,
    imageUrl: 'https://images.unsplash.com/photo-1566150905458-1bf1fc15a7a5?auto=format&fit=crop&q=80&w=600',
    category: 'Clutches',
  },
  {
    id: '5',
    name: 'Monolith Travel Duffle',
    price: 1450,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600',
    category: 'Travel',
    tag: 'Exclusive',
  },
  {
    id: '6',
    name: 'Slim Card Holder',
    price: 140,
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=600',
    category: 'Accessories',
  },
];

const CATEGORIES = ['All', 'Totes', 'Crossbody', 'Handbags', 'Clutches', 'Travel', 'Accessories'];

export const Collections: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = selectedCategory === 'All'
    ? ALL_PRODUCTS
    : ALL_PRODUCTS.filter(p => p.category === selectedCategory);

  return (
    <div className="w-full bg-background min-h-screen py-12">
      <Container>
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="font-body text-label-caps text-accent tracking-[0.2em] block mb-3">
            LUXORA PIECES
          </span>
          <h1 className="font-display text-display-lg-mobile md:text-headline-md text-primary font-semibold mb-4">
            The Autumn Collection
          </h1>
          <p className="font-body text-body-md text-neutral-500 max-w-xl mx-auto leading-relaxed">
            Meticulously proportioned designs highlighting raw texture and minimal silhouettes.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-[64px] border-b border-border-light pb-8">
          {CATEGORIES.map(category => (
            <Chip
              key={category}
              label={category}
              active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            />
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} columns={3} />
        ) : (
          <div className="py-[120px] text-center font-body text-neutral-400">
            No products found in this category.
          </div>
        )}
      </Container>
    </div>
  );
};
