'use client';

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user } = useAppSelector((state) => state.auth);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/auth/profile');
      setProfile(data.user);
    } catch (error) {
      console.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-2xl p-8 animate-pulse">
          <div className="h-20 w-20 bg-gray-700 rounded-full mx-auto mb-4" />
          <div className="h-6 bg-gray-700 rounded w-1/3 mx-auto mb-2" />
          <div className="h-4 bg-gray-700 rounded w-1/4 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 rounded-2xl border border-gray-700 p-8"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">
              {profile.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <span className="inline-block mt-2 px-3 py-1 bg-orange-500/10 text-orange-400 rounded-full text-sm font-medium capitalize">
            {profile.role}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-gray-900/50 rounded-xl">
            <Mail className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-white">{profile.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-900/50 rounded-xl">
            <Phone className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="text-white">{profile.phone || 'Not set'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-900/50 rounded-xl">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Member Since</p>
              <p className="text-white">{new Date(profile.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
