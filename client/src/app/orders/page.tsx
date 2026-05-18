'use client';

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';

const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
  pending: { color: 'text-yellow-400 bg-yellow-400/10', icon: Clock, label: 'Pending' },
  confirmed: { color: 'text-blue-400 bg-blue-400/10', icon: Package, label: 'Confirmed' },
  preparing: { color: 'text-purple-400 bg-purple-400/10', icon: Package, label: 'Preparing' },
  out_for_delivery: { color: 'text-orange-400 bg-orange-400/10', icon: Truck, label: 'Out for Delivery' },
  delivered: { color: 'text-green-400 bg-green-400/10', icon: CheckCircle, label: 'Delivered' },
  cancelled: { color: 'text-red-400 bg-red-400/10', icon: XCircle, label: 'Cancelled' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/user');
      setOrders(data.orders);
    } catch (error) {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-xl p-6 animate-pulse">
              <div className="h-5 bg-gray-700 rounded w-1/4 mb-3" />
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-700 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No orders yet</p>
          <p className="text-gray-500 text-sm mt-1">Place your first order to see it here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-800/50 rounded-xl border border-gray-700 p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{order.restaurant.name}</h3>
                    <p className="text-gray-500 text-xs">
                      Order #{order.id} • {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {order.items.map((item: any) => (
                    <span key={item.id} className="text-sm text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
                      {item.menuItem.name} x{item.quantity}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                  <span className="text-gray-400 text-sm">{order.address}</span>
                  <span className="text-orange-400 font-bold">₹{order.totalAmount}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
