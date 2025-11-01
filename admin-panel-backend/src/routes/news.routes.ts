import express from 'express';
import { AppDataSource } from '../config/database';
import { News } from '../entities/News';
import { authenticateJWT, authenticateAPIKey } from '../middleware/auth';
import { successResponse } from '../utils/response';

const router = express.Router();

router.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey) return authenticateAPIKey(req, res, next);
  return authenticateJWT(req, res, next);
});

router.get('/', async (req, res) => {
  const news = await AppDataSource.getRepository(News).find({
    relations: ['contents'],
  });
  res.json(successResponse(news));
});

router.get('/:id', async (req, res) => {
  const newsItem = await AppDataSource.getRepository(News).findOne({
    where: { id: req.params.id },
    relations: ['contents'],
  });
  res.json(successResponse(newsItem));
});

router.post('/', async (req, res) => {
  const newsItem = await AppDataSource.getRepository(News).save(req.body);
  res.json(successResponse(newsItem));
});

router.patch('/:id', async (req, res) => {
  await AppDataSource.getRepository(News).update(req.params.id, req.body);
  const newsItem = await AppDataSource.getRepository(News).findOne({
    where: { id: req.params.id },
    relations: ['contents'],
  });
  res.json(successResponse(newsItem));
});

router.delete('/:id', async (req, res) => {
  await AppDataSource.getRepository(News).delete(req.params.id);
  res.json(successResponse(null, 'News deleted'));
});

export default router;

