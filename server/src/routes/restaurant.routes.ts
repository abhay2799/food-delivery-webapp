import { Router } from 'express';
import {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getMyRestaurants,
  getRestaurantAnalytics,
} from '../controllers/restaurant.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getAllRestaurants);
router.get('/my', authenticate, authorize('owner', 'admin'), getMyRestaurants);
router.get('/:id', getRestaurantById);
router.get('/:id/analytics', authenticate, authorize('owner', 'admin'), getRestaurantAnalytics);
router.post('/', authenticate, authorize('owner', 'admin'), createRestaurant);
router.put('/:id', authenticate, authorize('owner', 'admin'), updateRestaurant);
router.delete('/:id', authenticate, authorize('owner', 'admin'), deleteRestaurant);

export default router;
