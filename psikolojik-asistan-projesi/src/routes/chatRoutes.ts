import express from 'express';
import { sendMessage, endSession } from '../controllers/chatController.js';

const router = express.Router();

router.post('/send', sendMessage);
router.post('/save-session', endSession);

export default router;