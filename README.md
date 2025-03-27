# API de Conversão HTML para PDF

Este projeto fornece uma API simples e eficiente para converter HTML em PDF. Ideal para integração com agentes de IA, chatbots e qualquer aplicação que precise gerar documentos PDF a partir de conteúdo HTML.

## URL da API

A API está disponível em:

```
https://relatorio-bmo.vercel.app/api/convert
```

## Como Usar

A API aceita requisições POST com um corpo JSON contendo o HTML que você deseja converter.

### Exemplo de Requisição

```bash
curl -X POST https://relatorio-bmo.vercel.app/api/convert \
  -H "Content-Type: application/json" \
  -d '{"html": "<html><body><h1>Meu Relatório</h1><p>Conteúdo do relatório</p></body></html>"}'
```

### Parâmetros

- `html` (obrigatório): O código HTML que será convertido para PDF
- `options` (opcional): Configurações de formatação do PDF
  - `format`: Formato do papel (ex: "A4", "Letter")
  - `printBackground`: Se deve imprimir elementos de fundo (true/false)
  - `margin`: Margens do documento (top, right, bottom, left)

### Exemplos

Para ver exemplos completos em várias linguagens de programação, acesse:

```
https://relatorio-bmo.vercel.app/api/test
```

## Limitações

- A API tem um limite de tempo de execução de 60 segundos
- O tamanho máximo do HTML está limitado a 4MB

## Documentação

Para mais informações, visite a [documentação online](https://relatorio-bmo.vercel.app). 