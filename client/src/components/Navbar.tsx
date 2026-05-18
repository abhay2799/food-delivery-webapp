'use client';

import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { logout } from '@/redux/slices/authSlice';
import { ShoppingCart, User, LogOut, UtensilsCrossed, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <UtensilsCrossed className="h-8 w-8 text-orange-500" />
            <span className="text-xl font-bold text-white">FoodieExpress</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/restaurants" className="text-gray-300 hover:text-orange-400 transition-colors font-medium">
              Restaurants
            </Link>
            {user && (
              <Link href="/orders" className="text-gray-300 hover:text-orange-400 transition-colors font-medium">
                My Orders
              </Link>
            )}
            {user?.role === 'owner' && (
              <Link href="/dashboard" className="text-gray-300 hover:text-orange-400 transition-colors font-medium flex items-center gap-1">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link href="/admin" className="text-gray-300 hover:text-orange-400 transition-colors font-medium flex items-center gap-1">
                <LayoutDashboard className="h-4 w-4" />
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative text-gray-300 hover:text-orange-400 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/profile" className="text-gray-300 hover:text-orange-400 transition-colors">
                  <User className="h-6 w-6" />
                </Link>
                <button onClick={handleLogout} className="text-gray-300 hover:text-red-400 transition-colors">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
