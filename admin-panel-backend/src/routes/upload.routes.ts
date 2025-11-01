import express from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateJWT } from '../middleware/auth';
import { successResponse } from '../utils/response';

const router = express.Router();
router.use(authenticateJWT);

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post('/image', upload.single('file'), (req, res) => {
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file?.filename}`;
  res.json(successResponse({ url }));
});

router.post('/images', upload.array('files', 10), (req, res) => {
  const files = req.files as Express.Multer.File[];
  const urls = files.map(f => `${req.protocol}://${req.get('host')}/uploads/${f.filename}`);
  res.json(successResponse({ urls }));
});

export default router;

