import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAllRestaurants = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;
    const cuisine = req.query.cuisine as string | undefined;
    const city = req.query.city as string | undefined;
    const where: any = { isApproved: true };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { cuisine: { contains: search } },
      ];
    }
    if (cuisine) where.cuisine = cuisine;
    if (city) where.city = city;

    const restaurants = await prisma.restaurant.findMany({
      where,
      include: { _count: { select: { reviews: true } } },
      orderBy: { rating: 'desc' },
    });
    res.json({ restaurants });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getRestaurantById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: parseInt(id) },
      include: {
        menuItems: { where: { isAvailable: true } },
        reviews: { include: { user: { select: { name: true, avatar: true } } }, take: 10, orderBy: { createdAt: 'desc' } },
        _count: { select: { reviews: true, orders: true } },
      },
    });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found.' });
    }
    res.json({ restaurant });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, image, address, city, cuisine, deliveryTime, deliveryFee } = req.body;
    const restaurant = await prisma.restaurant.create({
      data: {
        ownerId: req.user!.id,
        name,
        description,
        image,
        address,
        city,
        cuisine,
        deliveryTime: deliveryTime || '30-45 min',
        deliveryFee: deliveryFee || 0,
      },
    });
    res.status(201).json({ restaurant });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const restaurant = await prisma.restaurant.findUnique({ where: { id: parseInt(id) } });

    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found.' });
    if (restaurant.ownerId !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    const updated = await prisma.restaurant.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json({ restaurant: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const restaurant = await prisma.restaurant.findUnique({ where: { id: parseInt(id) } });

    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found.' });
    if (restaurant.ownerId !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    await prisma.restaurant.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Restaurant deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getMyRestaurants = async (req: AuthRequest, res: Response) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: { ownerId: req.user!.id },
      include: { _count: { select: { orders: true, menuItems: true, reviews: true } } },
    });
    res.json({ restaurants });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getRestaurantAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const restaurant = await prisma.restaurant.findUnique({ where: { id: parseInt(id) } });
    if (!restaurant || restaurant.ownerId !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    const totalOrders = await prisma.order.count({ where: { restaurantId: parseInt(id) } });
    const totalRevenue = await prisma.order.aggregate({
      where: { restaurantId: parseInt(id), status: 'delivered' },
      _sum: { totalAmount: true },
    });
    const avgRating = await prisma.review.aggregate({
      where: { restaurantId: parseInt(id) },
      _avg: { rating: true },
    });

    res.json({
      analytics: {
        totalOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        avgRating: avgRating._avg.rating || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
