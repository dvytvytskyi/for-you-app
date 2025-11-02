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
  try {
    const { name } = req.body;
    
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Developer name is required' });
    }
    
    // Check if developer with this name already exists
    const existingDeveloper = await AppDataSource.getRepository(Developer).findOne({
      where: { name: name.trim() },
    });
    
    if (existingDeveloper) {
      return res.status(409).json({ success: false, message: 'Developer with this name already exists' });
    }
    
    const developer = await AppDataSource.getRepository(Developer).save({
      name: name.trim(),
    });
    
    res.json(successResponse(developer));
  } catch (error: any) {
    console.error('Error creating developer:', error);
    
    // Handle unique constraint violation
    if (error.code === '23505' || error.message?.includes('UNIQUE constraint')) {
      return res.status(409).json({ success: false, message: 'Developer with this name already exists' });
    }
    
    res.status(500).json({ success: false, message: error.message || 'Failed to create developer' });
  }
});

router.delete('/developers/:id', async (req, res) => {
  try {
    const developer = await AppDataSource.getRepository(Developer).findOne({
      where: { id: req.params.id },
    });
    
    if (!developer) {
      return res.status(404).json({ success: false, message: 'Developer not found' });
    }
    
    await AppDataSource.getRepository(Developer).remove(developer);
    res.json(successResponse(null, 'Developer deleted successfully'));
  } catch (error: any) {
    console.error('Error deleting developer:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to delete developer' });
  }
});

// Endpoint to clean up duplicate developers (keep only first occurrence of each name)
router.post('/developers/cleanup-duplicates', async (req, res) => {
  try {
    const developerRepository = AppDataSource.getRepository(Developer);
    const allDevelopers = await developerRepository.find({
      order: { createdAt: 'ASC' }, // Keep the oldest one
    });
    
    const seenNames = new Set<string>();
    const duplicatesToDelete: Developer[] = [];
    let kept = 0;
    let deleted = 0;
    
    for (const dev of allDevelopers) {
      const normalizedName = dev.name.trim().toLowerCase();
      
      if (seenNames.has(normalizedName)) {
        duplicatesToDelete.push(dev);
        deleted++;
      } else {
        seenNames.add(normalizedName);
        kept++;
      }
    }
    
    if (duplicatesToDelete.length > 0) {
      await developerRepository.remove(duplicatesToDelete);
    }
    
    res.json(successResponse({
      kept,
      deleted,
      totalBefore: allDevelopers.length,
      totalAfter: kept,
    }, `Removed ${deleted} duplicate developers, kept ${kept} unique developers`));
  } catch (error: any) {
    console.error('Error cleaning up duplicates:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to clean up duplicates' });
  }
});

export default router;

