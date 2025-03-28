const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Configuração específica para Vercel e ambientes locais
const chromium = require('chrome-aws-lambda');
const puppeteerCore = require('puppeteer-core');
// Função para determinar se estamos rodando na Vercel
const isProduction = process.env.NODE_ENV === 'production';

const app = express();
const port = process.env.PORT || 3000; // Porta onde o servidor vai rodar

// Middlewares
app.use(cors()); // Habilita CORS para permitir requisições do Mini App
app.use(express.json({ limit: '10mb' })); // Permite receber JSON no corpo da requisição (aumentamos o limite para HTML grande)
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Permite receber dados de formulário (não usaremos diretamente, mas é bom ter)

// Criar uma pasta public se não existir (para servir arquivos estáticos)
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Criar uma página de teste para verificar se o servidor está funcionando
const testHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Servidor BMO-Relatorios Está Funcionando</title>
    <style>
        body { font-family: sans-serif; margin: 40px; line-height: 1.6; }
        h1 { color: #4CAF50; }
        .container { max-width: 800px; margin: 0 auto; }
        .badge { display: inline-block; padding: 3px 10px; border-radius: 4px; background: #4CAF50; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Servidor BMO-Relatorios <span class="badge">ONLINE</span></h1>
        <p>O servidor de conversão HTML para PDF está funcionando corretamente.</p>
        <h2>Endpoints disponíveis:</h2>
        <ul>
            <li><strong>GET /</strong> - Esta página</li>
            <li><strong>POST /convert</strong> - Conversão de HTML para PDF</li>
        </ul>
        <hr>
        <p>Timestamp: ${new Date().toISOString()}</p>
        <p>Ambiente: ${isProduction ? 'Produção' : 'Desenvolvimento'}</p>
    </div>
</body>
</html>
`;

// Adicionar rota para o status
app.get('/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rota principal para teste
app.get('/', (req, res) => {
  res.send(testHtml);
});

// Rota para a conversão
app.post('/convert', async (req, res) => {
  console.log('Recebida requisição para /convert');
  const { htmlContent } = req.body; // Espera um JSON com a chave 'htmlContent'

  if (!htmlContent) {
    console.error('Erro: Nenhum conteúdo HTML recebido.');
    return res.status(400).send('Erro: Conteúdo HTML não fornecido.');
  }

  let browser;
  try {
    console.log('Iniciando Puppeteer...');
    
    if (isProduction) {
      // Configuração otimizada para Vercel
      browser = await puppeteerCore.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath,
        headless: chromium.headless
      });
    } else {
      // Configuração para desenvolvimento local
      browser = await puppeteerCore.launch({
        executablePath: process.platform === 'win32'
          ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
          : process.platform === 'linux'
            ? '/usr/bin/google-chrome'
            : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
    
    const page = await browser.newPage();

    console.log('Definindo conteúdo HTML na página...');
    // Define o conteúdo HTML na página virtual
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' }); // Espera a rede ficar ociosa

    console.log('Gerando PDF...');
    // Gera o PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',       // Formato da página
      printBackground: true // Inclui cores e imagens de fundo
    });

    console.log('PDF gerado com sucesso. Enviando resposta...');
    // Configura os cabeçalhos para indicar que é um arquivo PDF para download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf'); // Sugere o nome do arquivo
    res.send(pdfBuffer); // Envia o buffer do PDF como resposta

  } catch (error) {
    console.error('Erro durante a conversão para PDF:', error);
    res.status(500).send(`Erro ao converter HTML para PDF: ${error.message}`);
  } finally {
    if (browser) {
      console.log('Fechando Puppeteer.');
      await browser.close(); // Sempre feche o browser
    }
  }
});

// Inicia o servidor se estiver sendo executado diretamente (não importado como módulo)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Servidor backend ouvindo na porta ${port}`);
    console.log(`Endpoint de conversão: POST http://localhost:${port}/convert`);
  });
}

// Exporta o app para ser usado em outros arquivos (como o index.js na raiz)
module.exports = app; 