import express from 'express';
import { AppDataSource } from '../config/database';
import { Country } from '../entities/Country';
import { City } from '../entities/City';
import { Area } from '../entities/Area';
import { Facility } from '../entities/Facility';
import { Developer } from '../entities/Developer';
import { authenticateJWT, authenticateAPIKey } from '../middleware/auth';
import { successResponse } from '../utils/response';

const router = express.Router();

router.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey) return authenticateAPIKey(req, res, next);
  return authenticateJWT(req, res, next);
});

router.get('/countries', async (req, res) => {
  const countries = await AppDataSource.getRepository(Country).find({ relations: ['cities'] });
  res.json(successResponse(countries));
});

router.get('/cities', async (req, res) => {
  const { countryId } = req.query;
  const where: any = countryId ? { countryId } : {};
  const cities = await AppDataSource.getRepository(City).find({ where, relations: ['areas'] });
  res.json(successResponse(cities));
});

router.get('/areas', async (req, res) => {
  const { cityId } = req.query;
  const where: any = cityId ? { cityId } : {};
  const areas = await AppDataSource.getRepository(Area).find({ where });
  res.json(successResponse(areas));
});

router.get('/facilities', async (req, res) => {
  const facilities = await AppDataSource.getRepository(Facility).find();
  res.json(successResponse(facilities));
});

router.post('/facilities', async (req, res) => {
  const facility = await AppDataSource.getRepository(Facility).save(req.body);
  res.json(successResponse(facility));
});

router.get('/developers', async (req, res) => {
  const developers = await AppDataSource.getRepository(Developer).find();
  res.json(successResponse(developers));
});

router.post('/developers', async (req, res) => {
  const developer = await AppDataSource.getRepository(Developer).save(req.body);
  res.json(successResponse(developer));
});

export default router;

