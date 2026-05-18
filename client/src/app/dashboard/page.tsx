'use client';

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Package, DollarSign, Star, Store, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
      router.push('/');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const { data } = await api.get('/restaurants/my');
      setRestaurants(data.restaurants);
      if (data.restaurants.length > 0) {
        setSelectedRestaurant(data.restaurants[0].id);
        fetchRestaurantOrders(data.restaurants[0].id);
        fetchAnalytics(data.restaurants[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurantOrders = async (restaurantId: number) => {
    try {
      const { data } = await api.get(`/orders/restaurant/${restaurantId}`);
      setOrders(data.orders);
    } catch (error) {
      console.error('Failed to fetch orders');
    }
  };

  const fetchAnalytics = async (restaurantId: number) => {
    try {
      const { data } = await api.get(`/restaurants/${restaurantId}/analytics`);
      setAnalytics(data.analytics);
    } catch (error) {
      console.error('Failed to fetch analytics');
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success(`Order ${status}`);
      if (selectedRestaurant) fetchRestaurantOrders(selectedRestaurant);
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-xl p-6 animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-1/2 mb-2" />
              <div className="h-6 bg-gray-700 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Restaurant Dashboard</h1>

      {restaurants.length === 0 ? (
        <div className="text-center py-20 bg-gray-800/50 rounded-2xl border border-gray-700">
          <Store className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">No restaurants yet</p>
          <p className="text-gray-500 text-sm">Create your first restaurant to get started</p>
        </div>
      ) : (
        <>
          {/* Restaurant Selector */}
          {restaurants.length > 1 && (
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {restaurants.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setSelectedRestaurant(r.id);
                    fetchRestaurantOrders(r.id);
                    fetchAnalytics(r.id);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedRestaurant === r.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-800 text-gray-400 border border-gray-700'
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          )}

          {/* Analytics Cards */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Package className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Orders</p>
                    <p className="text-2xl font-bold text-white">{analytics.totalOrders}</p>
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Revenue</p>
                    <p className="text-2xl font-bold text-white">₹{analytics.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Star className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Avg Rating</p>
                    <p className="text-2xl font-bold text-white">{analytics.avgRating.toFixed(1)}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Orders List */}
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gray-800/50 rounded-xl border border-gray-700 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">Order #{order.id} — {order.user.name}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {order.items.map((i: any) => `${i.menuItem.name} x${i.quantity}`).join(', ')}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{order.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-orange-400 font-bold">₹{order.totalAmount}</p>
                      <p className="text-xs text-gray-500 capitalize mt-1">{order.status.replace('_', ' ')}</p>
                      {order.status === 'pending' && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                            className="p-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            className="p-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="mt-2 text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded hover:bg-purple-500/30"
                        >
                          Start Preparing
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                          className="mt-2 text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded hover:bg-orange-500/30"
                        >
                          Out for Delivery
                        </button>
                      )}
                      {order.status === 'out_for_delivery' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="mt-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded hover:bg-green-500/30"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
