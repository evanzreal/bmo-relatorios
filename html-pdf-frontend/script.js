// Espera o DOM estar pronto e o objeto Telegram.WebApp estar disponível
document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;

    // --- URL DO SEU BACKEND ---
    // Durante o desenvolvimento local (usando o servidor local)
    // const BACKEND_URL = 'http://localhost:3000/convert';
    
    // Após o deploy na Vercel (substitua pelo seu domínio real)
    const BACKEND_URL = 'https://seu-projeto-vercel.vercel.app/convert';
    // --------------------------

    const htmlInput = document.getElementById('htmlInput');
    const convertButton = document.getElementById('convertButton');
    const statusDiv = document.getElementById('status');

    // Informa ao Telegram que o App está pronto para ser exibido
    tg.ready();

    // (Opcional) Configura o botão principal do Telegram se quiser usá-lo
    // tg.MainButton.setText('Converter');
    // tg.MainButton.onClick(() => handleConversion());
    // tg.MainButton.show();

    // Adiciona evento ao botão HTML
    convertButton.addEventListener('click', handleConversion);

    async function handleConversion() {
        const htmlContent = htmlInput.value.trim();

        if (!htmlContent) {
            statusDiv.textContent = 'Erro: Por favor, insira algum conteúdo HTML.';
            // (Opcional) Mostrar alerta nativo
            // tg.showAlert('Por favor, insira algum conteúdo HTML.');
            return;
        }

        // Desabilita o botão e mostra status
        convertButton.disabled = true;
        statusDiv.textContent = 'Convertendo... Por favor, aguarde.';
        // (Opcional) Mostrar progresso no botão principal
        // tg.MainButton.showProgress();

        try {
            console.log('Enviando HTML para:', BACKEND_URL);
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ htmlContent: htmlContent }),
            });

            console.log('Resposta recebida. Status:', response.status);

            if (response.ok) {
                statusDiv.textContent = 'Conversão iniciada. O download do PDF começará em breve.';
                // O download é tratado pelo navegador por causa dos headers 'Content-Disposition'
                // Se quiséssemos o blob para fazer algo mais: const blob = await response.blob();

                // Forçar o download (alternativa se 'Content-Disposition' falhar em algum caso)
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'converted.pdf'; // Nome do arquivo para download
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
                statusDiv.textContent = 'PDF pronto para download!';


            } else {
                // Tenta ler a mensagem de erro do backend
                const errorText = await response.text();
                console.error('Erro do backend:', errorText);
                statusDiv.textContent = `Erro na conversão: ${response.status} - ${errorText || 'Erro desconhecido'}`;
                tg.showAlert(`Erro na conversão: ${response.status} - ${errorText || 'Erro desconhecido'}`);
            }

        } catch (error) {
            console.error('Erro na requisição fetch:', error);
            statusDiv.textContent = `Erro de rede ao tentar converter: ${error.message}`;
            tg.showAlert(`Erro de rede ao tentar converter: ${error.message}`);
        } finally {
            // Reabilita o botão e esconde progresso
            convertButton.disabled = false;
            // tg.MainButton.hideProgress();
            // tg.MainButton.enable(); // Se estiver usando o botão principal
        }
    }
}); 