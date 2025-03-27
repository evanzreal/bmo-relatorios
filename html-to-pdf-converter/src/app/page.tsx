"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [htmlInput, setHtmlInput] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  
  const handleConvert = async () => {
    if (!htmlInput.trim()) {
      alert("Por favor, insira o código HTML antes de converter.");
      return;
    }
    
    setIsConverting(true);
    setPdfUrl("");
    
    try {
      // Chamada real para a API
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html: htmlInput }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao converter HTML para PDF');
      }
      
      // Usando a URL retornada pela API
      setPdfUrl(data.fileUrl);
    } catch (error) {
      console.error("Erro ao converter:", error);
      alert("Ocorreu um erro ao converter o HTML para PDF: " + error.message);
    } finally {
      setIsConverting(false);
    }
  };
  
  const handleClear = () => {
    setHtmlInput("");
    setPdfUrl("");
  };
  
  const handleLoadTemplate = (templateId) => {
    // Simulando templates
    const templates = {
      1: `<!DOCTYPE html>
<html>
<head>
  <title>Relatório BMO - Template 1</title>
  <style>
    body { font-family: Arial, sans-serif; }
    h1 { color: #0055A4; }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Relatório BMO</h1>
    <p>Este é um exemplo de template para o relatório BMO.</p>
  </div>
</body>
</html>`,
      2: `<!DOCTYPE html>
<html>
<head>
  <title>Relatório BMO - Template 2</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f5f5f5; }
    h1 { color: #4A6B8A; text-align: center; }
    .report { background: white; padding: 25px; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="report">
    <h1>Relatório Mensal BMO</h1>
    <p>Template corporativo para relatórios mensais BMO.</p>
  </div>
</body>
</html>`,
      3: `<!DOCTYPE html>
<html>
<head>
  <title>Relatório BMO - Template 3</title>
  <style>
    body { font-family: Georgia, serif; color: #333; }
    h1 { color: #5D4037; border-bottom: 2px solid #5D4037; }
    .content { line-height: 1.6; }
  </style>
</head>
<body>
  <h1>Relatório Executivo BMO</h1>
  <div class="content">
    <p>Template para relatórios executivos com estilo formal.</p>
  </div>
</body>
</html>`
    };
    
    setHtmlInput(templates[templateId] || "");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gerador de Relatórios BMO</h1>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-white text-blue-600 rounded-md font-semibold hover:bg-blue-100 transition-colors">
              Login
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Converter HTML para PDF</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="html-input" className="block text-gray-700 font-medium mb-2">
                  Entrada HTML
                </label>
                <textarea
                  id="html-input"
                  className="w-full h-64 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Cole seu código HTML aqui..."
                  value={htmlInput}
                  onChange={(e) => setHtmlInput(e.target.value)}
                ></textarea>
              </div>
              <div className="flex flex-wrap gap-4">
                <button 
                  className={`px-4 py-2 ${isConverting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md font-semibold transition-colors`}
                  onClick={handleConvert}
                  disabled={isConverting}
                >
                  {isConverting ? 'Convertendo...' : 'Converter para PDF'}
                </button>
                <button 
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-semibold hover:bg-gray-300 transition-colors"
                  onClick={handleClear}
                >
                  Limpar
                </button>
                <button 
                  className="px-4 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition-colors"
                  onClick={() => document.getElementById('template-section').scrollIntoView({ behavior: 'smooth' })}
                >
                  Carregar Template
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Pré-visualização
                </label>
                <div className="w-full h-64 border border-gray-300 rounded-md bg-gray-100 flex items-center justify-center">
                  {pdfUrl ? (
                    <div className="text-center">
                      <p className="text-green-600 font-medium">PDF gerado com sucesso!</p>
                      <p className="text-gray-500 mt-2">Arquivo pronto para download</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center">
                      A pré-visualização do PDF aparecerá aqui
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <button 
                  className={`px-4 py-2 ${!pdfUrl ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded-md font-semibold transition-colors`}
                  disabled={!pdfUrl}
                  onClick={() => pdfUrl && window.open(pdfUrl, '_blank')}
                >
                  Baixar PDF
                </button>
                <button 
                  className={`px-4 py-2 ${!pdfUrl ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'} text-white rounded-md font-semibold transition-colors`}
                  disabled={!pdfUrl}
                  onClick={() => {
                    if (pdfUrl) {
                      alert('Funcionalidade de envio por e-mail será implementada em breve!');
                    }
                  }}
                >
                  Enviar por E-mail
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div id="template-section" className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Templates Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-gray-200 h-40 flex items-center justify-center">
                  <span className="text-gray-500">Imagem do Template {item}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg">Template {item}</h3>
                  <p className="text-gray-600 text-sm mt-1">Descrição curta do template {item} para relatórios BMO.</p>
                  <button 
                    className="mt-3 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    onClick={() => handleLoadTemplate(item)}
                  >
                    Usar Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-6 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold">Gerador de Relatórios BMO</h3>
              <p className="text-gray-400 text-sm mt-1">© 2024 Todos os direitos reservados</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Suporte</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Documentação</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contato</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
