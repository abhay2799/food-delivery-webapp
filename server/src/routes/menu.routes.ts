import { Router } from 'express';
import { getMenuByRestaurant, createMenuItem, updateMenuItem, deleteMenuItem } from '../controllers/menu.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/:restaurantId', getMenuByRestaurant);
router.post('/', authenticate, authorize('owner', 'admin'), createMenuItem);
router.put('/:id', authenticate, authorize('owner', 'admin'), updateMenuItem);
router.delete('/:id', authenticate, authorize('owner', 'admin'), deleteMenuItem);

export default router;
