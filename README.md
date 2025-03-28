# Conversor HTML para PDF

Este é um aplicativo para o Telegram Mini Apps que permite converter código HTML em documentos PDF.

## Estrutura do Projeto

- `html-pdf-backend/`: Servidor Node.js que faz a conversão HTML para PDF usando Puppeteer
- `html-pdf-frontend/`: Interface de usuário para o Telegram Mini Apps

## Como Executar

### Backend

1. Entre na pasta do backend:
```bash
cd html-pdf-backend
```

2. Instale as dependências (caso ainda não tenha feito):
```bash
npm install
```

3. Inicie o servidor:
```bash
npm start
```

O servidor estará rodando em http://localhost:3000

### Deploy na Vercel

O projeto está configurado para ser facilmente implantado na Vercel:

1. Instale a CLI da Vercel (se ainda não tiver):
```bash
npm install -g vercel
```

2. Faça login na sua conta Vercel:
```bash
vercel login
```

3. Deploy do backend:
```bash
cd html-pdf-backend
vercel
```

4. Após o deploy, a Vercel fornecerá uma URL para seu projeto. Atualize essa URL no frontend:
```javascript
// Em html-pdf-frontend/script.js
const BACKEND_URL = 'https://seu-projeto-vercel.vercel.app/convert';
```

5. Para deploy de produção:
```bash
vercel --prod
```

### Frontend

O frontend é uma página HTML estática que pode ser servida de várias maneiras:

1. Através de um servidor web local (por exemplo, usando a extensão "Live Server" do VS Code)
2. Hospedando em um serviço como GitHub Pages, Netlify, Vercel, etc.

## Uso no Telegram

1. Crie um bot no Telegram através do @BotFather
2. Configure o Mini App na BotFather e aponte para a URL do frontend
3. Acesse o Mini App através do bot no Telegram
4. Cole seu código HTML na área de texto
5. Clique em "Converter para PDF"
6. O PDF será gerado e baixado automaticamente

## Configuração para Produção

Antes de implantar em produção:

1. Atualize a URL do backend no arquivo `html-pdf-frontend/script.js`
   - Durante o desenvolvimento local, use: `http://localhost:3000/convert`
   - Após o deploy na Vercel, use: `https://seu-projeto-vercel.vercel.app/convert`
2. Configure as variáveis de ambiente necessárias
3. Considere usar HTTPS para segurança (obrigatório para Mini Apps em produção)

## Tecnologias Utilizadas

- Node.js
- Express
- Puppeteer/Chrome AWS Lambda
- Telegram Mini Apps API 