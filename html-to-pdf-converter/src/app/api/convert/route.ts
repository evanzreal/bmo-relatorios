import { NextRequest, NextResponse } from 'next/server';

// Esta é uma API simulada para converter HTML em PDF
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

    // Simulando o tempo de processamento
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulando uma resposta bem-sucedida
    // Em uma implementação real, isso usaria uma biblioteca como puppeteer, 
    // jsPDF ou chamaria um serviço externo para gerar o PDF
    return NextResponse.json({
      success: true,
      message: 'PDF gerado com sucesso',
      // Em uma implementação real, isso retornaria um URL para o PDF gerado
      // ou o próprio arquivo codificado em base64
      fileUrl: `/api/download/example-${Date.now()}.pdf`
    });
  } catch (error) {
    console.error('Erro ao processar a requisição:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    );
  }
} 