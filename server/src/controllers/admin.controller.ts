import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAllUsers = async (_req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAllRestaurantsAdmin = async (_req: AuthRequest, res: Response) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      include: {
        owner: { select: { name: true, email: true } },
        _count: { select: { orders: true, reviews: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ restaurants });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const approveRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const restaurant = await prisma.restaurant.update({
      where: { id: parseInt(id) },
      data: { isApproved: true },
    });
    res.json({ restaurant });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAllOrdersAdmin = async (_req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        restaurant: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAdminAnalytics = async (_req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalRestaurants = await prisma.restaurant.count();
    const totalOrders = await prisma.order.count();
    const totalRevenue = await prisma.order.aggregate({
      where: { status: 'delivered' },
      _sum: { totalAmount: true },
    });

    res.json({
      analytics: {
        totalUsers,
        totalRestaurants,
        totalOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'User deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
