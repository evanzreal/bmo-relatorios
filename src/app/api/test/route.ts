import { NextRequest, NextResponse } from 'next/server';

/**
 * Endpoint de teste que demonstra como usar a API de conversão HTML para PDF
 * 
 * Este endpoint retorna JSON com instruções e um exemplo de como chamar a API
 */
export async function GET(request: NextRequest) {
  const baseUrl = request.nextUrl.origin;
  const apiUrl = `${baseUrl}/api/convert`;
  
  const exampleHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Exemplo de Relatório BMO</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #0066cc;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
    }
    th {
      background-color: #f2f2f2;
      text-align: left;
    }
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
  </style>
</head>
<body>
  <h1>Relatório BMO</h1>
  <p>Este é um exemplo de relatório que será convertido para PDF.</p>
  
  <h2>Resumo</h2>
  <p>Este relatório demonstra a capacidade de conversão HTML para PDF da API.</p>
  
  <h2>Dados do Exemplo</h2>
  <table>
    <tr>
      <th>Item</th>
      <th>Descrição</th>
      <th>Valor</th>
    </tr>
    <tr>
      <td>1</td>
      <td>Exemplo de item</td>
      <td>R$ 100,00</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Outro exemplo</td>
      <td>R$ 250,00</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Mais um exemplo</td>
      <td>R$ 75,50</td>
    </tr>
  </table>
  
  <p>Data de geração: ${new Date().toLocaleDateString('pt-BR')}</p>
</body>
</html>
`;

  const example = {
    curl: `curl -X POST ${apiUrl} \\
  -H "Content-Type: application/json" \\
  -d '{"html": "${exampleHtml.replace(/\n/g, '\\n').replace(/"/g, '\\"')}"}'`,
    
    fetch: `fetch("${apiUrl}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    html: \`${exampleHtml.replace(/`/g, '\\`')}\`
  })
})
.then(response => response.blob())
.then(blob => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'documento.pdf';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
})
.catch(error => console.error('Erro:', error));`,
    
    python: `import requests

response = requests.post(
    "${apiUrl}",
    json={"html": """${exampleHtml}"""},
    headers={"Content-Type": "application/json"}
)

if response.status_code == 200:
    # Salvar o PDF
    with open("documento.pdf", "wb") as f:
        f.write(response.content)
    print("PDF salvo como documento.pdf")
else:
    print(f"Erro: {response.status_code}")
    print(response.json())`,
    
    nodejs: `const fetch = require('node-fetch');
const fs = require('fs');

async function convertHtmlToPdf() {
  try {
    const response = await fetch("${apiUrl}", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        html: \`${exampleHtml.replace(/`/g, '\\`')}\`
      })
    });
    
    if (!response.ok) {
      throw new Error(\`Erro HTTP: \${response.status}\`);
    }
    
    const buffer = await response.buffer();
    fs.writeFileSync('documento.pdf', buffer);
    console.log('PDF salvo como documento.pdf');
  } catch (error) {
    console.error('Erro:', error);
  }
}

convertHtmlToPdf();`
  };

  return NextResponse.json({
    message: "Bem-vindo à API de conversão HTML para PDF",
    description: "Esta API permite converter código HTML em documentos PDF facilmente",
    endpoint: apiUrl,
    method: "POST",
    contentType: "application/json",
    requestBody: {
      html: "Seu código HTML aqui",
      options: {
        format: "A4 (padrão), Letter, Legal, Tabloid, etc.",
        printBackground: "true (padrão) ou false",
        margin: {
          top: "40px (padrão)",
          right: "40px (padrão)",
          bottom: "40px (padrão)",
          left: "40px (padrão)"
        }
      }
    },
    responseType: "application/pdf",
    examples: example
  });
} 