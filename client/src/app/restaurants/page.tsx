'use client';
import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchRestaurants } from '@/redux/slices/restaurantSlice';
import RestaurantCard from '@/components/RestaurantCard';
import { RestaurantCardSkeleton } from '@/components/Skeleton';
import { useSearchParams } from 'next/navigation';
import { Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

function RestaurantsContent() {
  const dispatch = useAppDispatch();
  const { restaurants, loading } = useAppSelector((state) => state.restaurants);
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCuisine, setSelectedCuisine] = useState(searchParams.get('cuisine') || '');

  const cuisines = ['All', 'North Indian', 'Chinese', 'Italian', 'Biryani', 'American', 'South Indian'];

  useEffect(() => {
    const params: any = {};
    if (searchQuery) params.search = searchQuery;
    if (selectedCuisine && selectedCuisine !== 'All') params.cuisine = selectedCuisine;
    dispatch(fetchRestaurants(params));
  }, [dispatch, searchQuery, selectedCuisine]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-6">Restaurants</h1>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search restaurants or cuisines..."
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </form>

        <div className="flex flex-wrap gap-2">
          {cuisines.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => setSelectedCuisine(cuisine === 'All' ? '' : cuisine)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                (cuisine === 'All' && !selectedCuisine) || selectedCuisine === cuisine
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <RestaurantCardSkeleton key={i} />
          ))}
        </div>
      ) : restaurants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant, index) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No restaurants found</p>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}

export default function RestaurantsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-white text-xl">Loading restaurants...</div>}>
      <RestaurantsContent />
    </Suspense>
  );
}
