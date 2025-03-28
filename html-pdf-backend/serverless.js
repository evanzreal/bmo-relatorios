const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const path = require('path');
const puppeteerCore = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');

const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos se existirem
app.use(express.static(path.join(__dirname, 'public')));

// Status simples
app.get('/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    environment: 'serverless',
    version: '1.0.0'
  });
});

// Página inicial
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>API HTML para PDF</title></head>
      <body>
        <h1>Serviço de HTML para PDF</h1>
        <p>Use o endpoint /convert para converter HTML em PDF.</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      </body>
    </html>
  `);
});

// Rota para a conversão
app.post('/convert', async (req, res) => {
  console.log('Requisição para /convert no modo serverless');
  const { htmlContent } = req.body;

  if (!htmlContent) {
    return res.status(400).send('Erro: Conteúdo HTML não fornecido.');
  }

  let browser;
  try {
    console.log('Iniciando Chrome headless no ambiente serverless...');
    
    // Carrega a versão do Chromium otimizada para AWS Lambda
    browser = await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { 
      waitUntil: 'networkidle0',
      timeout: 15000 // 15 segundos máximo para carregar
    });

    console.log('Gerando PDF...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0.5cm', right: '0.5cm', bottom: '0.5cm', left: '0.5cm' }
    });

    console.log('PDF gerado com sucesso');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Erro durante a conversão para PDF:', error);
    res.status(500).send(`Erro ao converter HTML para PDF: ${error.message}`);
  } finally {
    if (browser) {
      console.log('Fechando o browser...');
      await browser.close();
    }
  }
});

// Exportar diretamente como function handler para serverless
module.exports = serverless(app); 