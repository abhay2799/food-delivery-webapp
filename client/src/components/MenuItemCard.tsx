'use client';

import { Plus, Minus, Leaf } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addToCart, updateQuantity } from '@/redux/slices/cartSlice';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface MenuItemCardProps {
  item: {
    id: number;
    name: string;
    description?: string;
    price: number;
    image?: string;
    category: string;
    isVeg: boolean;
  };
  restaurantId: number;
  restaurantName: string;
}

export default function MenuItemCard({ item, restaurantId, restaurantName }: MenuItemCardProps) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartRestaurantId = useAppSelector((state) => state.cart.restaurantId);
  const cartItem = cartItems.find((ci) => ci.id === item.id);

  const handleAdd = () => {
    if (cartRestaurantId && cartRestaurantId !== restaurantId && cartItems.length > 0) {
      if (!confirm('Adding items from a different restaurant will clear your current cart. Continue?')) {
        return;
      }
    }
    dispatch(addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      restaurantId,
      restaurantName,
    }));
    toast.success(`${item.name} added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors"
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          {item.isVeg ? (
            <span className="w-4 h-4 border-2 border-green-500 flex items-center justify-center rounded-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            </span>
          ) : (
            <span className="w-4 h-4 border-2 border-red-500 flex items-center justify-center rounded-sm">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            </span>
          )}
          <h4 className="font-semibold text-white">{item.name}</h4>
        </div>
        <p className="text-sm text-gray-400 mb-2">{item.description}</p>
        <p className="text-orange-400 font-bold">₹{item.price}</p>
      </div>

      <div className="flex flex-col items-center gap-2 ml-4">
        {item.image && (
          <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
        )}
        {cartItem ? (
          <div className="flex items-center gap-2 bg-orange-500 rounded-lg px-2 py-1">
            <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: cartItem.quantity - 1 }))} className="text-white">
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-white font-bold text-sm">{cartItem.quantity}</span>
            <button onClick={handleAdd} className="text-white">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            className="px-4 py-1.5 bg-gray-700 hover:bg-orange-500 text-white text-sm font-medium rounded-lg transition-colors border border-gray-600 hover:border-orange-500"
          >
            ADD
          </button>
        )}
      </div>
    </motion.div>
  );
}
