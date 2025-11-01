import express from 'express';
import { AppDataSource } from '../config/database';
import { Property } from '../entities/Property';
import { authenticateJWT, authenticateAPIKey } from '../middleware/auth';
import { successResponse } from '../utils/response';
import { Conversions } from '../utils/conversions';

const router = express.Router();

router.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey) return authenticateAPIKey(req, res, next);
  return authenticateJWT(req, res, next);
});

router.get('/', async (req, res) => {
  const { propertyType, developerId, cityId } = req.query;
  const where: any = {};
  if (propertyType) where.propertyType = propertyType;
  if (developerId) where.developerId = developerId;
  if (cityId) where.cityId = cityId;

  const properties = await AppDataSource.getRepository(Property).find({
    where,
    relations: ['country', 'city', 'area', 'developer', 'facilities', 'units'],
  });

  const propertiesWithConversions = properties.map(p => ({
    ...p,
    priceFromAED: p.priceFrom ? Conversions.usdToAed(p.priceFrom) : null,
    priceAED: p.price ? Conversions.usdToAed(p.price) : null,
    sizeFromSqft: p.sizeFrom ? Conversions.sqmToSqft(p.sizeFrom) : null,
    sizeToSqft: p.sizeTo ? Conversions.sqmToSqft(p.sizeTo) : null,
    sizeSqft: p.size ? Conversions.sqmToSqft(p.size) : null,
  }));

  res.json(successResponse(propertiesWithConversions));
});

router.get('/:id', async (req, res) => {
  const property = await AppDataSource.getRepository(Property).findOne({
    where: { id: req.params.id },
    relations: ['country', 'city', 'area', 'developer', 'facilities', 'units'],
  });
  res.json(successResponse(property));
});

router.post('/', async (req, res) => {
  const property = await AppDataSource.getRepository(Property).save(req.body);
  res.json(successResponse(property));
});

router.patch('/:id', async (req, res) => {
  await AppDataSource.getRepository(Property).update(req.params.id, req.body);
  const property = await AppDataSource.getRepository(Property).findOne({
    where: { id: req.params.id },
    relations: ['facilities', 'units'],
  });
  res.json(successResponse(property));
});

router.delete('/:id', async (req, res) => {
  await AppDataSource.getRepository(Property).delete(req.params.id);
  res.json(successResponse(null, 'Property deleted'));
});

export default router;

