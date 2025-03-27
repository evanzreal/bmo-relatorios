import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import chromium from 'chrome-aws-lambda';

export const dynamic = 'force-dynamic';

/**
 * API para conversão de HTML para PDF
 * 
 * Esta API recebe HTML via JSON e retorna um arquivo PDF
 * Ideal para uso com agentes de IA ou qualquer cliente que precise converter HTML para PDF
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar se é uma requisição JSON
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Conteúdo deve ser application/json' }, 
        { status: 415 }
      );
    }

    // Obter o HTML da requisição
    const body = await request.json();
    const { html } = body;

    if (!html) {
      return NextResponse.json(
        { error: 'O campo HTML é obrigatório' }, 
        { status: 400 }
      );
    }

    // Configurações opcionais
    const options = body.options || {};
    
    // Determinar se estamos em ambiente de desenvolvimento ou produção
    const isProduction = process.env.NODE_ENV === 'production';
    
    let browser;
    try {
      // Configurar opções do navegador dependendo do ambiente
      if (isProduction) {
        // Usar chrome-aws-lambda na Vercel (produção)
        browser = await puppeteer.launch({
          args: chromium.args,
          executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath,
          headless: chromium.headless,
        });
      } else {
        // Ambiente de desenvolvimento local
        browser = await puppeteer.launch({
          headless: 'new',
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
      }
      
      const page = await browser.newPage();
      
      // Configurar o tamanho da página (opções padrão A4)
      await page.setViewport({
        width: options.width || 1240,
        height: options.height || 1754,
        deviceScaleFactor: 1,
      });
      
      // Carregar o HTML no Puppeteer
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
      
      // Fechar o navegador
      await browser.close();
      
      // Configurar cabeçalhos da resposta
      const headers = new Headers();
      headers.set('Content-Type', 'application/pdf');
      headers.set('Content-Disposition', `attachment; filename="documento-${Date.now()}.pdf"`);
      headers.set('Content-Length', pdfBuffer.length.toString());
      
      // Retornar o PDF como resposta
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers,
      });
    } finally {
      // Garantir que o navegador seja fechado mesmo em caso de erro
      if (browser) {
        await browser.close().catch(console.error);
      }
    }
  } catch (error) {
    console.error('Erro ao processar a requisição:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', detalhes: error.message }, 
      { status: 500 }
    );
  }
} 