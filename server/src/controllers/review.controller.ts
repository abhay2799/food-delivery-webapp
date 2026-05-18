import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { restaurantId, rating, comment } = req.body;

    const review = await prisma.review.create({
      data: {
        userId: req.user!.id,
        restaurantId,
        rating,
        comment,
      },
    });

    const avgRating = await prisma.review.aggregate({
      where: { restaurantId },
      _avg: { rating: true },
    });

    await prisma.restaurant.update({
      where: { id: restaurantId },
      data: { rating: avgRating._avg.rating || 0 },
    });

    res.status(201).json({ review });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getRestaurantReviews = async (req: AuthRequest, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const reviews = await prisma.review.findMany({
      where: { restaurantId: parseInt(restaurantId) },
      include: { user: { select: { name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
