'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, Star, ArrowRight, Utensils, Truck, Shield } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/restaurants?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const cuisines = [
    { name: 'North Indian', icon: '🍛', color: 'from-orange-500 to-red-500' },
    { name: 'Chinese', icon: '🥡', color: 'from-red-500 to-pink-500' },
    { name: 'Italian', icon: '🍕', color: 'from-green-500 to-emerald-500' },
    { name: 'Biryani', icon: '🍚', color: 'from-yellow-500 to-orange-500' },
    { name: 'American', icon: '🍔', color: 'from-blue-500 to-purple-500' },
    { name: 'South Indian', icon: '🥘', color: 'from-amber-500 to-yellow-500' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-gray-950 to-gray-950" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              Delicious Food,{' '}
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Delivered Fast
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-10">
              Order from thousands of restaurants near you. Fresh food delivered to your doorstep in minutes.
            </p>

            <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
              <div className="flex items-center bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl shadow-orange-500/5 focus-within:border-orange-500 transition-colors">
                <Search className="h-5 w-5 text-gray-400 ml-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for restaurants or cuisines..."
                  className="flex-1 bg-transparent py-4 px-3 text-white placeholder-gray-500 outline-none"
                />
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 font-medium transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-400">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-orange-400" /> 500+ Cities</span>
              <span className="flex items-center gap-1"><Utensils className="h-4 w-4 text-orange-400" /> 10K+ Restaurants</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-orange-400" /> 30min Delivery</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cuisines Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            What are you craving?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {cuisines.map((cuisine, i) => (
              <motion.div
                key={cuisine.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/restaurants?cuisine=${encodeURIComponent(cuisine.name)}`}
                  className="flex flex-col items-center p-6 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-orange-500/50 transition-all hover:scale-105"
                >
                  <span className="text-4xl mb-3">{cuisine.icon}</span>
                  <span className="text-sm font-medium text-gray-300">{cuisine.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Why Choose FoodieExpress?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: 'Fast Delivery', desc: 'Get your food delivered in 30 minutes or less with our express delivery.' },
              { icon: Shield, title: 'Safe & Hygienic', desc: 'All partner restaurants follow strict safety and hygiene protocols.' },
              { icon: Star, title: 'Best Restaurants', desc: 'Curated selection of top-rated restaurants in your city.' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="text-center p-8 bg-gray-800/50 rounded-2xl border border-gray-700"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-500/10 rounded-xl mb-4">
                  <feature.icon className="h-7 w-7 text-orange-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-3xl p-12 border border-orange-500/20"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to order?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Browse through hundreds of restaurants and find your perfect meal. Fast delivery guaranteed.
          </p>
          <Link
            href="/restaurants"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-medium transition-colors"
          >
            Explore Restaurants <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
