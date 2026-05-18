import { Router } from 'express';
import { createReview, getRestaurantReviews } from '../controllers/review.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createReview);
router.get('/:restaurantId', getRestaurantReviews);

export default router;
