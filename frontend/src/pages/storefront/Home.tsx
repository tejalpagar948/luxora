import React, { useState, useEffect } from 'react';
import { HeroSection } from '../../components/home/HeroSection';
import { FeaturedProducts } from '../../components/home/FeaturedProducts';
import { EditorialBlock } from '../../components/home/EditorialBlock';
import { getProducts } from '../../../services/productService';
import type { Product } from '../../components/product/ProductCard';

const MOCK_PRODUCTS: Product[] = [
  {
    _id: '1',
    title: 'The Signature Tote',
    price: 850,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600',
    category: 'Totes',
    tag: 'Classic',
  },
  {
    _id: '2',
    title: 'Heritage Crossbody',
    price: 490,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600',
    category: 'Crossbody',
    tag: 'New',
  },
  {
    _id: '3',
    title: 'Editorial Top Handle',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=600',
    category: 'Handbags',
    tag: 'Limited Edition',
  },
  {
    _id: '4',
    title: 'Sleek Mini Clutch',
    price: 320,
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc15a7a5?auto=format&fit=crop&q=80&w=600',
    category: 'Clutches',
  },
];

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

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
