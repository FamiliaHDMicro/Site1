# Auditoria somente-leitura — SiteOne histórico

> **Escopo:** cópia local e superficial do repositório público `FamiliaHDMicro/Site1`, commit `5542797` de 27/08/2026. Nenhum arquivo do repositório remoto ou Worker Cloudflare foi alterado, executado ou publicado durante esta análise.

O SiteOne histórico apresenta uma primeira ideia válida: uma página curta conduz o cliente a um painel onde ele escolheria um modelo e informaria mídia. A versão atual da HDMicro preserva esse objetivo, porém com módulos mais claros, regras comerciais, experiência móvel e sem prometer automação que ainda não existe.

| Arquivo histórico | O que pretendia fazer | Situação encontrada | Decisão |
|---|---|---|---|
| `index.html` | Apresentar 12 modelos e levar ao painel | Página visual simples, sem dados, pedidos ou pagamento | Preservar apenas a ideia de entrada direta e montagem pelo celular |
| `painel.html` | Enviar template, foto, música e vídeo ao Worker | O trecho começa no script; não há formulário completo visível. A chamada aponta para `https://workers.dev`, sem nome do Worker nem rota válida | Não reaproveitar o código; reconstruir no SiteOne atual |
| `functions/ver.js` | Buscar um microsite por identificador e mostrar mídia | A URL `https://workers.dev{id}` está incompleta e a resposta externa é inserida com `innerHTML` | Não reaproveitar; construir leitura validada e escapada no servidor |

## Riscos e correções necessárias

O painel histórico não contém uma integração real de pagamento, D1 ou Mercado Pago. Ele apenas tenta fazer uma requisição `POST` para um endereço genérico de Worker e espera receber um `link`. Esse endereço não identifica o Worker SiteOne, não controla origem, não valida os campos enviados e não trata consentimento de mídia. Portanto, o código não deve ser usado como base de produção ou teste de pagamento.

O script de visualização também coloca dados retornados por uma fonte externa dentro de `innerHTML`. Se a resposta fosse adulterada, conteúdo malicioso poderia ser apresentado ao visitante. A nova implementação deverá renderizar texto e links validados no React, sem inserir HTML arbitrário.

| Item | Regra para a versão atual |
|---|---|
| Cardápio | Dados validados, tamanho limitado e preços em centavos no servidor |
| Foto, música e vídeo | Apenas links autorizados nesta fase; nenhum binário no banco |
| Pagamento | Exclusivamente credenciais de teste, Access Token no servidor e confirmação oficial do Mercado Pago |
| Código de ativação | Aleatório, temporário, de uso único e sem dados pessoais codificados |
| Worker histórico | Mantido como referência; não será ativado ou alterado sem autorização específica |

## Conclusão

A ideia original é aproveitável; a implementação histórica precisa ser substituída. O SiteOne atual será a base única para planos gastronômicos, wizard de 12 a 20 itens e fluxo de pagamento em teste. O painel e Worker antigos permanecem como material histórico até uma auditoria separada e autorização explícita para qualquer alteração no Cloudflare.

## Referência

[1] [Repositório histórico Site1](https://github.com/FamiliaHDMicro/Site1)
