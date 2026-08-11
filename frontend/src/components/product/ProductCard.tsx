import React from 'react';
import { Link } from 'react-router-dom';

export interface Product {
  _id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  tag?: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group flex flex-col bg-background rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Product Image Wrapper */}
      <Link to={`/collections/${product._id}`} className="relative block aspect-[4/4] overflow-hidden bg-background-alt rounded-lg">
        {product.tag && (
          <span className="absolute top-4 left-4 z-10 bg-accent text-background font-body text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md">
            {product.tag}
          </span>
        )}

        <img
          src={product.image || 'https://via.placeholder.com/400x500'}
          alt={product.title}
          className="object-cover w-full h-full transform transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />

        {/* Dim overlay, fades in with the button so text has contrast */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />

        {/* Quick Add overlay - slides up instead of just fading */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
          <button className="bg-background text-primary font-body text-button px-6 py-2.5 rounded-md hover:bg-primary hover:text-background transition-colors duration-300 uppercase shadow-md">
            Quick Shop
          </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="m-4 flex flex-col font-body">
        <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold mb-1">
          {product.category}
        </span>
        <Link to={`/collections/${product._id}`} className="font-display text-[18px] text-primary group-hover:text-accent transition-colors duration-200 truncate">
          {product.title}
        </Link>
        <span className="text-[15px] font-semibold text-primary mt-1">
          ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
};