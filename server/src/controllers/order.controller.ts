import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { io } from '../index';

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { restaurantId, items, address, paymentMode } = req.body;

    let totalAmount = 0;
    for (const item of items) {
      const menuItem = await prisma.menuItem.findUnique({ where: { id: item.menuItemId } });
      if (!menuItem) return res.status(400).json({ message: `Menu item ${item.menuItemId} not found.` });
      totalAmount += menuItem.price * item.quantity;
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user!.id,
        restaurantId,
        totalAmount,
        address,
        paymentMode: paymentMode || 'cod',
        items: {
          create: items.map((item: { menuItemId: number; quantity: number; price: number }) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: { include: { menuItem: true } }, restaurant: true },
    });

    io.to(`restaurant_${restaurantId}`).emit('new_order', order);

    res.status(201).json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      include: {
        restaurant: { select: { name: true, image: true } },
        items: { include: { menuItem: { select: { name: true, image: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getRestaurantOrders = async (req: AuthRequest, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await prisma.restaurant.findUnique({ where: { id: parseInt(restaurantId) } });

    if (!restaurant || restaurant.ownerId !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    const orders = await prisma.order.findMany({
      where: { restaurantId: parseInt(restaurantId) },
      include: {
        user: { select: { name: true, phone: true } },
        items: { include: { menuItem: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: { restaurant: true },
    });

    if (!order) return res.status(404).json({ message: 'Order not found.' });

    if (order.restaurant.ownerId !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    const updated = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
      include: { items: { include: { menuItem: true } }, restaurant: true },
    });

    io.to(`user_${order.userId}`).emit('order_update', updated);
    io.to(`restaurant_${order.restaurantId}`).emit('order_update', updated);

    res.json({ order: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
