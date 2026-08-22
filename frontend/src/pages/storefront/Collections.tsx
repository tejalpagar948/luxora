import React, { useEffect, useMemo, useState } from 'react';
import { Container } from '../../components/layout/Container';
import { ProductGrid } from '../../components/product/ProductGrid';
import { Chip } from '../../components/ui/Chip';
import { getProducts } from '../../../services/productService';
import type { Product } from '../../components/product/ProductCard';

const CATEGORIES = [
  { label: 'All', value: 'All' },
  { label: 'Totes', value: 'Tote Bag' },
  { label: 'Crossbody', value: 'Crossbody Bag' },
  { label: 'Handbags', value: 'Handbag' },
  { label: 'Clutches', value: 'Clutch' },
  { label: 'Travel', value: 'Travel'    },
  { label: 'Accessories', value: 'Accessories' },
  { label: 'Pouches', value: 'Pouch' },
];

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
];

const PRICE_OPTIONS = [
  { label: 'All Prices', value: 'All' },
  { label: 'Under $100', value: 'under-100' },
  { label: '$100 - $200', value: '100-200' },
  { label: '$200 - $300', value: '200-300' },
  { label: '$300+', value: '300-plus' },
];

const AVAILABILITY_OPTIONS = [
  { label: 'All', value: 'All' },
  { label: 'In Stock', value: 'in-stock' },
  { label: 'Out of Stock', value: 'out-of-stock' },
];

// Category label -> set of raw category strings (lowercase) it should match
const CATEGORY_MATCH_MAP: Record<string, string[]> = {
  'tote bag': ['tote bag', 'tote'],
  'crossbody bag': ['crossbody bag', 'crossbody'],
  handbag: ['handbag', 'handbags'],
  clutch: ['clutch', 'clutches'],
  travel: ['travel', 'duffel bag', 'duffel'],
  accessories: ['accessories', 'wallet', 'passport holder', 'key pouch'],
  pouch: ['pouch', 'cosmetic pouch', 'key pouch'],
};

const matchesCategory = (productCategory: string, selectedCategory: string) => {
  const pCat = (productCategory || '').toLowerCase();
  const sCat = (selectedCategory || '').toLowerCase();
  const allowed = CATEGORY_MATCH_MAP[sCat];
  return allowed ? allowed.includes(pCat) : pCat === sCat;
};

const matchesPrice = (price: number, priceFilter: string) => {
  switch (priceFilter) {
    case 'under-100':
      return price < 100;
    case '100-200':
      return price >= 100 && price <= 200;
    case '200-300':
      return price >= 200 && price <= 300;
    case '300-plus':
      return price > 300;
    default:
      return true;
  }
};

const matchesAvailability = (stock: number | undefined, availabilityFilter: string) => {
  const inStock = stock !== undefined && stock > 0;
  if (availabilityFilter === 'in-stock') return inStock;
  if (availabilityFilter === 'out-of-stock') return !inStock;
  return true;
};

// Shared radio-style option button used by both the Filter and Sort dropdowns
interface RadioOptionProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}
const RadioOption: React.FC<RadioOptionProps> = ({ label, selected, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2.5 w-full text-left py-1 text-xs transition-colors cursor-pointer select-none text-neutral-500 hover:text-primary outline-none focus:outline-none font-body"
  >
    <div
      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${selected ? 'border-accent' : 'border-neutral-300'
        }`}
    >
      {selected && <div className="w-1.5 h-1.5 rounded-full bg-accent" />}
    </div>
    <span className={selected ? 'text-primary font-semibold' : 'text-neutral-500 hover:text-primary font-normal'}>
      {label}
    </span>
  </button>
);

const DropdownChevron: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    className={`w-2.5 h-2.5 ml-1 transition-transform duration-200 shrink-0 text-neutral-400 ${open ? 'rotate-180 text-accent' : ''
      }`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export const Collections: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const [priceFilter, setPriceFilter] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        if (res.data) {
          setProducts(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const closeDropdowns = () => {
    setIsFilterOpen(false);
    setIsSortOpen(false);
  };

  const clearFilters = () => {
    setPriceFilter('All');
    setAvailabilityFilter('All');
    closeDropdowns();
  };

  const isFilterActive = priceFilter !== 'All' || availabilityFilter !== 'All';
  const activeFiltersCount = [priceFilter, availabilityFilter].filter((f) => f !== 'All').length;

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      if (selectedCategory !== 'All' && !matchesCategory(product.category, selectedCategory)) return false;
      if (!matchesPrice(product.price, priceFilter)) return false;
      if (!matchesAvailability(product.stock, availabilityFilter)) return false;
      return true;
    });

    switch (sortBy) {
      case 'price-asc':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...filtered].sort((a, b) => b.price - a.price);
      case 'newest':
        return [...filtered].sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
      default:
        return filtered;
    }
  }, [products, selectedCategory, priceFilter, availabilityFilter, sortBy]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="font-body text-neutral-400">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-background min-h-screen py-12 relative">
      {(isFilterOpen || isSortOpen) && (
        <div className="fixed inset-0 z-10 cursor-default" onClick={closeDropdowns} />
      )}

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

        {/* Category Filter Chips */}
        <div className="flex overflow-x-auto md:overflow-x-visible md:flex-wrap md:justify-center gap-3 mb-[24px] border-b border-border-light pb-6 no-scrollbar scroll-smooth snap-x snap-mandatory px-4 md:px-0">
          {CATEGORIES.map((category) => (
            <div key={category.value} className="snap-start shrink-0">
              <Chip
                label={category.label}
                active={selectedCategory === category.value}
                onClick={() => {
                  setSelectedCategory(category.value);
                  closeDropdowns();
                }}
              />
            </div>
          ))}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-row justify-between items-center mb-[36px] pb-4 border-b border-border-light/60 font-body relative z-20 select-none">
          <div className="flex items-center gap-6 md:gap-8">
            {/* Filter Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => {
                  setIsFilterOpen((prev) => !prev);
                  setIsSortOpen(false);
                }}
                aria-expanded={isFilterOpen}
                className="flex items-center gap-2 border border-neutral-200 bg-background px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] font-bold text-primary cursor-pointer hover:border-primary transition-all duration-150 select-none outline-none focus:outline-none rounded"
              >
                <span>Filter{activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}</span>
                <DropdownChevron open={isFilterOpen} />
              </button>

              {isFilterOpen && (
                <div className="absolute top-full left-0 mt-3 w-56 bg-background border border-border-light shadow-[0_8px_30px_rgba(0,0,0,0.04)] py-5 px-5 z-30 space-y-4 font-body rounded-md">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.15em] text-neutral-400 uppercase mb-2.5 font-display">
                      Price
                    </div>
                    <div className="space-y-1.5">
                      {PRICE_OPTIONS.map((opt) => (
                        <RadioOption
                          key={opt.value}
                          label={opt.label}
                          selected={priceFilter === opt.value}
                          onClick={() => setPriceFilter(opt.value)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-border-light/60 my-4" />

                  <div>
                    <div className="text-[10px] font-bold tracking-[0.15em] text-neutral-400 uppercase mb-2.5 font-display">
                      Availability
                    </div>
                    <div className="space-y-1.5">
                      {AVAILABILITY_OPTIONS.map((opt) => (
                        <RadioOption
                          key={opt.value}
                          label={opt.label}
                          selected={availabilityFilter === opt.value}
                          onClick={() => setAvailabilityFilter(opt.value)}
                        />
                      ))}
                    </div>
                  </div>

                  {isFilterActive && (
                    <>
                      <div className="border-t border-border-light/60 my-4" />
                      <button
                        onClick={clearFilters}
                        className="text-[10px] font-bold text-accent hover:text-primary transition-colors cursor-pointer pt-1 outline-none focus:outline-none uppercase tracking-wider font-body block text-left"
                      >
                        Clear filters
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => {
                  setIsSortOpen((prev) => !prev);
                  setIsFilterOpen(false);
                }}
                aria-expanded={isSortOpen}
                className="flex items-center gap-1.5 text-[11px] uppercase font-bold tracking-[0.2em] text-primary hover:text-accent cursor-pointer transition-colors duration-150 py-2 select-none outline-none focus:outline-none"
              >
                <span>Sort By: {(SORT_OPTIONS.find((o) => o.value === sortBy)?.label || 'Featured').toUpperCase()}</span>
                <DropdownChevron open={isSortOpen} />
              </button>

              {isSortOpen && (
                <div className="absolute top-full left-0 mt-3 w-52 bg-background border border-border-light shadow-[0_8px_30px_rgba(0,0,0,0.04)] py-5 px-5 z-30 space-y-2.5 font-body rounded-md">
                  <div className="text-[10px] font-bold tracking-[0.15em] text-neutral-400 uppercase mb-2.5 font-display">
                    Sort By
                  </div>
                  {SORT_OPTIONS.map((opt) => (
                    <RadioOption
                      key={opt.value}
                      label={opt.label}
                      selected={sortBy === opt.value}
                      onClick={() => {
                        setSortBy(opt.value);
                        setIsSortOpen(false);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {isFilterActive && (
            <button
              onClick={clearFilters}
              className="text-[10px] font-bold text-accent hover:text-primary transition-colors cursor-pointer shrink-0 py-2 outline-none focus:outline-none font-body"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} columns={3} />
        ) : (
          <div className="py-[120px] text-center font-body text-neutral-400">
            No products match the selected criteria.
          </div>
        )}
      </Container>
    </div>
  );
};