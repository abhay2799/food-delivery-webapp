import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { io } from '../index';

export const initiatePayment = async (req: AuthRequest, res: Response) => {
  try {
    const { restaurantId, items, address, method, amount } = req.body;

    if (!method || !amount) {
      return res.status(400).json({ message: 'Payment method and amount are required.' });
    }

    const payment = await prisma.payment.create({
      data: {
        userId: req.user!.id,
        amount,
        method,
      },
    });

    res.status(201).json({
      paymentId: payment.id,
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      orderDetails: { restaurantId, items, address },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const confirmPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { cardNumber, upiId, restaurantId, items, address } = req.body;

    const payment = await prisma.payment.findUnique({ where: { id: parseInt(id) } });

    if (!payment) return res.status(404).json({ message: 'Payment not found.' });
    if (payment.userId !== req.user!.id) return res.status(403).json({ message: 'Not authorized.' });
    if (payment.status !== 'pending') {
      return res.status(400).json({ message: 'Payment already processed.' });
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const isFailure =
      payment.method === 'card' && cardNumber && cardNumber.replace(/\s/g, '').endsWith('0000');

    if (isFailure) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'failed' },
      });
      return res.status(402).json({ message: 'Payment failed. Card declined.' });
    }

    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    let totalAmount = 0;
    for (const item of items) {
      const menuItem = await prisma.menuItem.findUnique({ where: { id: item.menuItemId } });
      if (!menuItem) return res.status(400).json({ message: `Menu item ${item.menuItemId} not found.` });
      totalAmount += menuItem.price * item.quantity;
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user!.id,
        restaurantId,
        totalAmount,
        address,
        paymentMode: payment.method,
        items: {
          create: items.map((item: { menuItemId: number; quantity: number; price: number }) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: { include: { menuItem: true } }, restaurant: true },
    });

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'success',
        transactionId,
        orderId: order.id,
      },
    });

    io.to(`restaurant_${restaurantId}`).emit('new_order', order);

    res.json({
      message: 'Payment successful',
      transactionId,
      order,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getPaymentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id: parseInt(id) },
      include: { order: true },
    });

    if (!payment) return res.status(404).json({ message: 'Payment not found.' });
    if (payment.userId !== req.user!.id) return res.status(403).json({ message: 'Not authorized.' });

    res.json({ payment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
