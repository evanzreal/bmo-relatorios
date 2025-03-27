import { NextRequest, NextResponse } from 'next/server';

// Esta é uma API simulada para baixar um arquivo PDF
export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    
    // Em uma implementação real, aqui verificaríamos se o arquivo existe
    // e retornaríamos o arquivo real
    
    // Criando um PDF simulado (na verdade, só um texto)
    // Em uma implementação real, você poderia buscar um arquivo real ou
    // gerar um PDF on-the-fly com uma biblioteca
    
    // Simulando o tempo de processamento
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Criando um texto de amostra que será tratado como "PDF"
    const sampleText = `Este é um PDF simulado para ${filename}
Gerado em: ${new Date().toLocaleString('pt-BR')}
---------------------
Conteúdo do relatório BMO
`;
    
    // Convertendo para um buffer
    const buffer = Buffer.from(sampleText, 'utf-8');
    
    // Configurando os headers para download
    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Length', buffer.length.toString());
    
    // Retornando a resposta com o "PDF"
    return new NextResponse(buffer, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Erro ao gerar o download:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar o download do arquivo' }, 
      { status: 500 }
    );
  }
} 