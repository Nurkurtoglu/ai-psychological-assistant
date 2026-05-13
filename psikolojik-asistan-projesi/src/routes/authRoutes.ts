import express from 'express';
import { register, login } from '../controllers/authControllers.js';

const router = express.Router();

// Kayıt ol: POST /api/auth/register
router.post('/register', register);

// Giriş yap: POST /api/auth/login
router.post('/login', login);

export default router;