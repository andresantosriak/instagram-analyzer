# Guia de Implantação do Sistema de Análise de Perfis de Instagram

Este guia fornece instruções passo a passo para implantar o sistema de Análise de Perfis de Instagram em plataformas de hospedagem na nuvem.

## Pré-requisitos

- Conta no [Vercel](https://vercel.com) (para o frontend e/ou backend)
- Conta no [Render](https://render.com) (alternativa para o backend)
- Conta no GitHub para hospedar os repositórios
- API Key da OpenAI

## Implantação do Backend

### Opção 1: Implantação no Vercel

1. Faça login na sua conta do Vercel
2. Clique em "Add New" > "Project"
3. Importe o repositório do backend do GitHub
4. Configure as variáveis de ambiente:
   - `NODE_ENV`: production
   - `CORS_ORIGIN`: URL do seu frontend (ex: https://instagram-analyzer-frontend.vercel.app)
   - `REPORTS_DIR`: ./reports
5. Clique em "Deploy"

### Opção 2: Implantação no Render

1. Faça login na sua conta do Render
2. Clique em "New" > "Web Service"
3. Conecte ao repositório do backend no GitHub
4. Configure o serviço:
   - Nome: instagram-analyzer-backend
   - Ambiente: Node
   - Comando de Build: npm install && npm run build
   - Comando de Início: npm start
5. Configure as variáveis de ambiente:
   - `NODE_ENV`: production
   - `PORT`: 8080
   - `CORS_ORIGIN`: URL do seu frontend
   - `REPORTS_DIR`: ./reports
6. Adicione um disco persistente:
   - Caminho de montagem: /opt/render/project/src/reports
   - Tamanho: 1 GB
7. Clique em "Create Web Service"

## Implantação do Frontend

### Implantação no Vercel

1. Faça login na sua conta do Vercel
2. Clique em "Add New" > "Project"
3. Importe o repositório do frontend do GitHub
4. Configure as variáveis de ambiente:
   - `REACT_APP_API_URL`: URL do seu backend (ex: https://instagram-analyzer-backend.vercel.app)
   - `REACT_APP_VERSION`: 1.0.0
   - `REACT_APP_ENV`: production
5. Clique em "Deploy"

## Verificação da Implantação

Após a implantação, verifique se:

1. O frontend está acessível através da URL fornecida pelo Vercel
2. O backend está respondendo corretamente (teste o endpoint /health)
3. A comunicação entre frontend e backend está funcionando
4. A validação da API Key da OpenAI está funcionando
5. A geração e visualização de relatórios está funcionando

## Configuração de Domínio Personalizado (Opcional)

### No Vercel

1. Vá para as configurações do projeto
2. Clique em "Domains"
3. Adicione seu domínio personalizado
4. Siga as instruções para configurar os registros DNS

### No Render

1. Vá para as configurações do serviço web
2. Clique em "Custom Domain"
3. Adicione seu domínio personalizado
4. Siga as instruções para configurar os registros DNS

## Monitoramento

Para monitorar sua aplicação:

1. Configure o Sentry para rastreamento de erros:
   - Crie uma conta no [Sentry](https://sentry.io)
   - Adicione o SDK do Sentry ao frontend e backend
   - Configure as variáveis de ambiente com as chaves do Sentry

2. Configure o UptimeRobot para monitoramento de disponibilidade:
   - Crie uma conta no [UptimeRobot](https://uptimerobot.com)
   - Adicione monitores para o frontend e backend
   - Configure alertas por email

## Manutenção

Para manter sua aplicação:

1. Atualize regularmente as dependências
2. Monitore o uso da API da OpenAI
3. Faça backup regular dos relatórios gerados
4. Verifique os logs para identificar e resolver problemas

## Solução de Problemas

Se encontrar problemas:

1. Verifique os logs da plataforma de hospedagem
2. Confirme se todas as variáveis de ambiente estão configuradas corretamente
3. Verifique se a API Key da OpenAI é válida
4. Teste localmente antes de implantar novamente
