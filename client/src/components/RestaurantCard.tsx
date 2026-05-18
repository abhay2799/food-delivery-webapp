'use client';

import Link from 'next/link';
import { Star, Clock, Bike } from 'lucide-react';
import { motion } from 'framer-motion';

interface RestaurantCardProps {
  restaurant: {
    id: number;
    name: string;
    description?: string;
    image?: string;
    cuisine: string;
    rating: number;
    deliveryTime: string;
    deliveryFee: number;
    isOpen: boolean;
    _count?: { reviews: number };
  };
  index: number;
}

export default function RestaurantCard({ restaurant, index }: RestaurantCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Link href={`/restaurants/${restaurant.id}`}>
        <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-orange-500/50 transition-all duration-300 shadow-lg hover:shadow-orange-500/10">
          <div className="relative h-48 overflow-hidden">
            <img
              src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'}
              alt={restaurant.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            />
            {!restaurant.isOpen && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-bold text-lg">Currently Closed</span>
              </div>
            )}
            <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              {restaurant.rating.toFixed(1)}
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-bold text-white mb-1">{restaurant.name}</h3>
            <p className="text-gray-400 text-sm mb-3">{restaurant.cuisine}</p>
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {restaurant.deliveryTime}
              </span>
              <span className="flex items-center gap-1">
                <Bike className="h-4 w-4" />
                {restaurant.deliveryFee > 0 ? `₹${restaurant.deliveryFee}` : 'Free'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
