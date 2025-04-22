# README - Sistema de Análise de Perfis de Instagram

## Sobre o Projeto

Este sistema realiza análise completa de perfis do Instagram utilizando Inteligência Artificial via OpenAI. Cada etapa da análise e criação de conteúdo é realizada por agentes específicos de IA, fornecendo insights valiosos e recomendações personalizadas.

## Principais Funcionalidades

- **Validação de API Key da OpenAI**: O usuário adiciona sua própria chave para utilizar o sistema
- **Análise Completa de Perfil**: Avaliação de seguidores, bio, link, posts recentes
- **7 Agentes de IA Especializados**: Cada um com função específica de análise ou criação
- **Relatórios Estruturados**: Visualização em abas (Pontos Fortes, Melhorias, Ações Recomendadas, etc.)
- **Exportação de Relatórios**: Geração de links compartilháveis e exportação em formato estruturado

## Tecnologias Utilizadas

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Integração IA**: API da OpenAI

## Estrutura do Projeto

```
instagram-analyzer/
├── frontend/               # Aplicação React
├── backend/                # Servidor Node.js
└── docs/                   # Documentação
```

## Instalação e Execução

### Backend
```bash
cd instagram-analyzer/backend
npm install
npm start
```

### Frontend
```bash
cd instagram-analyzer/frontend
npm install
npm start
```

Acesse o aplicativo em: http://localhost:3000

## Documentação

Para informações detalhadas sobre instalação, configuração e uso do sistema, consulte a [documentação completa](./docs/documentacao.md).

## Requisitos

- Node.js v14 ou superior
- npm v6 ou superior
- Chave de API válida da OpenAI (fornecida pelo usuário)
- Navegador web moderno

## Escalabilidade

O sistema foi projetado com modularidade e flexibilidade para permitir futuras expansões, como:
- Adição de novos agentes de IA
- Integração com Instagram Graph API
- Análise de stories e anúncios pagos
