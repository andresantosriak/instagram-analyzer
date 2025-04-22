import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import env from './config/env';
import apiRoutes from './routes';

const app = express();

// Middleware
app.use(cors({
  origin: env.corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Criar diretório de relatórios se não existir
const reportsDir = path.resolve(process.cwd(), env.reportsDir);
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    environment: env.nodeEnv,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
    stack: env.nodeEnv === 'development' ? err.stack : undefined
  });
});

// Não iniciar o servidor aqui, será feito no arquivo start.ts
// para permitir importação do app em testes sem iniciar o servidor

export default app;
