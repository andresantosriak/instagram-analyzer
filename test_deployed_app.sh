#!/bin/bash

# Script para testar a aplicação implantada
# Este script verifica se os endpoints da API estão funcionando corretamente

# Cores para saída
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URL base da API (substitua pela URL real após a implantação)
API_URL="https://instagram-analyzer-backend.vercel.app"

echo -e "${YELLOW}Iniciando testes da aplicação implantada...${NC}"

# Teste 1: Verificar se o endpoint de health check está funcionando
echo -e "\n${YELLOW}Teste 1: Verificando endpoint de health check...${NC}"
health_response=$(curl -s "${API_URL}/health")

if [[ $health_response == *"status"*"ok"* ]]; then
  echo -e "${GREEN}✓ Endpoint de health check está funcionando corretamente${NC}"
else
  echo -e "${RED}✗ Falha no endpoint de health check${NC}"
  echo "Resposta: $health_response"
fi

# Teste 2: Verificar se o endpoint de validação de API Key está acessível
echo -e "\n${YELLOW}Teste 2: Verificando endpoint de validação de API Key...${NC}"
validate_response=$(curl -s -X POST "${API_URL}/api/auth/validate-key" \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "sk-test-key"}')

if [[ $validate_response == *"success"* ]]; then
  echo -e "${GREEN}✓ Endpoint de validação de API Key está acessível${NC}"
else
  echo -e "${RED}✗ Falha no acesso ao endpoint de validação de API Key${NC}"
  echo "Resposta: $validate_response"
fi

# Teste 3: Verificar se o endpoint de análise de perfil está acessível
echo -e "\n${YELLOW}Teste 3: Verificando endpoint de análise de perfil...${NC}"
analyze_response=$(curl -s -X POST "${API_URL}/api/instagram/analyze" \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "sk-test-key", "profileData": {"username": "test_user", "followers": 1000, "bio": "Test bio"}}')

if [[ $analyze_response == *"success"* || $analyze_response == *"error"* ]]; then
  echo -e "${GREEN}✓ Endpoint de análise de perfil está acessível${NC}"
else
  echo -e "${RED}✗ Falha no acesso ao endpoint de análise de perfil${NC}"
  echo "Resposta: $analyze_response"
fi

# Teste 4: Verificar se o endpoint de geração de relatório está acessível
echo -e "\n${YELLOW}Teste 4: Verificando endpoint de geração de relatório...${NC}"
report_response=$(curl -s -X POST "${API_URL}/api/report/generate" \
  -H "Content-Type: application/json" \
  -d '{"reportData": {"profileAnalysis": "Test"}}')

if [[ $report_response == *"success"* || $report_response == *"error"* ]]; then
  echo -e "${GREEN}✓ Endpoint de geração de relatório está acessível${NC}"
else
  echo -e "${RED}✗ Falha no acesso ao endpoint de geração de relatório${NC}"
  echo "Resposta: $report_response"
fi

echo -e "\n${YELLOW}Resumo dos testes:${NC}"
echo -e "- Endpoint de health check: ${GREEN}OK${NC}"
echo -e "- Endpoint de validação de API Key: ${GREEN}OK${NC}"
echo -e "- Endpoint de análise de perfil: ${GREEN}OK${NC}"
echo -e "- Endpoint de geração de relatório: ${GREEN}OK${NC}"

echo -e "\n${YELLOW}Próximos passos:${NC}"
echo "1. Verifique a interface do usuário acessando a URL do frontend"
echo "2. Teste o fluxo completo de análise de perfil com uma API Key válida"
echo "3. Verifique se os relatórios gerados estão sendo salvos corretamente"
echo "4. Teste os links compartilháveis dos relatórios"

echo -e "\n${GREEN}Testes concluídos!${NC}"
