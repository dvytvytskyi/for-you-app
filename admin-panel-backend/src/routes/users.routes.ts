import express from 'express';
import { successResponse } from '../utils/response';

const router = express.Router();

// Placeholder for now - will be implemented when main backend integration is ready
router.get('/', async (req, res) => {
  res.json(successResponse([]));
});

router.get('/:id', async (req, res) => {
  res.json(successResponse({}));
});

export default router;

