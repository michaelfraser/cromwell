import { Router } from 'express';
import authRoutes from './authRoutes.js';

const router = Router();

router.use('/user', authRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({ message: 'API is running fine!' });
});

export default router;
