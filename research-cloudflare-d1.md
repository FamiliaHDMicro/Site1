# Pesquisa — Cloudflare D1 para a SiteOne

**Data de referência:** 27 de agosto de 2026.

## Achados confirmados

O Cloudflare D1 é um banco de dados SQL serverless. Para uma aplicação acessá-lo, a documentação oficial exige que um Worker ou uma função de Pages receba um *binding* da base e a consulte por meio desse binding. A página estática do navegador não deve receber credenciais do banco nem executar SQL diretamente.

As consultas devem usar instruções preparadas com valores vinculados. Isso evita que o valor recebido de um formulário seja interpretado como SQL arbitrário.

No plano gratuito, a documentação informa 5 milhões de linhas lidas por dia, 100 mil linhas escritas por dia, até 10 bancos por conta, máximo de 500 MB por banco e 5 GB de armazenamento somando todos os bancos da conta. O D1 não cobra capacidade ociosa e, se um limite diário for ultrapassado, as consultas passam a retornar erro até a renovação do limite. Esse teto é adequado para um protótipo ou uma loja pequena, mas deve existir mensagem de erro amigável e monitoramento.

O D1 oferece criptografia em repouso e em trânsito. Isso não remove a necessidade de minimizar dados pessoais, validar o formulário, limitar acesso administrativo, registrar consentimento e separar a publicação do microsite dos dados de contato do comprador.

## Aplicação recomendada à SiteOne

O navegador deve manter apenas o seletor de módulos e o preview. Ao clicar em “Salvar pedido”, ele enviará uma solicitação HTTPS para um endpoint próprio. Esse endpoint, no Worker, validará os campos e gravará somente os dados mínimos no D1. Fotos, vídeos e músicas não devem ser enviados para o D1; o formulário deve guardar apenas URLs aprovadas, títulos, origem (YouTube ou arquivo do cliente) e estado do pedido.

## Mídia enviada pelo celular

Uma foto selecionada pelo cliente só “vai junto” com o pedido se a loja oferecer um fluxo de upload autorizado. A mídia deve ser armazenada em armazenamento de objetos, não no D1. A documentação do Cloudflare R2 recomenda upload direto do navegador por URL pré-assinada: o servidor gera uma URL temporária para um único objeto e o celular envia o arquivo sem receber a credencial da conta. Essas URLs precisam de validade curta, tipo de arquivo restrito, CORS limitado ao domínio da loja e limite de tamanho no endpoint que as emite.

Na primeira versão, o caminho mais simples é aceitar URLs do YouTube e links que o próprio dono fornece. O YouTube permite incorporar vídeos e oferece modo de privacidade avançada. O cliente deve declarar que tem direito de publicar cada foto, vídeo ou música. Vídeos de terceiros e conteúdo com restrição de idade não devem ser incorporados sem validação.

Uma etapa posterior poderá permitir até três fotos enviadas pelo celular, com tipos JPEG/WebP/PNG, tamanho máximo por foto, varredura de conteúdo, confirmação visual e prazo de exclusão. Não deve existir upload de vídeo ou música na primeira versão: arquivos maiores exigem tratamento e custo próprios.

## Pedidos e impressão em restaurantes

A primeira etapa de valor para lanchonetes deve ser um cardápio responsivo com botão de pedido por WhatsApp. O site pode montar uma mensagem com os itens e abrir o WhatsApp do restaurante; a loja confirma o pedido, escolhe a forma de pagamento e imprime pelo processo que já utiliza. Isso evita prometer integração com impressora antes de conhecer marca, conexão e PDV do estabelecimento.

Impressão térmica automática não deve ser requisito do plano inicial. A API WebUSB do navegador é experimental, não tem disponibilidade ampla e depende de HTTPS e permissão explícita do usuário. Por isso, uma integração direta com impressora precisaria de teste por modelo e navegador ou de um serviço/PDV dedicado. Ela é um adicional profissional, nunca uma função garantida no celular do consumidor.

## Taxas de marketplace: afirmação que pode ser usada com precisão

Não é correto afirmar que todos os restaurantes “perdem 30%”. A tabela pública do iFood para parceiros, atualizada em março de 2026, informa no Plano Básico 12% de comissão e 3,2% de pagamento online para pedidos pagos na plataforma; no Plano Entrega, 23% de comissão e 3,5% de pagamento online. Há mensalidades condicionadas ao volume de vendas, e os valores podem variar por região, categoria e modelo logístico. Assim, uma frase comercial honesta é: “Em determinados modelos de entrega e pagamento, as taxas podem se aproximar de 26,5% do pedido; consulte seu contrato e painel financeiro.”

## Cron, três bancos e backup

Cloudflare Cron Triggers pode chamar um Worker em horários definidos, pelo método `scheduled()`. Os horários são em UTC e uma alteração de agenda pode levar alguns minutos para se propagar. Essa ferramenta é adequada para tarefas periódicas, mas não substitui uma estratégia de cópia, validação e recuperação.

Para o SiteOne, três bancos D1 podem ser usados futuramente como uma divisão planejada de dados, mas não como uma multiplicação da cota gratuita. Uma regra de 79% pode fazer sentido para o limite individual de 500 MB do D1 nº 1: o Worker marca a base como perto da capacidade e passa a designar novas lojas a outra base, ou arquiva dados antigos depois de teste. Porém, mover ou copiar dados para o D1 nº 2 continua contando na cota total de 5 GB da mesma conta. O recomendado no início é um D1 principal para dados operacionais, identificador único por pedido, mapa de localização e cópia de segurança para R2. O D1 oferece Time Travel automático e recuperação em ponto no tempo: até sete dias no plano gratuito e trinta dias no plano pago, quando disponível no armazenamento de produção. Restaurar substitui os dados existentes e cancela consultas em andamento; por isso, uma restauração nunca deve ser automática.

Uma cópia mensal ou diária em R2 pode ser criada por Workflow/Cron depois de existir operação real, com logs, verificação de sucesso e teste de restauração. Replicar pedidos para três D1 exige regras de origem, versão, conflito e exclusão; sem essas regras, gera duplicidade e risco de perda. O primeiro desenho escalável deve manter uma única base de escrita por loja: o Worker usa o mapa de localização para enviar cada nova loja à base atribuída. O 79% primeiro gera alerta; apenas após testes pode gerar arquivamento em pequenos lotes ou designação de novas lojas a outra base.

## Fontes oficiais

1. Cloudflare D1 — Getting started: https://developers.cloudflare.com/d1/get-started/
2. Cloudflare D1 — Workers Binding API: https://developers.cloudflare.com/d1/worker-api/
3. Cloudflare D1 — Pricing: https://developers.cloudflare.com/d1/platform/pricing/
4. Cloudflare D1 — Data security: https://developers.cloudflare.com/d1/reference/data-security/
5. Cloudflare R2 — Upload objects: https://developers.cloudflare.com/r2/objects/upload-objects/
6. Cloudflare R2 — Presigned URLs: https://developers.cloudflare.com/r2/api/s3/presigned-urls/
7. Cloudflare R2 — Data security: https://developers.cloudflare.com/r2/reference/data-security/
8. YouTube Help — Incorporar vídeos e playlists: https://support.google.com/youtube/answer/171780?hl=pt-BR
9. iFood para Parceiros — Planos iFood: https://blog-parceiros.ifood.com.br/planos-ifood/
10. iFood para Parceiros — Taxas do iFood: https://blog-parceiros.ifood.com.br/taxas-ifood/
11. MDN — WebUSB API: https://developer.mozilla.org/en-US/docs/Web/API/WebUSB_API
12. Cloudflare D1 — Time Travel and backups: https://developers.cloudflare.com/d1/reference/time-travel/
13. Cloudflare Workers — Cron Triggers: https://developers.cloudflare.com/workers/configuration/cron-triggers/
14. Cloudflare D1 — Import and export data: https://developers.cloudflare.com/d1/best-practices/import-export-data/
15. Cloudflare Workflows — Export and save D1 database: https://developers.cloudflare.com/workflows/examples/backup-d1/
16. Cloudflare D1 — Limits: https://developers.cloudflare.com/d1/platform/limits/
