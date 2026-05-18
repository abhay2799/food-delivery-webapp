'use client';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { removeFromCart, updateQuantity, clearCart } from '@/redux/slices/cartSlice';
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function CartPage() {
  const { items, restaurantName } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'cod' | 'online'>('cod');

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please login to place an order');
      router.push('/login');
      return;
    }
    if (!address.trim()) {
      toast.error('Please enter delivery address');
      return;
    }

    setLoading(true);
    try {
      const orderItems = items.map((item) => ({
        menuItemId: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      if (paymentMode === 'online') {
        const { data } = await api.post('/payments/initiate', {
          restaurantId: items[0].restaurantId,
          items: orderItems,
          address,
          method: 'card',
          amount: total,
        });

        router.push(
          `/payment/${data.paymentId}?restaurantId=${items[0].restaurantId}&address=${encodeURIComponent(address)}&items=${encodeURIComponent(JSON.stringify(orderItems))}`
        );
      } else {
        const orderData = {
          restaurantId: items[0].restaurantId,
          items: orderItems,
          address,
          paymentMode: 'cod',
        };

        await api.post('/orders', orderData);
        dispatch(clearCart());
        toast.success('Order placed successfully!');
        router.push('/orders');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <ShoppingBag className="h-20 w-20 text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-300 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some delicious food to get started</p>
        <Link
          href="/restaurants"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Your Cart</h1>
            {restaurantName && (
              <p className="text-gray-400 text-sm mt-1">From {restaurantName}</p>
            )}
          </div>
          <button
            onClick={() => dispatch(clearCart())}
            className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 transition-colors"
          >
            <Trash2 className="h-4 w-4" /> Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  exit={{ opacity: 0, x: -100 }}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700"
                >
                  <div className="flex items-center gap-4">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    )}
                    <div>
                      <h3 className="font-medium text-white">{item.name}</h3>
                      <p className="text-orange-400 font-bold">₹{item.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-700 rounded-lg px-2 py-1">
                      <button
                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                        className="text-gray-300 hover:text-white"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-white font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                        className="text-gray-300 hover:text-white"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-white font-bold w-16 text-right">₹{item.price * item.quantity}</p>
                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Order Summary</h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                {deliveryFee === 0 && (
                  <p className="text-green-400 text-xs">Free delivery on orders above ₹500!</p>
                )}
                <div className="border-t border-gray-700 pt-3 flex justify-between text-white font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Delivery Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your full delivery address..."
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors resize-none h-20 text-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Payment Method</label>
                <div className="space-y-2">
                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${paymentMode === 'cod' ? 'border-orange-500 bg-orange-500/10' : 'border-gray-700 bg-gray-900 hover:border-gray-600'}`}>
                    <input
                      type="radio"
                      name="paymentMode"
                      value="cod"
                      checked={paymentMode === 'cod'}
                      onChange={() => setPaymentMode('cod')}
                      className="accent-orange-500"
                    />
                    <div>
                      <p className="text-white text-sm font-medium">Cash on Delivery</p>
                      <p className="text-gray-500 text-xs">Pay when your order arrives</p>
                    </div>
                  </label>
                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${paymentMode === 'online' ? 'border-orange-500 bg-orange-500/10' : 'border-gray-700 bg-gray-900 hover:border-gray-600'}`}>
                    <input
                      type="radio"
                      name="paymentMode"
                      value="online"
                      checked={paymentMode === 'online'}
                      onChange={() => setPaymentMode('online')}
                      className="accent-orange-500"
                    />
                    <div>
                      <p className="text-white text-sm font-medium">Pay Online</p>
                      <p className="text-gray-500 text-xs">Card or UPI payment</p>
                    </div>
                  </label>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading || !address.trim()}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-xl transition-colors"
              >
                {loading ? 'Processing...' : paymentMode === 'online' ? `Pay Online — ₹${total}` : `Place Order — ₹${total}`}
              </button>

              <p className="text-gray-500 text-xs mt-3 text-center">
                {paymentMode === 'cod' ? 'Cash on Delivery' : 'Secure online payment'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
