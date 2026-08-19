import React, { useState, useEffect } from 'react';
import { HeroSection } from '../../components/home/HeroSection';
import { FeaturedProducts } from '../../components/home/FeaturedProducts';
import { EditorialBlock } from '../../components/home/EditorialBlock';
import { getProducts } from '../../../services/productService';
import type { Product } from '../../components/product/ProductCard';

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (window.location.hash === '#craft') {
      const timer = setTimeout(() => {
        const element = document.getElementById('craft');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await getProducts();
        if (res.data?.success) {
          const allProducts = res.data.data || [];
          if (allProducts.length > 0) {
            // Sort by price descending and take top 4
            const sorted = [...allProducts]
              .slice(allProducts.length - 4, allProducts.length);
            setProducts(sorted);
          }
        }
      } catch (err) {
        console.error("Error fetching featured products:", err);
      }
    };
    fetchFeaturedProducts();
  }, []);

  return (
    <div className="w-full bg-background min-h-screen">
      <HeroSection />
      <FeaturedProducts products={products} />
      <EditorialBlock />
    </div>
  );
};
