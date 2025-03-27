import puppeteer from 'puppeteer-core';
import { PageOptions } from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';

// Função para obter uma instância do navegador
export async function getBrowser() {
  // Determinar se estamos em ambiente de produção (Vercel) ou desenvolvimento
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Configurações para diferentes ambientes
  if (isProduction) {
    // Em produção (Vercel), usar chrome-aws-lambda
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
  } else {
    // Em desenvolvimento local
    return puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: 'new',
    });
  }
}

// Função para converter HTML em PDF
export async function htmlToPdf(html: string, options: any = {}) {
  const browser = await getBrowser();
  
  try {
    const page = await browser.newPage();
    
    // Configurar viewport
    await page.setViewport({
      width: options.width || 1240,
      height: options.height || 1754,
      deviceScaleFactor: 1,
    });
    
    // Carregar o HTML
    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });
    
    // Gerar o PDF
    const pdfBuffer = await page.pdf({
      format: options.format || 'A4',
      printBackground: options.printBackground !== false,
      margin: options.margin || {
        top: '40px',
        right: '40px',
        bottom: '40px',
        left: '40px',
      },
    });
    
    return pdfBuffer;
  } finally {
    // Garantir que o navegador seja fechado
    if (browser) {
      await browser.close().catch(console.error);
    }
  }
} 