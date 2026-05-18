'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchRestaurantById } from '@/redux/slices/restaurantSlice';
import MenuItemCard from '@/components/MenuItemCard';
import { MenuItemSkeleton } from '@/components/Skeleton';
import { Star, Clock, Bike, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { currentRestaurant, loading } = useAppSelector((state) => state.restaurants);
  const { items } = useAppSelector((state) => state.cart);

  useEffect(() => {
    if (id) dispatch(fetchRestaurantById(Number(id)));
  }, [dispatch, id]);

  const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (loading || !currentRestaurant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="h-64 bg-gray-800 rounded-2xl animate-pulse mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <MenuItemSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const menuByCategory = currentRestaurant.menuItems.reduce((acc: any, item: any) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Restaurant Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative rounded-2xl overflow-hidden mb-8"
      >
        <img
          src={currentRestaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'}
          alt={currentRestaurant.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-3xl font-bold text-white mb-2">{currentRestaurant.name}</h1>
          <p className="text-gray-300 text-sm mb-3">{currentRestaurant.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-lg">
              <Star className="h-4 w-4 fill-current" /> {currentRestaurant.rating.toFixed(1)}
              <span className="text-gray-400 ml-1">({currentRestaurant._count.reviews} reviews)</span>
            </span>
            <span className="flex items-center gap-1 text-gray-300">
              <Clock className="h-4 w-4" /> {currentRestaurant.deliveryTime}
            </span>
            <span className="flex items-center gap-1 text-gray-300">
              <Bike className="h-4 w-4" /> {currentRestaurant.deliveryFee > 0 ? `₹${currentRestaurant.deliveryFee} delivery` : 'Free delivery'}
            </span>
            <span className="flex items-center gap-1 text-gray-300">
              <MapPin className="h-4 w-4" /> {currentRestaurant.address}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Menu */}
      <div className="space-y-8">
        {Object.entries(menuByCategory).map(([category, items]: [string, any]) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-bold mb-4 text-white">{category}</h2>
            <div className="space-y-3">
              {items.map((item: any) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  restaurantId={currentRestaurant.id}
                  restaurantName={currentRestaurant.name}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cart Float */}
      {cartCount > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <Link
            href="/cart"
            className="flex items-center gap-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl shadow-2xl shadow-orange-500/30 transition-colors"
          >
            <span className="font-medium">{cartCount} item{cartCount > 1 ? 's' : ''}</span>
            <span className="w-px h-5 bg-orange-400" />
            <span className="font-bold">₹{cartTotal} — View Cart</span>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
