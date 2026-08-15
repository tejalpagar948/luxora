import React, { useEffect, useState } from 'react';
import { Container } from '../../components/layout/Container';
import { ProductGrid } from '../../components/product/ProductGrid';
import { Chip } from '../../components/ui/Chip';
import { getProducts } from '../../../services/productService';

// const ALL_PRODUCTS: Product[] = [
//   {
//     id: '1',
//     name: 'The Signature Tote',
//     price: 850,
//     imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600',
//     category: 'Totes',
//     tag: 'Classic',
//   },
//   {
//     id: '2',
//     name: 'Heritage Crossbody',
//     price: 490,
//     imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600',
//     category: 'Crossbody',
//     tag: 'New',
//   },
//   {
//     id: '3',
//     name: 'Editorial Top Handle',
//     price: 1200,
//     imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=600',
//     category: 'Handbags',
//     tag: 'Limited Edition',
//   },
//   {
//     id: '4',
//     name: 'Sleek Mini Clutch',
//     price: 320,
//     imageUrl: 'https://images.unsplash.com/photo-1566150905458-1bf1fc15a7a5?auto=format&fit=crop&q=80&w=600',
//     category: 'Clutches',
//   },
//   {
//     id: '5',
//     name: 'Monolith Travel Duffle',
//     price: 1450,
//     imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600',
//     category: 'Travel',
//     tag: 'Exclusive',
//   },
//   {
//     id: '6',
//     name: 'Slim Card Holder',
//     price: 140,
//     imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=600',
//     category: 'Accessories',
//   },
// ];

const CATEGORIES = [
  { label: "All", value: "All" },
  { label: "Totes", value: "Tote Bag" },
  { label: "Crossbody", value: "Crossbody Bag" },
  { label: "Handbags", value: "Handbag" },
  { label: "Clutches", value: "Clutch" },
  { label: "Travel", value: "Travel" },
  { label: "Accessories", value: "Accessories" },
  { label: "Pouches", value: "Pouch" },
];
export const Collections: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();

        if (res.data) {
          setProducts(res.data.data);
        }

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="font-body text-neutral-400">
          Loading products...
        </p>
      </div>
    );
  }

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  console.log(products, "products")
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
        <div className="flex overflow-x-auto md:overflow-x-visible md:flex-wrap md:justify-center gap-3 mb-[48px] md:mb-[64px] border-b border-border-light pb-6 md:pb-8 no-scrollbar scroll-smooth snap-x snap-mandatory px-4 md:px-0">
          {CATEGORIES.map(category => (
            <div key={category.value} className="snap-start shrink-0">
              <Chip
                label={category.label}
                active={selectedCategory === category.value}
                onClick={() => setSelectedCategory(category.value)}
              />
            </div>
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
