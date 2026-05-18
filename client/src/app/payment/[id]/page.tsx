'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Lock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useAppDispatch } from '@/redux/hooks';
import { clearCart } from '@/redux/slices/cartSlice';

type PaymentMethod = 'card' | 'upi';
type PaymentState = 'form' | 'processing' | 'success' | 'failed';

export default function PaymentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const paymentId = params.id as string;
  const restaurantId = parseInt(searchParams.get('restaurantId') || '0');
  const address = searchParams.get('address') || '';
  const items = JSON.parse(searchParams.get('items') || '[]');

  const [method, setMethod] = useState<PaymentMethod>('card');
  const [paymentState, setPaymentState] = useState<PaymentState>('form');
  const [amount, setAmount] = useState(0);

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const { data } = await api.get(`/payments/${paymentId}/status`);
        setAmount(data.payment.amount);
        setMethod(data.payment.method === 'upi' ? 'upi' : 'card');
      } catch {
        toast.error('Payment session not found');
        router.push('/cart');
      }
    };
    fetchPayment();
  }, [paymentId, router]);

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      return digits.slice(0, 2) + '/' + digits.slice(2);
    }
    return digits;
  };

  const isFormValid = () => {
    if (method === 'card') {
      return cardNumber.replace(/\s/g, '').length === 16 && expiry.length === 5 && cvv.length === 3;
    }
    return upiId.includes('@') && upiId.length >= 5;
  };

  const handlePayment = async () => {
    if (!isFormValid()) {
      toast.error('Please fill in all payment details correctly');
      return;
    }

    setPaymentState('processing');

    try {
      const { data } = await api.post(`/payments/${paymentId}/confirm`, {
        cardNumber: method === 'card' ? cardNumber : undefined,
        upiId: method === 'upi' ? upiId : undefined,
        restaurantId,
        items,
        address,
      });

      setPaymentState('success');
      dispatch(clearCart());
      toast.success('Payment successful!');
      setTimeout(() => router.push('/orders'), 2000);
    } catch (error: any) {
      setPaymentState('failed');
      toast.error(error.response?.data?.message || 'Payment failed');
    }
  };

  if (paymentState === 'processing') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="h-16 w-16 text-orange-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Processing Payment</h2>
          <p className="text-gray-400">Please wait, do not close this page...</p>
        </motion.div>
      </div>
    );
  }

  if (paymentState === 'success') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Payment Successful!</h2>
          <p className="text-gray-400">Redirecting to your orders...</p>
        </motion.div>
      </div>
    );
  }

  if (paymentState === 'failed') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Payment Failed</h2>
          <p className="text-gray-400 mb-6">Your card was declined. Please try again.</p>
          <button
            onClick={() => setPaymentState('form')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-6">
          <Lock className="h-5 w-5 text-green-500" />
          <h1 className="text-2xl font-bold text-white">Secure Payment</h1>
        </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-400">Amount to pay</span>
            <span className="text-2xl font-bold text-orange-400">₹{amount}</span>
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setMethod('card')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border font-medium transition-colors ${
                method === 'card'
                  ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                  : 'border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              <CreditCard className="h-4 w-4" />
              Card
            </button>
            <button
              onClick={() => setMethod('upi')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border font-medium transition-colors ${
                method === 'upi'
                  ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                  : 'border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              <Smartphone className="h-4 w-4" />
              UPI
            </button>
          </div>

          {method === 'card' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Expiry</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">CVV</label>
                  <input
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    placeholder="•••"
                    maxLength={3}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors font-mono"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">UPI ID</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@upi"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          )}
        </div>

        <button
          onClick={handlePayment}
          disabled={!isFormValid()}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold rounded-xl transition-colors text-lg"
        >
          Pay ₹{amount}
        </button>

        <div className="mt-4 p-3 bg-gray-800/30 rounded-xl border border-gray-700/50">
          <p className="text-gray-500 text-xs text-center">
            Demo mode: Use card 4242 4242 4242 4242 for success.
            Cards ending in 0000 will be declined.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
