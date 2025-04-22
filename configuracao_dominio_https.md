# Configuração de Domínio Personalizado e HTTPS

Este documento fornece instruções detalhadas para configurar um domínio personalizado e HTTPS para o sistema de Análise de Perfis de Instagram.

## Aquisição de Domínio

1. **Escolha um registrador de domínio**:
   - Opções populares: Namecheap, GoDaddy, Google Domains, Cloudflare
   - Recomendação: Cloudflare (oferece proteção contra DDoS e gerenciamento de DNS integrado)

2. **Selecione um nome de domínio**:
   - Sugestões: 
     - instagram-analyzer.com
     - insta-profile-analysis.com
     - instagram-profile-ai.com
   - Verifique a disponibilidade e preço

3. **Compre o domínio**:
   - Registre por pelo menos 1 ano
   - Ative a renovação automática para evitar expiração

## Configuração de DNS

### Para Vercel (Frontend)

1. **Acesse o painel de controle do Vercel**:
   - Navegue até seu projeto
   - Vá para "Settings" > "Domains"

2. **Adicione seu domínio**:
   - Clique em "Add Domain"
   - Digite seu domínio (ex: instagram-analyzer.com ou app.instagram-analyzer.com)
   - Clique em "Add"

3. **Configure os registros DNS no seu registrador**:
   - Adicione um registro A apontando para os IPs do Vercel:
     ```
     A @ 76.76.21.21
     ```
   - Adicione um registro CNAME para o subdomínio www:
     ```
     CNAME www [seu-projeto].vercel.app
     ```

### Para Render (Backend)

1. **Acesse o painel de controle do Render**:
   - Navegue até seu serviço web
   - Vá para "Settings" > "Custom Domain"

2. **Adicione seu domínio**:
   - Clique em "Add Custom Domain"
   - Digite seu domínio (ex: api.instagram-analyzer.com)
   - Clique em "Save"

3. **Configure os registros DNS no seu registrador**:
   - Adicione um registro CNAME apontando para o domínio do Render:
     ```
     CNAME api [seu-servico].onrender.com
     ```

## Configuração de HTTPS

### Vercel (Frontend)

O Vercel configura automaticamente certificados SSL/TLS para seus domínios. Não é necessária nenhuma configuração adicional.

### Render (Backend)

O Render também configura automaticamente certificados SSL/TLS para seus domínios. Não é necessária nenhuma configuração adicional.

### Configuração Manual (Se necessário)

Se estiver usando outra plataforma que não configure HTTPS automaticamente:

1. **Obtenha um certificado SSL/TLS**:
   - Use Let's Encrypt (gratuito):
     ```bash
     sudo apt-get update
     sudo apt-get install certbot
     sudo certbot certonly --standalone -d seu-dominio.com
     ```

2. **Configure seu servidor web**:
   - Para Nginx:
     ```nginx
     server {
         listen 443 ssl;
         server_name seu-dominio.com;
         
         ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
         ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;
         
         # Outras configurações...
     }
     ```

   - Para Apache:
     ```apache
     <VirtualHost *:443>
         ServerName seu-dominio.com
         
         SSLEngine on
         SSLCertificateFile /etc/letsencrypt/live/seu-dominio.com/fullchain.pem
         SSLCertificateKeyFile /etc/letsencrypt/live/seu-dominio.com/privkey.pem
         
         # Outras configurações...
     </VirtualHost>
     ```

3. **Configure renovação automática**:
   ```bash
   sudo crontab -e
   ```
   Adicione:
   ```
   0 3 * * * certbot renew --quiet
   ```

## Redirecionamento HTTP para HTTPS

### Vercel e Render

Ambos Vercel e Render redirecionam automaticamente HTTP para HTTPS.

### Configuração Manual (Se necessário)

- Para Nginx:
  ```nginx
  server {
      listen 80;
      server_name seu-dominio.com;
      return 301 https://$host$request_uri;
  }
  ```

- Para Apache:
  ```apache
  <VirtualHost *:80>
      ServerName seu-dominio.com
      Redirect permanent / https://seu-dominio.com/
  </VirtualHost>
  ```

## Verificação da Configuração

1. **Teste o acesso HTTPS**:
   - Acesse https://seu-dominio.com
   - Verifique se o site carrega corretamente
   - Confirme que o navegador mostra o cadeado de conexão segura

2. **Verifique o certificado**:
   - Clique no cadeado na barra de endereço
   - Verifique se o certificado é válido e está emitido para seu domínio

3. **Teste o redirecionamento HTTP para HTTPS**:
   - Acesse http://seu-dominio.com
   - Confirme que é redirecionado automaticamente para https://seu-dominio.com

4. **Teste a API com o novo domínio**:
   - Atualize a variável de ambiente CORS_ORIGIN no backend para incluir seu novo domínio
   - Atualize a variável de ambiente REACT_APP_API_URL no frontend para apontar para o novo domínio da API
   - Teste as chamadas de API para garantir que estão funcionando corretamente

## Solução de Problemas

1. **Problemas de propagação de DNS**:
   - As alterações de DNS podem levar até 48 horas para propagar globalmente
   - Use ferramentas como dnschecker.org para verificar a propagação

2. **Erros de certificado**:
   - Verifique se o certificado foi emitido corretamente
   - Confirme que o certificado não expirou
   - Verifique se o certificado foi instalado corretamente no servidor

3. **Problemas de CORS**:
   - Atualize a configuração CORS no backend para incluir seu novo domínio
   - Verifique os logs do servidor para erros relacionados a CORS

4. **Redirecionamentos em loop**:
   - Verifique se há regras de redirecionamento conflitantes
   - Confirme que o servidor está configurado corretamente para HTTPS
