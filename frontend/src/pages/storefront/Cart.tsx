import React from 'react';
import { Container } from '../../components/layout/Container';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';

export const Cart: React.FC = () => {
  // Empty cart mock state
  const cartItems: any[] = [];

  return (
    <div className="w-full bg-background min-h-screen py-[64px] font-body">
      <Container>
        <h1 className="font-display text-headline-md text-primary font-semibold mb-8">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="py-[120px] text-center border border-border-light rounded-lg bg-background-alt flex flex-col items-center justify-center">
            <span className="text-[48px] mb-4">👜</span>
            <h2 className="font-display text-headline-sm text-primary mb-2">
              Your bag is empty
            </h2>
            <p className="text-neutral-500 max-w-sm mb-8">
              Explore our curation of bags and find pieces built for effortless sophistication.
            </p>
            <Link to="/collections">
              <Button variant="primary">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              {/* Cart items loop would go here */}
            </div>
            <div className="lg:col-span-4 bg-background-alt p-6 border border-border-light rounded-lg">
              {/* Cart checkout details */}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};
