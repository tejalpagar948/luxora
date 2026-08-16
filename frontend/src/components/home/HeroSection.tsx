import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../layout/Container';
import { Button } from '../ui/Button';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative py-[64px] md:py-[120px] min-h-[100vh] flex items-center overflow-hidden">
      {/* Decorative background image with soft beige overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/Hero-banner.png"
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
          <Link to="/collections" className="w-full sm:w-auto">
            <Button variant="accent" className="!text-[#121212] font-semibold tracking-[0.05em] hover:bg-[#c29e2f] border-accent w-full">
              Shop Collection
            </Button>
          </Link>
          <Button variant="outline" className="hover:bg-[#121212] hover:text-[#FFFFFF] w-full sm:w-auto">
            Our Story
          </Button>
        </div>
      </Container>
    </section>
  );
};
