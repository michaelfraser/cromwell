import { Router } from 'express';
import { register, login, logout } from '../controllers/authController.js';

const router = Router();

// Define routes
router.post('/register', register);
router.post('/login', login);

export default router;
