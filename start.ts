import app from '../app';
import env from '../config/env';

// Inicia o servidor
app.listen(env.port, () => {
  console.log(`Servidor rodando na porta ${env.port} em modo ${env.nodeEnv}`);
});
