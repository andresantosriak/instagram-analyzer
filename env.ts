import dotenv from 'dotenv';
import path from 'path';

// Carrega o arquivo .env apropriado com base no ambiente
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export default {
  port: process.env.PORT || 3001,
  openaiApiUrl: 'https://api.openai.com/v1',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  reportsDir: process.env.REPORTS_DIR || './reports',
};
