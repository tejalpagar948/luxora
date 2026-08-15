import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Container } from '../../components/layout/Container';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { getWishlist, removeFromWishlist } from '../../../services/wishlistService';

export const Profile: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist'>('orders');
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState<boolean>(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message || 'Something went wrong'
      );
    }
  };

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    setWishlistLoading(true);
    try {
      const res = await getWishlist();
      if (res.data.success) {
        setWishlist(res.data.wishlist || res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      const res = await removeFromWishlist(productId);
      if (res.data.success) {
        setWishlist(res.data.wishlist || res.data.data || []);
        toast.success("Product removed from wishlist");
      } else {
        toast.error(res.data.message || "Failed to remove product");
      }
    } catch (err: any) {
      console.error("Error removing product from wishlist:", err);
      toast.error(err.response?.data?.message || "Failed to remove product");
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-background">
        <p className="font-body text-neutral-400">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full min-h-screen py-[64px] bg-background">
        <Container>
          <div className="text-center py-[120px] border border-border-light rounded-lg bg-background-alt max-w-lg mx-auto">
            <span className="text-[48px] mb-4 block">👤</span>
            <h2 className="font-display text-headline-sm text-primary mb-2">
              Unauthorized
            </h2>
            <p className="text-neutral-500 mb-8">Please login to access your profile.</p>
            <a href="/login">
              <Button variant="primary">Go to Login</Button>
            </a>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full bg-background min-h-screen py-[64px] font-body">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Header section */}
          <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-border-light mb-12">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-neutral-100 border border-accent flex-shrink-0 flex items-center justify-center text-3xl text-neutral-500">
              {user.picture ? (
                <img src={user.picture} alt={user.fullName} className="w-full h-full object-cover" />
              ) : (
                <span>{user.fullName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="text-center md:text-left flex-grow">
              <h1 className="font-display text-headline-md text-primary font-semibold mb-1">
                {user.fullName}
              </h1>
              <p className="text-sm text-neutral-400 mb-2">@{user.username}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="text-[10px] uppercase tracking-widest bg-background-alt text-accent font-semibold px-3 py-1 rounded-full border border-border-light">
                  {user.isAdmin ? 'Administrator' : 'Valued Customer'}
                </span>
              </div>
            </div>
            {/* Logout button */}
            <div className="flex-shrink-0 mt-4 md:mt-0">
              <Button
                variant="outline"
                className="border-red-200 hover:bg-red-50 hover:text-red-600 text-red-500 hover:border-red-600 !py-2.5 !px-5 text-xs font-semibold"
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Left section: Personal Info card */}
            <div className="md:col-span-5 bg-background-alt border border-border-light rounded-lg p-6 self-start">
              <h2 className="font-display text-headline-xs text-primary mb-6 font-semibold">
                Personal Information
              </h2>
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 block mb-1">
                    Email Address
                  </span>
                  <span className="text-sm text-primary font-medium">{user.email}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 block mb-1">
                    Mobile Number
                  </span>
                  <span className="text-sm text-primary font-medium">
                    {user.mobile || 'Not provided'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right section: Tabs for Order History and Wishlist */}
            <div className="md:col-span-7">
              <div className="flex border-b border-border-light mb-6">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`pb-4 px-4 font-display text-[18px] font-semibold border-b-2 transition-colors duration-200 cursor-pointer ${activeTab === 'orders'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-neutral-400 hover:text-primary'
                    }`}
                >
                  Order History ({user.orders ? user.orders.length : 0})
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`pb-4 px-4 font-display text-[18px] font-semibold border-b-2 transition-colors duration-200 cursor-pointer ${activeTab === 'wishlist'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-neutral-400 hover:text-primary'
                    }`}
                >
                  My Wishlist ({wishlist.length})
                </button>
              </div>

              {activeTab === 'orders' ? (
                user.orders && user.orders.length > 0 ? (
                  <div className="space-y-4">
                    {user.orders.map((order: any, idx: number) => (
                      <div key={idx} className="border border-border-light rounded-lg p-4 bg-background-alt flex justify-between items-center">
                        <div>
                          <p className="text-sm font-semibold text-primary">Order #{order._id || idx + 1}</p>
                          <p className="text-xs text-neutral-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className="text-sm font-medium text-accent">${order.totalAmount}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center border border-dashed border-border-light rounded-lg bg-background-alt flex flex-col items-center justify-center">
                    <span className="text-2xl mb-2">📦</span>
                    <p className="text-sm text-neutral-500">No orders found.</p>
                  </div>
                )
              ) : (
                wishlistLoading ? (
                  <div className="py-12 text-center">
                    <p className="text-sm text-neutral-400">Loading wishlist...</p>
                  </div>
                ) : wishlist.length > 0 ? (
                  <div className="space-y-4">
                    {wishlist.map((product: any) => (
                      <div key={product._id} className="border border-border-light rounded-lg p-4 bg-background-alt flex items-center gap-4">
                        <div className="w-16 h-16 rounded overflow-hidden bg-neutral-100 flex-shrink-0">
                          <img src={product.image || 'https://via.placeholder.com/150'} alt={product.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <Link to={`/collections/${product._id}`} className="text-sm font-semibold text-primary hover:text-accent truncate block">
                            {product.title}
                          </Link>
                          <p className="text-xs text-neutral-400 capitalize">{product.category}</p>
                          <p className="text-sm font-medium text-accent mt-1">${product.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link to={`/collections/${product._id}`}>
                            <Button variant="outline" className="!py-1.5 !px-1.5 text-[10px] uppercase tracking-wider font-semibold font-body rounded-md">View</Button>
                          </Link>
                          <Button
                            variant="outline"
                            className="!py-1.5 !px-1.5 text-[10px] uppercase tracking-wider font-semibold font-body rounded-md border-red-200 hover:bg-red-50 hover:text-red-600 text-red-500 hover:border-red-600"
                            onClick={() => handleRemoveFromWishlist(product._id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center border border-dashed border-border-light rounded-lg bg-background-alt flex flex-col items-center justify-center">
                    <span className="text-2xl mb-2">❤️</span>
                    <p className="text-sm text-neutral-500">Your wishlist is empty.</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
