# Documentação do Sistema de Análise de Perfis de Instagram

## Visão Geral

O Sistema de Análise de Perfis de Instagram é uma aplicação web que utiliza Inteligência Artificial via OpenAI para analisar perfis do Instagram e fornecer recomendações personalizadas. O sistema é composto por 7 agentes de IA independentes, cada um responsável por uma área específica de análise ou criação de conteúdo.

## Arquitetura

O sistema segue uma arquitetura modular cliente-servidor:

- **Frontend**: Desenvolvido com React e TypeScript, utilizando Tailwind CSS para estilização
- **Backend**: Desenvolvido com Node.js, Express e TypeScript
- **Integração com IA**: Utiliza a API da OpenAI para os agentes de análise e criação de conteúdo

## Requisitos do Sistema

### Requisitos de Software
- Node.js v14 ou superior
- npm v6 ou superior
- Navegador web moderno (Chrome, Firefox, Safari, Edge)

### Requisitos de API
- Chave de API válida da OpenAI (fornecida pelo usuário)

## Instalação e Configuração

### Backend
1. Navegue até a pasta do backend:
   ```
   cd instagram-analyzer/backend
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do diretório backend
   - Adicione as seguintes variáveis:
     ```
     PORT=3001
     NODE_ENV=development
     ```

4. Inicie o servidor:
   ```
   npm start
   ```

### Frontend
1. Navegue até a pasta do frontend:
   ```
   cd instagram-analyzer/frontend
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Inicie o aplicativo:
   ```
   npm start
   ```

4. Acesse o aplicativo em seu navegador:
   ```
   http://localhost:3000
   ```

## Uso do Sistema

### 1. Configuração da API Key
- Na tela inicial, insira sua chave de API da OpenAI
- O sistema validará a chave antes de permitir o acesso às funcionalidades

### 2. Entrada de Dados do Perfil
- Preencha os dados do perfil do Instagram:
  - Nome de usuário (@username)
  - Número de seguidores
  - Texto da biografia (bio)
  - Link principal da bio (opcional)
  - URL da imagem de perfil (opcional)
  - Links de até 5 posts recentes (opcional)

### 3. Análise do Perfil
- Após submeter os dados, o sistema utilizará os 7 agentes de IA para analisar o perfil
- Os resultados serão exibidos em abas organizadas:
  - Pontos Fortes
  - Melhorias
  - Ações Recomendadas
  - Conteúdo Estratégico
  - Análise Completa

### 4. Geração de Relatórios
- É possível exportar os resultados da análise em formato estruturado
- O sistema gera um link compartilhável para o relatório
- O relatório pode ser visualizado por qualquer pessoa com o link, sem necessidade de API Key

## Agentes de IA

### 1. Agente de Análise de Perfil
- Analisa número de seguidores, imagem de perfil, link da bio e temas principais
- Classifica o tamanho do perfil (Micro, Médio, Grande)
- Sugere estratégia inicial

### 2. Agente de Análise de Biografia (Bio)
- Avalia o texto da bio: nicho, palavras-chave, tom de comunicação
- Analisa a qualidade do CTA (Call to Action)
- Sugere melhorias específicas

### 3. Agente de Análise de Link da Bio
- Verifica objetivo do link (página de vendas, captura, institucional)
- Sugere melhores práticas para o link da bio

### 4. Agente de Análise de Feed
- Analisa tipo de conteúdo dos posts (imagem, carrossel, vídeo)
- Detecta objetivo dos posts (informar, engajar, vender, entreter)
- Avalia qualidade da copy (perguntas, interação, CTA)

### 5. Agente de Criação de Conteúdo Estratégico
- Sugere ideias para carrosséis, stories interativos e reels
- Categoriza sugestões: Educacional, Inspiracional, Bastidores, Comercial

### 6. Agente de Criação de Copywriting
- Gera copies personalizadas para diferentes formatos de conteúdo
- Adapta o tom ao estilo do perfil e objetivo do conteúdo

### 7. Agente de Criação de Imagens Conceituais
- Sugere temas e estilos visuais para criação de imagens em IA
- Cria descrições de briefing baseadas no objetivo de comunicação

## Estrutura de Diretórios

```
instagram-analyzer/
├── frontend/               # Aplicação React
│   ├── public/             # Arquivos públicos
│   ├── src/                # Código-fonte
│   │   ├── components/     # Componentes React
│   │   ├── App.tsx         # Componente principal
│   │   └── index.tsx       # Ponto de entrada
│   ├── package.json        # Dependências do frontend
│   └── tailwind.config.js  # Configuração do Tailwind CSS
│
├── backend/                # Servidor Node.js
│   ├── src/                # Código-fonte
│   │   ├── config/         # Configurações
│   │   ├── controllers/    # Controladores
│   │   ├── models/         # Modelos
│   │   ├── routes/         # Rotas
│   │   ├── services/       # Serviços
│   │   ├── utils/          # Utilitários
│   │   ├── app.ts          # Aplicação Express
│   │   └── scripts/        # Scripts de inicialização
│   ├── reports/            # Relatórios gerados
│   └── package.json        # Dependências do backend
│
└── docs/                   # Documentação
```

## API Endpoints

### Autenticação
- `POST /api/auth/validate-key`: Valida a API Key da OpenAI

### Análise de Instagram
- `POST /api/instagram/analyze`: Analisa o perfil do Instagram

### Relatórios
- `POST /api/report/generate`: Gera um relatório
- `GET /api/report/view/:reportId`: Visualiza um relatório específico
- `GET /api/report/export/:reportId/pdf`: Exporta um relatório para PDF

## Considerações de Segurança

- A API Key da OpenAI é validada no servidor, mas não é armazenada permanentemente
- Os relatórios são armazenados sem a API Key do usuário
- Os links compartilháveis são gerados com IDs aleatórios para evitar acesso não autorizado

## Escalabilidade e Expansão Futura

O sistema foi projetado para permitir expansões futuras:

- Novos agentes de IA podem ser adicionados sem modificar os existentes
- Integração com Instagram Graph API pode ser implementada
- Análise de stories e anúncios pagos pode ser adicionada
- Sistema de cache pode ser implementado para otimizar o uso da API

## Solução de Problemas

### API Key Inválida
- Verifique se a chave foi copiada corretamente
- Confirme se a chave tem permissões para acessar os modelos da OpenAI
- Verifique se a chave não expirou ou atingiu o limite de uso

### Erro na Análise
- Verifique se todos os campos obrigatórios foram preenchidos
- Confirme se os links fornecidos são válidos
- Tente novamente com menos dados para identificar possíveis problemas

### Problemas de Conexão
- Verifique sua conexão com a internet
- Confirme se o backend e o frontend estão em execução
- Verifique os logs do servidor para identificar possíveis erros

## Suporte

Para suporte técnico ou dúvidas sobre o sistema, entre em contato com a equipe de desenvolvimento.
