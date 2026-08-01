import React from 'react';
import { Container } from './Container';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-background py-[48px] md:py-[80px] mt-[64px] md:mt-[120px] border-t border-neutral-800">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div>
            <h3 className="font-display text-[24px] tracking-wider mb-4">LUXORA</h3>
            <p className="font-body text-sm text-neutral-400 max-w-xs leading-relaxed">
              Evoking exclusivity, timelessness, and effortless sophistication. Curated luxury leather bags for the discerning collector.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="font-body text-label-caps text-accent mb-4">Collections</h4>
            <ul className="space-y-2 font-body text-sm text-neutral-400">
              <li><a href="/collections" className="hover:text-background transition-colors duration-200">Signature Tote</a></li>
              <li><a href="/collections" className="hover:text-background transition-colors duration-200">The Heritage Crossbody</a></li>
              <li><a href="/collections" className="hover:text-background transition-colors duration-200">Exclusive Satchel</a></li>
              <li><a href="/collections" className="hover:text-background transition-colors duration-200">New Arrivals</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="font-body text-label-caps text-accent mb-4">Brand</h4>
            <ul className="space-y-2 font-body text-sm text-neutral-400">
              <li><a href="#" className="hover:text-background transition-colors duration-200">Our Story</a></li>
              <li><a href="#" className="hover:text-background transition-colors duration-200">Craftsmanship</a></li>
              <li><a href="#" className="hover:text-background transition-colors duration-200">Sustainabilty</a></li>
              <li><a href="#" className="hover:text-background transition-colors duration-200">Contact Us</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-body text-label-caps text-accent mb-4">Newsletter</h4>
            <p className="font-body text-sm text-neutral-400 mb-4">
              Subscribe to receive exclusive access to collection launches and editorial updates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email address"
                className="bg-neutral-900 border border-neutral-800 text-background px-4 py-2 font-body text-sm focus:outline-none focus:border-accent w-full"
              />
              <button className="bg-accent text-background font-body text-label-caps px-4 py-2 hover:bg-amber-600 transition-colors duration-200">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center font-body text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} LUXORA. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-background">Privacy Policy</a>
            <a href="#" className="hover:text-background">Terms of Service</a>
            <a href="#" className="hover:text-background">Accessibility</a>
          </div>
        </div>
      </Container>
    </footer>
  );
};
