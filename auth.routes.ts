import { Router } from 'express';
import { validateApiKey } from '../controllers/auth.controller';

const router = Router();

router.post('/validate-key', validateApiKey as any);

export default router;
