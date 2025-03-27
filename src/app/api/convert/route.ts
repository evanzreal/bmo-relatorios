import { NextRequest, NextResponse } from 'next/server';
import { htmlToPdf } from '../../../utils/chromium';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * API para conversão de HTML para PDF
 * 
 * Esta API recebe HTML via JSON e retorna um arquivo PDF
 * Ideal para uso com agentes de IA ou qualquer cliente que precise converter HTML para PDF
 */
export async function POST(request: NextRequest) {
  try {
    console.log('Requisição recebida para conversão HTML para PDF');
    
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

    console.log('Iniciando conversão de HTML para PDF');
    
    // Configurações opcionais
    const options = body.options || {};
    
    // Usar o utilitário para converter HTML em PDF
    const pdfBuffer = await htmlToPdf(html, options);
    
    console.log('PDF gerado com sucesso');
    
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
  } catch (error: any) {
    console.error('Erro ao processar a requisição:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', detalhes: error.message }, 
      { status: 500 }
    );
  }
} 