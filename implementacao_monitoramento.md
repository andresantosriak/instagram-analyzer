# Implementação de Monitoramento para o Sistema de Análise de Perfis de Instagram

Este documento fornece instruções detalhadas para implementar um sistema de monitoramento abrangente para o sistema de Análise de Perfis de Instagram, permitindo acompanhar o desempenho da aplicação em tempo real e identificar rapidamente quaisquer problemas.

## 1. Monitoramento de Disponibilidade

### UptimeRobot

UptimeRobot é uma ferramenta gratuita que monitora a disponibilidade do seu site a cada 5 minutos.

#### Configuração:

1. Crie uma conta em [UptimeRobot](https://uptimerobot.com/)
2. Adicione novos monitores:
   - **Monitor de Frontend**: https://instagram-analyzer-frontend.vercel.app
   - **Monitor de Backend**: https://instagram-analyzer-backend.vercel.app/health
   - **Monitor de Domínio Personalizado** (se configurado): https://seu-dominio.com
3. Configure alertas por e-mail para notificações de indisponibilidade
4. Configure o intervalo de verificação (recomendado: 5 minutos)

```javascript
// Exemplo de endpoint de health check no backend
app.get('/health', (req, res) => {
  // Verificar componentes críticos
  const dbStatus = checkDatabaseConnection();
  const openaiStatus = checkOpenAIConnection();
  
  if (dbStatus && openaiStatus) {
    res.status(200).json({
      status: 'ok',
      services: {
        database: 'connected',
        openai: 'connected'
      },
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(503).json({
      status: 'error',
      services: {
        database: dbStatus ? 'connected' : 'disconnected',
        openai: openaiStatus ? 'connected' : 'disconnected'
      },
      timestamp: new Date().toISOString()
    });
  }
});
```

## 2. Rastreamento de Erros

### Sentry

Sentry permite rastrear erros em tempo real tanto no frontend quanto no backend.

#### Configuração do Frontend:

1. Crie uma conta em [Sentry](https://sentry.io/)
2. Crie um novo projeto para o frontend React
3. Instale o SDK:
   ```bash
   npm install @sentry/react
   ```
4. Configure o Sentry no seu aplicativo:

```javascript
// src/index.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: "https://seu-dsn-publico@o123456.ingest.sentry.io/project-id",
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  // Defina a amostragem para 10% em produção
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  // Defina a amostragem para 5% em produção
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.05 : 1.0,
  replaysOnErrorSampleRate: 1.0,
});
```

#### Configuração do Backend:

1. Crie um novo projeto para o backend Node.js
2. Instale o SDK:
   ```bash
   npm install @sentry/node
   ```
3. Configure o Sentry no seu aplicativo:

```javascript
// src/app.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: "https://seu-dsn-publico@o123456.ingest.sentry.io/project-id",
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
    new Sentry.Integrations.Postgres(),
  ],
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
});

// O middleware do Sentry deve ser o primeiro middleware
app.use(Sentry.Handlers.requestHandler());

// Suas rotas aqui
app.use('/api', apiRoutes);

// O middleware de tratamento de erros do Sentry deve ser antes de qualquer outro middleware de erro
app.use(Sentry.Handlers.errorHandler());

// Middleware de erro personalizado
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
    stack: env.nodeEnv === 'development' ? err.stack : undefined
  });
});
```

## 3. Métricas de Desempenho

### Prometheus e Grafana

Para monitoramento avançado de métricas, Prometheus e Grafana são excelentes opções.

#### Configuração do Prometheus no Backend:

1. Instale as dependências:
   ```bash
   npm install prom-client express-prometheus-middleware
   ```

2. Configure o middleware:

```javascript
// src/app.ts
import promClient from 'prom-client';
import promMiddleware from 'express-prometheus-middleware';

// Configuração do Prometheus
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ register: promClient.register });

// Adicione métricas personalizadas
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500, 1000]
});

// Middleware do Prometheus
app.use(promMiddleware({
  metricsPath: '/metrics',
  collectDefaultMetrics: true,
  requestDurationBuckets: [0.1, 0.5, 1, 1.5, 2, 2.5, 5, 10],
  requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
  responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
}));

// Métricas personalizadas para a API da OpenAI
const openaiRequestDuration = new promClient.Histogram({
  name: 'openai_request_duration_ms',
  help: 'Duration of OpenAI API requests in ms',
  labelNames: ['model', 'endpoint'],
  buckets: [100, 500, 1000, 2000, 5000, 10000]
});

// Exemplo de uso em um serviço
async function callOpenAI(prompt, model) {
  const end = openaiRequestDuration.startTimer({ model, endpoint: 'completions' });
  try {
    const result = await openai.createCompletion({
      model,
      prompt
    });
    end();
    return result;
  } catch (error) {
    end();
    throw error;
  }
}
```

#### Configuração do Grafana:

1. Configure um servidor Grafana (pode ser hospedado ou auto-hospedado)
2. Adicione o Prometheus como fonte de dados
3. Crie dashboards para visualizar métricas importantes:
   - Tempo de resposta da API
   - Taxa de erros
   - Uso de CPU e memória
   - Duração das chamadas à API da OpenAI
   - Número de usuários ativos

## 4. Monitoramento de Frontend

### Google Analytics

Para rastrear o comportamento do usuário e métricas de uso:

1. Crie uma conta no [Google Analytics](https://analytics.google.com/)
2. Configure uma propriedade para seu site
3. Instale o SDK:
   ```bash
   npm install react-ga4
   ```
4. Configure o Google Analytics no seu aplicativo:

```javascript
// src/App.tsx
import ReactGA from 'react-ga4';

// Inicialize o GA4
ReactGA.initialize('G-XXXXXXXXXX');

function App() {
  useEffect(() => {
    // Rastreie a visualização de página
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  // Função para rastrear eventos
  const trackEvent = (category, action, label) => {
    ReactGA.event({
      category,
      action,
      label
    });
  };

  // Exemplo de uso
  const handleAnalyzeProfile = () => {
    trackEvent('Profile', 'Analyze', 'User clicked analyze profile');
    // Lógica de análise de perfil
  };

  return (
    // Seu componente
  );
}
```

### Web Vitals

Para monitorar métricas de desempenho do frontend:

1. Instale a biblioteca:
   ```bash
   npm install web-vitals
   ```
2. Configure o rastreamento:

```javascript
// src/index.tsx
import { reportWebVitals } from 'web-vitals';

// Envie para o Google Analytics
const sendToAnalytics = ({ name, delta, id }) => {
  ReactGA.event({
    category: 'Web Vitals',
    action: name,
    value: Math.round(name === 'CLS' ? delta * 1000 : delta),
    label: id,
    nonInteraction: true,
  });
};

reportWebVitals(sendToAnalytics);
```

## 5. Logs Centralizados

### Papertrail ou LogDNA

Para centralizar logs de diferentes serviços:

1. Crie uma conta em um serviço de gerenciamento de logs (Papertrail, LogDNA, etc.)
2. Configure o transporte de logs no backend:

```bash
npm install winston winston-papertrail
```

```javascript
// src/utils/logger.ts
import winston from 'winston';
import { Papertrail } from 'winston-papertrail';

const papertrailTransport = new Papertrail({
  host: 'logs.papertrailapp.com',
  port: 12345, // Sua porta específica
  hostname: 'instagram-analyzer-backend',
  level: 'info',
  logFormat: (level, message) => `[${level}] ${message}`
});

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    papertrailTransport
  ]
});

export default logger;
```

3. Use o logger em todo o aplicativo:

```javascript
// Exemplo de uso
import logger from '../utils/logger';

export const analyzeProfile = async (req, res) => {
  try {
    logger.info(`Analisando perfil: ${req.body.profileData.username}`);
    // Lógica de análise
    logger.info(`Análise concluída para: ${req.body.profileData.username}`);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    logger.error(`Erro ao analisar perfil: ${error.message}`, { error });
    return res.status(500).json({ success: false, message: error.message });
  }
};
```

## 6. Alertas e Notificações

### Configuração de Alertas no Sentry:

1. Configure regras de alerta para diferentes tipos de erros
2. Configure integrações com Slack, email ou outros canais

### Configuração de Alertas no Grafana:

1. Configure alertas baseados em limites para métricas importantes:
   - Alerta quando o tempo de resposta médio exceder 500ms
   - Alerta quando a taxa de erros exceder 1%
   - Alerta quando o uso de CPU exceder 80%

## 7. Dashboard de Status

Crie um dashboard de status público para transparência:

1. Use uma ferramenta como Statuspage.io ou Status.io
2. Integre com seus sistemas de monitoramento
3. Forneça atualizações automáticas sobre incidentes

## 8. Monitoramento de Custos da API da OpenAI

Implemente monitoramento de custos para controlar gastos com a API da OpenAI:

```javascript
// src/services/openai-cost-tracker.ts
class OpenAICostTracker {
  private static instance: OpenAICostTracker;
  private costs: Record<string, number> = {};
  private tokenCosts: Record<string, { input: number, output: number }> = {
    'gpt-4': { input: 0.03, output: 0.06 },
    'gpt-3.5-turbo': { input: 0.0015, output: 0.002 }
  };

  private constructor() {}

  public static getInstance(): OpenAICostTracker {
    if (!OpenAICostTracker.instance) {
      OpenAICostTracker.instance = new OpenAICostTracker();
    }
    return OpenAICostTracker.instance;
  }

  public trackRequest(model: string, inputTokens: number, outputTokens: number): number {
    const modelCosts = this.tokenCosts[model] || { input: 0.01, output: 0.01 };
    const cost = (inputTokens / 1000) * modelCosts.input + (outputTokens / 1000) * modelCosts.output;
    
    if (!this.costs[model]) {
      this.costs[model] = 0;
    }
    this.costs[model] += cost;
    
    logger.info(`OpenAI API call cost: $${cost.toFixed(4)} (${model}, ${inputTokens} input tokens, ${outputTokens} output tokens)`);
    return cost;
  }

  public getTotalCost(): number {
    return Object.values(this.costs).reduce((total, cost) => total + cost, 0);
  }

  public getCostsByModel(): Record<string, number> {
    return { ...this.costs };
  }
}

export default OpenAICostTracker.getInstance();
```

## 9. Plano de Implementação

1. **Fase 1: Monitoramento Básico**
   - Implemente o health check no backend
   - Configure o UptimeRobot
   - Implemente o Sentry no frontend e backend

2. **Fase 2: Métricas de Desempenho**
   - Configure o Prometheus no backend
   - Configure o Grafana para visualização
   - Implemente o rastreamento de Web Vitals

3. **Fase 3: Logs e Alertas**
   - Configure o sistema de logs centralizado
   - Configure alertas no Sentry e Grafana
   - Implemente o monitoramento de custos da API da OpenAI

4. **Fase 4: Dashboard de Status**
   - Configure um dashboard de status público
   - Integre com todos os sistemas de monitoramento

## 10. Melhores Práticas

1. **Monitoramento Proativo**
   - Configure alertas para detectar problemas antes que afetem os usuários
   - Realize verificações regulares de todos os sistemas

2. **Documentação de Incidentes**
   - Mantenha um registro de todos os incidentes
   - Documente as causas raiz e as ações corretivas

3. **Revisões Regulares**
   - Analise regularmente as métricas e logs
   - Ajuste os limites de alerta conforme necessário

4. **Escalabilidade do Monitoramento**
   - Garanta que o sistema de monitoramento possa escalar com o crescimento da aplicação
   - Considere a amostragem para reduzir o volume de dados em sistemas de grande escala
