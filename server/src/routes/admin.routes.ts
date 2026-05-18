import { Router } from 'express';
import {
  getAllUsers,
  getAllRestaurantsAdmin,
  approveRestaurant,
  getAllOrdersAdmin,
  getAdminAnalytics,
  deleteUser,
} from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/restaurants', getAllRestaurantsAdmin);
router.put('/restaurants/:id/approve', approveRestaurant);
router.get('/orders', getAllOrdersAdmin);
router.get('/analytics', getAdminAnalytics);

export default router;
