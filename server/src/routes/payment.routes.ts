import { Router } from 'express';
import { initiatePayment, confirmPayment, getPaymentStatus } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/initiate', authenticate, initiatePayment);
router.post('/:id/confirm', authenticate, confirmPayment);
router.get('/:id/status', authenticate, getPaymentStatus);

export default router;
