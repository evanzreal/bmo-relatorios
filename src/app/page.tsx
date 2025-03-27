"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [exampleCode, setExampleCode] = useState<{ [key: string]: string }>({});
  const [selectedTab, setSelectedTab] = useState("curl");
  
  useEffect(() => {
    // Buscar exemplos do endpoint de teste
    fetch('/api/test')
      .then(res => res.json())
      .then(data => {
        setExampleCode(data.examples || {});
      })
      .catch(err => console.error('Erro ao buscar exemplos:', err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-6 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">API de Conversão HTML para PDF</h1>
          <p className="mt-2 text-blue-100">Transforme HTML em PDF facilmente via API</p>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Como usar</h2>
          
          <div className="prose max-w-none">
            <p>
              Esta API permite converter código HTML em documentos PDF de alta qualidade.
              É ideal para integração com agentes de IA, automações ou qualquer aplicação
              que precise gerar documentos PDF dinamicamente.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-2">Endpoint</h3>
            <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
              POST /api/convert
            </div>
            
            <h3 className="text-xl font-semibold mt-6 mb-2">Requisição</h3>
            <p>Envie uma requisição POST com um corpo JSON contendo o seguinte:</p>
            <pre className="bg-gray-100 p-3 rounded-md font-mono text-sm overflow-auto">
{`{
  "html": "Seu código HTML aqui",
  "options": {
    "format": "A4",
    "printBackground": true,
    "margin": {
      "top": "40px",
      "right": "40px",
      "bottom": "40px",
      "left": "40px"
    }
  }
}`}
            </pre>
            
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Exemplo</h3>
              
              <div className="border-b border-gray-200 mb-4">
                <nav className="-mb-px flex space-x-4">
                  <button
                    onClick={() => setSelectedTab("curl")}
                    className={`py-2 px-4 font-medium ${selectedTab === "curl" 
                      ? "border-b-2 border-blue-500 text-blue-600" 
                      : "text-gray-500 hover:text-gray-700"}`}
                  >
                    cURL
                  </button>
                  <button
                    onClick={() => setSelectedTab("fetch")}
                    className={`py-2 px-4 font-medium ${selectedTab === "fetch" 
                      ? "border-b-2 border-blue-500 text-blue-600" 
                      : "text-gray-500 hover:text-gray-700"}`}
                  >
                    JavaScript
                  </button>
                  <button
                    onClick={() => setSelectedTab("python")}
                    className={`py-2 px-4 font-medium ${selectedTab === "python" 
                      ? "border-b-2 border-blue-500 text-blue-600" 
                      : "text-gray-500 hover:text-gray-700"}`}
                  >
                    Python
                  </button>
                  <button
                    onClick={() => setSelectedTab("nodejs")}
                    className={`py-2 px-4 font-medium ${selectedTab === "nodejs" 
                      ? "border-b-2 border-blue-500 text-blue-600" 
                      : "text-gray-500 hover:text-gray-700"}`}
                  >
                    Node.js
                  </button>
                </nav>
              </div>
              
              <pre className="bg-gray-100 p-3 rounded-md font-mono text-sm overflow-auto h-96">
                {exampleCode[selectedTab] || "Carregando exemplo..."}
              </pre>
            </div>
            
            <h3 className="text-xl font-semibold mt-6 mb-2">Resposta</h3>
            <p>A API retorna diretamente o arquivo PDF com o cabeçalho <code>Content-Type: application/pdf</code>.</p>
            
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Testar a API</h3>
              <p className="mb-4">
                Para testar a API, você pode usar o endpoint de exemplo que retorna um PDF de amostra:
              </p>
              <button 
                onClick={() => window.open('/api/convert', '_blank')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors"
              >
                Gerar PDF de Exemplo
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold">API de Conversão HTML para PDF</h3>
              <p className="text-gray-400 text-sm mt-1">© 2024 Todos os direitos reservados</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 