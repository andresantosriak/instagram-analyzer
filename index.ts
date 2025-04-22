import { Router } from 'express';
import authRoutes from './auth.routes';
import instagramRoutes from './instagram.routes';
import reportRoutes from './report.routes';

const router = Router();

// Rotas de autenticação
router.use('/auth', authRoutes);

// Rotas de análise de Instagram
router.use('/instagram', instagramRoutes);

// Rotas de geração de relatórios
router.use('/report', reportRoutes);

export default router;
