import express from 'express';
// 1. Yeni getHistory fonksiyonunu da import ettik
import { sendMessage, endSession, getHistory } from '../controllers/chatController.js';
// 2. Güvenlik bekçimiz olan middleware'i import ettik
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Sadece giriş yapmış (token'ı olan) kullanıcılar mesaj atabilsin
router.post('/send', verifyToken, sendMessage);

// Sadece giriş yapmış kullanıcıların seansı kaydedilsin (Senin /save-session adını koruduk)
router.post('/save-session', verifyToken, endSession);

// Sadece giriş yapmış kullanıcılar kendi geçmişini görebilsin
router.get('/history', verifyToken, getHistory);

export default router;
