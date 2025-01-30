import { Router } from 'express';
import { register, login, user } from '../controllers/authController.js';

const router = Router();

// Define routes

router.get('/:id', user); 

router.post('/register', register);
router.post('/login', login);

export default router;
