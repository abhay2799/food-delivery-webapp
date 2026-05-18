import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getMenuByRestaurant = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const menuItems = await prisma.menuItem.findMany({
      where: { restaurantId: parseInt(restaurantId) },
      orderBy: { category: 'asc' },
    });
    res.json({ menuItems });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createMenuItem = async (req: AuthRequest, res: Response) => {
  try {
    const { restaurantId, name, description, price, image, category, isVeg } = req.body;

    const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!restaurant || restaurant.ownerId !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    const menuItem = await prisma.menuItem.create({
      data: { restaurantId, name, description, price, image, category, isVeg },
    });
    res.status(201).json({ menuItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateMenuItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: parseInt(id) },
      include: { restaurant: true },
    });

    if (!menuItem || menuItem.restaurant.ownerId !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    const updated = await prisma.menuItem.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json({ menuItem: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteMenuItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: parseInt(id) },
      include: { restaurant: true },
    });

    if (!menuItem || menuItem.restaurant.ownerId !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    await prisma.menuItem.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Menu item deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
