import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../layout/Container';
import { ProductGrid } from '../product/ProductGrid';
import type { Product } from '../product/ProductCard';

interface FeaturedProductsProps {
  products: Product[];
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  return (
    <section className="py-[64px] md:py-[120px]">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-[48px]">
          <div>
            <span className="font-body text-label-caps text-accent tracking-widest block mb-2">
              CURATED PICKS
            </span>
            <h2 className="font-display text-headline-md text-primary font-semibold">
              The Signature Selection
            </h2>
          </div>
          <Link to="/collections" className="font-body text-button text-primary hover:text-accent border-b border-primary hover:border-accent transition-colors duration-200 mt-4 md:mt-0 pb-1">
            View All Products
          </Link>
        </div>

        <ProductGrid products={products} columns={4} />
      </Container>
    </section>
  );
};
