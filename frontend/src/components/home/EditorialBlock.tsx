import React from 'react';
import { Container } from '../layout/Container';
import { Button } from '../ui/Button';

export const EditorialBlock: React.FC = () => {
  return (
    <section id="craft" className="bg-background-alt py-[64px] md:py-[120px] border-y border-border-light">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-[80px] items-center">
          <div className="aspect-[4/5] rounded-lg overflow-hidden bg-secondary">
            <img
              src="https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800"
              alt="Craftsmanship"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
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
  );
};
