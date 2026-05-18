'use client';

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Users, Store, Package, DollarSign, CheckCircle, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [tab, setTab] = useState<'analytics' | 'users' | 'restaurants' | 'orders'>('analytics');
  const [analytics, setAnalytics] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchAnalytics();
  }, [user]);

  useEffect(() => {
    if (tab === 'users') fetchUsers();
    if (tab === 'restaurants') fetchRestaurants();
    if (tab === 'orders') fetchOrders();
  }, [tab]);

  const fetchAnalytics = async () => {
    try {
      const { data } = await api.get('/admin/analytics');
      setAnalytics(data.analytics);
    } catch (error) {
      console.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    const { data } = await api.get('/admin/users');
    setUsers(data.users);
  };

  const fetchRestaurants = async () => {
    const { data } = await api.get('/admin/restaurants');
    setRestaurants(data.restaurants);
  };

  const fetchOrders = async () => {
    const { data } = await api.get('/admin/orders');
    setOrders(data.orders);
  };

  const approveRestaurant = async (id: number) => {
    try {
      await api.put(`/admin/restaurants/${id}/approve`);
      toast.success('Restaurant approved');
      fetchRestaurants();
    } catch {
      toast.error('Failed to approve');
    }
  };

  const deleteUser = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const tabs = [
    { id: 'analytics', label: 'Analytics' },
    { id: 'users', label: 'Users' },
    { id: 'restaurants', label: 'Restaurants' },
    { id: 'orders', label: 'Orders' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex gap-2 mb-8 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.id ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'analytics' && analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg"><Users className="h-6 w-6 text-blue-400" /></div>
              <div><p className="text-gray-400 text-sm">Total Users</p><p className="text-2xl font-bold">{analytics.totalUsers}</p></div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg"><Store className="h-6 w-6 text-purple-400" /></div>
              <div><p className="text-gray-400 text-sm">Restaurants</p><p className="text-2xl font-bold">{analytics.totalRestaurants}</p></div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg"><Package className="h-6 w-6 text-orange-400" /></div>
              <div><p className="text-gray-400 text-sm">Total Orders</p><p className="text-2xl font-bold">{analytics.totalOrders}</p></div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg"><DollarSign className="h-6 w-6 text-green-400" /></div>
              <div><p className="text-gray-400 text-sm">Revenue</p><p className="text-2xl font-bold">₹{analytics.totalRevenue.toLocaleString()}</p></div>
            </div>
          </motion.div>
        </div>
      )}

      {tab === 'users' && (
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase">Name</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase">Email</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase">Role</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase">Joined</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-700/30">
                  <td className="px-4 py-3 text-sm text-white">{u.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{u.email}</td>
                  <td className="px-4 py-3 text-sm capitalize"><span className="px-2 py-0.5 bg-gray-700 rounded text-xs">{u.role}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {u.role !== 'admin' && (
                      <button onClick={() => deleteUser(u.id)} className="text-red-400 hover:text-red-300"><Trash2 className="h-4 w-4" /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'restaurants' && (
        <div className="space-y-3">
          {restaurants.map((r) => (
            <div key={r.id} className="bg-gray-800/50 rounded-xl border border-gray-700 p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">{r.name}</h3>
                <p className="text-sm text-gray-400">Owner: {r.owner.name} • Orders: {r._count.orders}</p>
              </div>
              <div className="flex items-center gap-2">
                {r.isApproved ? (
                  <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded">Approved</span>
                ) : (
                  <button onClick={() => approveRestaurant(r.id)} className="text-xs bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'orders' && (
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase">ID</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase">User</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase">Restaurant</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase">Amount</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-700/30">
                  <td className="px-4 py-3 text-sm text-white">#{o.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{o.user.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{o.restaurant.name}</td>
                  <td className="px-4 py-3 text-sm text-orange-400 font-medium">₹{o.totalAmount}</td>
                  <td className="px-4 py-3 text-sm capitalize"><span className="px-2 py-0.5 bg-gray-700 rounded text-xs">{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
