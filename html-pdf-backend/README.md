# API de Conversão HTML para PDF

Este serviço converte código HTML em documentos PDF através de APIs externas especializadas.

## Por que usar APIs externas?

Enfrentamos um problema comum em ambientes serverless (Vercel, AWS Lambda, etc): a falta de suporte adequado para o Chromium/Puppeteer devido a dependências de sistema ausentes (como `libnss3.so`). Após várias tentativas de configuração direta, optamos por uma solução mais confiável que usa serviços especializados.

## Como funciona

1. Recebemos o HTML via requisição POST
2. Enviamos o HTML para um serviço externo especializado em conversão
3. Recebemos o PDF e o encaminhamos para o cliente

## Configuração para Produção

Para usar em produção, você deve configurar uma API externa de PDF. Recomendamos:

- [PDFShift](https://pdfshift.io) - Plano gratuito disponível
- [API2PDF](https://www.api2pdf.com) - Plano de pagamento por uso
- [DocRaptor](https://docraptor.com) - Plano de desenvolvimento gratuito

Configure as seguintes variáveis de ambiente na Vercel:
- `PDF_API_URL`: URL da API escolhida
- `PDF_API_KEY`: Sua chave de API

### Modo de Demonstração

Se nenhuma chave for fornecida, o sistema usará um serviço de demonstração limitado (apenas para fins de teste, não adequado para produção).

## Como usar

```bash
# Enviar HTML para conversão
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"htmlContent":"<html><body><h1>Exemplo</h1></body></html>"}' \
  https://bmo-relatorios.vercel.app/convert \
  --output documento.pdf
```

## Endpoints

- `GET /` - Página inicial
- `GET /status` - Status da API
- `POST /convert` - Converte HTML para PDF 