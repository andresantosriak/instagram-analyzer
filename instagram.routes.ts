import { Router } from 'express';
import { analyzeProfile } from '../controllers/instagram.controller';

const router = Router();

router.post('/analyze', analyzeProfile as any);

export default router;
