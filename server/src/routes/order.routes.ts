import { Router } from 'express';
import { createOrder, getUserOrders, getRestaurantOrders, updateOrderStatus } from '../controllers/order.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createOrder);
router.get('/user', authenticate, getUserOrders);
router.get('/restaurant/:restaurantId', authenticate, authorize('owner', 'admin'), getRestaurantOrders);
router.put('/:id/status', authenticate, authorize('owner', 'admin'), updateOrderStatus);

export default router;
