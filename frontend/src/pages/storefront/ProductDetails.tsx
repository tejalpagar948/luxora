import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Container } from '../../components/layout/Container';
import { ProductGallery } from '../../components/product/ProductGallery';
import { Button } from '../../components/ui/Button';
import { getSingleProduct } from '../../../services/productService';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../context/AuthContext';
import { redirectToLogin } from '../../../utils/redirectToLogin';

// const PRODUCTS_MAP: Record<string, {
//   name: string;
//   price: number;
//   category: string;
//   description: string;
//   details: string[];
//   images: string[];
//   tag?: string;
// }> = {
//   '1': {
//     name: 'The Signature Tote',
//     price: 850,
//     category: 'Totes',
//     description: 'A structural, sculptural tote bag engineered for modern business. Features a spacious main compartment, double top handles, and an internal card holder pocket. Designed to sit comfortably under the arm or hold in-hand.',
//     details: [
//       '100% full-grain Italian calf leather',
//       'Hand-painted raw edges',
//       'Bonded suede lining in Soft Beige',
//       'Internal zippered separator compartment',
//       'Dimensions: 14" W x 11.5" H x 6" D',
//       'Made in Italy'
//     ],
//     images: [
//       'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
//       'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800',
//       'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800'
//     ],
//     tag: 'Classic'
//   },
//   '2': {
//     name: 'Heritage Crossbody',
//     price: 490,
//     category: 'Crossbody',
//     description: 'A compact everyday companion crafted from structured pebble leather. Features a secure magnetic front closure and a fully adjustable shoulder strap. Designed to soften and develop a custom patina over time.',
//     details: [
//       'Genuine pebbled calf leather',
//       'Adjustable leather strap (22" drop)',
//       'Polished brass hardware with gold finish',
//       'Dual internal card compartments',
//       'Dimensions: 8.5" W x 6" H x 3" D',
//       'Made in Italy'
//     ],
//     images: [
//       'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800',
//       'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800'
//     ],
//     tag: 'New'
//   }
// };

interface Product {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  details?: string[];
}

export const ProductDetails: React.FC = () => {
  const { product_id } = useParams<{ product_id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Consume shared cart context
  const {
    cart,
    addToCart: contextAddToCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const cartItem = cart.find((item) => item.product._id === product_id);
  const isAddedToCart = !!cartItem;
  const cartQuantity = cartItem ? cartItem.quantity : 0;
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (product_id) {
          const res = await getSingleProduct(product_id);
          setProduct(res.data.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [product_id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      redirectToLogin(navigate, location.pathname);
      return;
    }

    if (product_id) {
      contextAddToCart(product_id);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="font-body text-neutral-400">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="font-body text-neutral-400">Product not found</p>
      </div>
    );
  }

  const productName = product.title || 'Unnamed Product';
  const productImages = product.image ? [product.image] : [];
  const productCategory = product.category || 'Uncategorized';
  const productPrice = product.price || 0;
  const productDescription = product.description || 'No description available.';
  const productDetailsList = product.details || ['Standard specifications apply'];

  return (
    <div className="w-full bg-background min-h-screen py-[64px]">
      <Container>
        {/* Breadcrumb */}
        <div className="mb-8 font-body text-xs text-neutral-400">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/collections" className="hover:text-primary">Collections</Link>
          <span className="mx-2">/</span>
          <span className="text-primary font-semibold">{productName}</span>
        </div>

        {/* Product Spec Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[64px] items-start">
          {/* Product Gallery wrapper */}
          <div className="lg:col-span-7">
            <ProductGallery images={productImages} />
          </div>

          {/* Product Purchase Actions Info */}
          <div className="lg:col-span-5 font-body flex flex-col">
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">
              {productCategory}
            </span>
            <div className="flex justify-between items-baseline mb-4">
              <h1 className="font-display text-headline-md text-primary font-semibold">
                {productName}
              </h1>
              {/* {productTag && (
                <Badge variant="accent">{productTag}</Badge>
              )} */}
            </div>
            <span className="text-[22px] font-semibold text-primary mb-6">
              ${productPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>

            <div className="border-t border-border-light pt-6">
              <p className="text-body-md text-neutral-600 mb-8 leading-relaxed">
                {productDescription}
              </p>

              {/* Add To Cart actions */}
              <div className="flex flex-col gap-3 mb-8">
                {!isAddedToCart ? (
                  <Button
                    variant="accent"
                    className="w-full"
                    onClick={handleAddToCart}
                    disabled={product !== null && product.stock !== undefined && product.stock <= 0}
                  >
                    {product !== null && product.stock !== undefined && product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                ) : (
                  <div className="w-full">
                    {product !== null && product.stock !== undefined && cartQuantity >= product.stock && (
                      <span className="block text-xs text-[#D4AF37] mb-2 text-center">
                        Stock limit reached. Only {product.stock} left in stock.
                      </span>
                    )}
                    <div className="flex items-center justify-between border border-accent rounded-md py-[11px] px-6 text-primary select-none w-full bg-background">
                      <button
                        type="button"
                        onClick={() => product_id && decreaseQuantity(product_id)}
                        className="text-lg font-semibold hover:text-accent transition-colors px-2"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="font-body text-sm font-semibold">{cartQuantity}</span>
                      <button
                        type="button"
                        onClick={() => product_id && increaseQuantity(product_id)}
                        disabled={product !== null && product.stock !== undefined && cartQuantity >= product.stock}
                        className="text-lg font-semibold hover:text-accent transition-colors px-2 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
                <Button variant="outline" className="w-full">
                  Add to Wishlist
                </Button>
              </div>

              {/* Product Specifications list */}
              <div className="border-t border-border-light pt-6">
                <h3 className="font-body text-label-caps text-primary mb-4">
                  Product Specifications
                </h3>
                <ul className="list-disc pl-4 space-y-2 text-sm text-neutral-600">
                  {productDetailsList.map((detail: string, index: number) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
