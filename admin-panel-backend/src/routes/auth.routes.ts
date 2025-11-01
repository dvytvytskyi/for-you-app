import express from 'express';
import jwt from 'jsonwebtoken';
import { successResponse } from '../utils/response';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ email }, process.env.ADMIN_JWT_SECRET!, { expiresIn: '7d' });
    return res.json(successResponse({ token }, 'Login successful'));
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

export default router;

