const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const serverless = require('serverless-http');

// API externa para conversão HTML para PDF - precisaremos configurar
const API_PDF_SERVICE = process.env.PDF_API_URL || 'https://api.pdfshift.io/v3/convert/pdf';
// Chave PDFShift fornecida pelo usuário
const API_PDF_KEY = process.env.PDF_API_KEY || 'sk_9d2ee56179a2255b2618e2ca42b04d2bfa25fbf6';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
app.use(express.static(publicDir));

// Página de status
app.get('/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    serviceProvider: 'PDFShift API',
    apiConfigured: !!API_PDF_KEY
  });
});

// Página inicial
app.get('/', (req, res) => {
  res.send(`
    <html>
    <head>
      <title>Serviço de HTML para PDF</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #0070f3; }
        .info { background: #f0f7ff; padding: 15px; border-radius: 5px; margin: 15px 0; }
        code { background: #f1f1f1; padding: 2px 5px; border-radius: 3px; }
      </style>
    </head>
    <body>
      <h1>Serviço de Conversão HTML para PDF</h1>
      <div class="info">
        <p>Este serviço converte código HTML em documentos PDF via PDFShift API.</p>
        <p>Status: <strong>Ativo</strong></p>
        <p>API Configurada: <strong>${!!API_PDF_KEY ? 'Sim' : 'Não'}</strong></p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      </div>
      
      <h2>Como usar</h2>
      <p>Envie uma requisição POST para <code>/convert</code> com o seguinte formato JSON:</p>
      <pre><code>{
  "htmlContent": "seu código HTML aqui"
}</code></pre>

      <h2>Exemplos</h2>
      <p>Acesse <a href="/exemplo.html">/exemplo.html</a> para ver um HTML de exemplo.</p>
    </body>
    </html>
  `);
});

// Rota para conversão HTML para PDF usando API externa
app.post('/convert', async (req, res) => {
  console.log('Recebida requisição para /convert');
  
  const { htmlContent } = req.body;
  
  if (!htmlContent) {
    console.error('Erro: Nenhum conteúdo HTML recebido.');
    return res.status(400).send('Erro: Conteúdo HTML não fornecido.');
  }

  try {
    console.log('Enviando HTML para PDFShift...');
    
    // Autenticação básica para PDFShift
    const auth = Buffer.from(`api:${API_PDF_KEY}`).toString('base64');
    
    const apiResponse = await axios({
      method: 'post',
      url: API_PDF_SERVICE,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      data: {
        source: htmlContent,
        landscape: false,
        format: 'A4',
        use_print: false
      },
      responseType: 'arraybuffer'
    });

    console.log('PDF gerado com sucesso. Enviando resposta...');
    
    // Configura os cabeçalhos para indicar que é um arquivo PDF para download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');
    res.send(apiResponse.data);

  } catch (error) {
    console.error('Erro durante a conversão:', error.message);
    let errorMessage = `Erro: ${error.message}`;
    
    // Tratamento especial para erro da API PDFShift
    if (error.response) {
      console.error('Resposta de erro completa:', error.response.status, error.response.statusText);
      
      // Se tiver dados no formato buffer, tenta convertê-los para texto legível
      if (error.response.data) {
        try {
          if (error.response.data instanceof Buffer) {
            const errorData = error.response.data.toString('utf8');
            console.error('Dados da resposta de erro:', errorData);
            
            try {
              // Tenta analisar como JSON se possível
              const parsedError = JSON.parse(errorData);
              errorMessage = `Erro PDFShift: ${parsedError.message || parsedError.error || JSON.stringify(parsedError)}`;
            } catch (e) {
              // Se não for JSON, usa o texto bruto
              errorMessage = `Erro PDFShift: ${errorData}`;
            }
          } else {
            errorMessage = `Erro do serviço externo: ${error.response.status} ${error.response.statusText}`;
          }
        } catch (parseError) {
          console.error('Não foi possível analisar os dados de erro:', parseError);
        }
      } else {
        errorMessage = `Erro do serviço externo: ${error.response.status} ${error.response.statusText}`;
      }
    }
    
    res.status(500).send(`Erro ao converter HTML para PDF: ${errorMessage}`);
  }
});

// Se executando diretamente
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Servidor ouvindo na porta ${port}`);
    console.log(`PDFShift API configurada: ${!!API_PDF_KEY}`);
  });
}

// Exportar para ambiente serverless
module.exports = serverless(app); 