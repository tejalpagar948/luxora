import React from 'react';
import { Container } from '../../components/layout/Container';
import { Button } from '../../components/ui/Button';
import { ProductGrid } from '../../components/product/ProductGrid';
import type { Product } from '../../components/product/ProductCard';

const MOCK_PRODUCTS: Product[] = [
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
];

export const Home: React.FC = () => {
  return (
    <div className="w-full bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative py-[64px] md:py-[120px] min-h-[75vh] flex items-center bg-[#F5F5F0] overflow-hidden">
        {/* Decorative background image with soft beige overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/luxury_bag_hero_bg.png"
            alt="Luxora Hero Background"
            className="w-full h-full object-cover"
          />
          {/* 80% opacity soft beige overlay for a premium blend and high readability */}
          <div className="absolute inset-0 bg-[#F5F5F0]/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5F5F0]/90 via-[#F5F5F0]/40 to-transparent"></div>
        </div>

        <Container className="relative z-10 w-full flex flex-col items-start max-w-[1440px]">
          <span className="font-body text-label-caps text-accent mb-4 uppercase tracking-[0.15em] block">
            EXCLUSIVITY, TIMELESSNESS, SOPHISTICATION
          </span>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-[#121212] mb-6 max-w-2xl font-semibold leading-[48px] md:leading-[72px] tracking-[-0.01em] md:tracking-[-0.02em]">
            Craftsmanship Over Clutter
          </h1>
          <p className="font-body text-body-lg text-[#121212]/80 mb-8 max-w-xl leading-[28px] tracking-[0.01em]">
            Discover our curated collection of luxury leather bags. Designed for the high-discerning audience that values slow fashion and architectural elegance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button variant="accent" className="!text-[#121212] font-semibold tracking-[0.05em] hover:bg-[#c29e2f] border-accent w-full sm:w-auto">
              Shop Collection
            </Button>
            <Button variant="outline" className="hover:bg-[#121212] hover:text-[#FFFFFF] w-full sm:w-auto">
              Our Story
            </Button>
          </div>
        </Container>
      </section>

      {/* Featured Products */}
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
            <a href="/collections" className="font-body text-button text-primary hover:text-accent border-b border-primary hover:border-accent transition-colors duration-200 mt-4 md:mt-0 pb-1">
              View All Products
            </a>
          </div>

          <ProductGrid products={MOCK_PRODUCTS} columns={4} />
        </Container>
      </section>

      {/* Editorial Block */}
      <section className="bg-background-alt py-[64px] md:py-[120px] border-y border-border-light">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-[80px] items-center">
            <div className="aspect-[4/5] rounded-lg overflow-hidden bg-secondary">
              <img
                src="https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800"
                alt="Craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col items-start font-body">
              <span className="text-label-caps text-accent tracking-[0.2em] mb-4">
                THE CRAFT
              </span>
              <h2 className="font-display text-headline-md text-primary mb-6 font-bold leading-tight">
                Architectural Integrity & Italian Leather
              </h2>
              <p className="text-body-md text-neutral-600 mb-6 leading-relaxed">
                Each Luxora piece is built from hand-selected full-grain Italian leather, crafted by master artisans who inherit generations of leatherworking legacy. We avoid digital short-cuts, choosing classical stitching that ensures permanence.
              </p>
              <p className="text-body-md text-neutral-600 mb-8 leading-relaxed">
                By maintaining a direct relationship with our workshop, we offer couture-level design without typical luxury markup inflation.
              </p>
              <Button variant="outline">Explore Craftsmanship</Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};
