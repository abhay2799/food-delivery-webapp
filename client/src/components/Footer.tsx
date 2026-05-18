import { UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <UtensilsCrossed className="h-6 w-6 text-orange-500" />
              <span className="text-lg font-bold text-white">FoodieExpress</span>
            </div>
            <p className="text-gray-400 text-sm">
              Delivering happiness to your doorstep. Fresh food from your favorite restaurants.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/restaurants" className="block text-gray-400 hover:text-orange-400 text-sm transition-colors">Restaurants</Link>
              <Link href="/search" className="block text-gray-400 hover:text-orange-400 text-sm transition-colors">Search Food</Link>
              <Link href="/orders" className="block text-gray-400 hover:text-orange-400 text-sm transition-colors">Track Order</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">For Restaurants</h4>
            <div className="space-y-2">
              <Link href="/register" className="block text-gray-400 hover:text-orange-400 text-sm transition-colors">Partner With Us</Link>
              <Link href="/dashboard" className="block text-gray-400 hover:text-orange-400 text-sm transition-colors">Restaurant Dashboard</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <div className="space-y-2 text-gray-400 text-sm">
              <p>support@foodieexpress.com</p>
              <p>1800-123-4567</p>
              <p>Mumbai, India</p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          © 2026 FoodieExpress. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
