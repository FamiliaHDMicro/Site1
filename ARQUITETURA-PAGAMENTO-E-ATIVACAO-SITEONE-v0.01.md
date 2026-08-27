# SiteOne — arquitetura de pagamento e ativação

**Versão:** 0.01  
**Data de referência:** 27 de agosto de 2026  
**Estado:** proposta aprovada conceitualmente; nenhuma chave, cobrança, bot ou Worker foi configurado.

## Decisão principal

O SiteOne poderá cobrar a implantação e, futuramente, a manutenção mensal pelo Mercado Pago. Um pagamento não será aceito por captura de tela, mensagem do cliente ou simples retorno do navegador. A liberação só ocorre depois que o servidor receber o aviso oficial do Mercado Pago, validar sua assinatura e confirmar que o pagamento está aprovado.

O bot será usado **somente pelo proprietário da HDMicro** como aviso interno. Ele não entrega código ao cliente, não recebe dados de pagamento e não contém a base de clientes.

> O código de ativação é uma chave temporária para liberar um pedido. Não é CPF, telefone, nome, chave de pagamento ou “dados do cliente embaralhados”.

## Papéis de cada parte

| Parte | Faz | Não faz |
|---|---|---|
| Página SiteOne | Mostra planos, coleta pedido, abre checkout e exibe o estado do pedido | Não confirma pagamento; não guarda token privado |
| Servidor próprio | Cria cobrança, recebe aviso, confere pagamento, gera ativação e consulta D1 | Não mostra segredos ao cliente |
| Mercado Pago | Processa o pagamento e avisa sua alteração de status | Não publica sozinho um microsite |
| D1 | Guarda pedido mínimo, situação, referência do pagamento e código armazenado de forma protegida | Não guarda fotos, vídeos, cartão ou segredo |
| R2 | Guarda fotos autorizadas e cópias de segurança, quando essa fase existir | Não substitui o banco de pedidos |
| Bot particular | Avisa apenas o proprietário que existe pedido aprovado ou falha técnica | Não decide pagamento e não entrega código ao cliente |

## Credenciais: o que cada uma significa

| Item | Onde fica | Regra |
|---|---|---|
| Public Key do Mercado Pago | Apenas no trecho público permitido pela integração | Pode ser usada para iniciar o checkout; não aprova pagamento |
| Access Token do Mercado Pago | Segredo do servidor | Nunca vai para o navegador, D1, bot, Git ou conversa |
| Assinatura secreta de Webhook | Segredo do servidor | Confere se o aviso veio mesmo do Mercado Pago |
| Token do bot | Segredo do servidor | Serve apenas para enviar avisos internos |

## Fluxo de ativação proposto

1. O cliente escolhe o plano e envia o pedido. O servidor cria um número interno aleatório, como `S1-2026-8F3K`, e registra o pedido como **aguardando pagamento**.
2. O servidor cria a cobrança no Mercado Pago usando a referência interna do pedido. O navegador segue para o Checkout Pro.
3. O cliente paga. O retorno visual do Mercado Pago pode levar o cliente de volta à página SiteOne, mas esse retorno, sozinho, não libera o pedido.
4. O Mercado Pago envia uma notificação HTTPS de atualização de pagamento ao servidor. O servidor valida a assinatura recebida e consulta o pagamento pelo canal oficial.
5. Se o estado confirmado for **aprovado**, o servidor muda o pedido para **pagamento aprovado**, gera um código aleatório de uso único e registra a data de expiração.
6. A página do cliente consulta apenas o seu pedido por um endereço público temporário e mostra: “Pagamento aprovado. Seu código de ativação é …”.
7. O bot particular recebe somente uma mensagem curta, por exemplo: “SiteOne: pedido S1-2026-8F3K aprovado; código de ativação criado.”

Se o aviso chegar repetido, o servidor reconhece a referência do pagamento e não gera dois códigos. Se houver estorno, reclamação ou cancelamento, o pedido fica bloqueado para revisão manual; nenhuma desativação deve ocorrer sem registro e sem possibilidade de conferir o caso.

## Regra para os três D1

O limite gratuito atual é de até 10 bancos por conta, 500 MB por banco e 5 GB somando todos os bancos da mesma conta. Portanto, usar D1 nº 1, nº 2 e nº 3 ajuda a dividir operações e evitar que uma base individual chegue ao limite, mas não multiplica a cota total gratuita. [1] [2]

O desenho de crescimento é uma divisão por loja, e não uma cópia solta:

| Situação | Ação planejada |
|---|---|
| D1 nº 1 abaixo de 79% | Novas lojas podem ser designadas a ele |
| D1 nº 1 chega a 79% | Registra alerta e o Worker passa a criar **novas lojas** no D1 nº 2 |
| Loja já existente | Continua no D1 no qual nasceu; um mapa diz onde ela está |
| D1 nº 2 chega a 79% | Repete a regra e usa o D1 nº 3 para novas lojas |
| Pedido antigo | Pode ser arquivado em lote depois de teste; nunca transferir pedidos ativos às cegas |

O agendamento apenas chama o Worker para medir e registrar a situação. Ele não deve remover dados automaticamente na primeira versão. O Time Travel do D1 é uma recuperação em ponto no tempo e deve ser usado somente com decisão humana, pois uma restauração sobrescreve dados do banco. [3]

## Dois caminhos possíveis antes de automatizar

| Alternativa | Funcionamento | Pontos positivos | Limites |
|---|---|---|---|
| **Início manual** | A página mostra um link de pagamento. O proprietário confere no painel do Mercado Pago e libera o pedido manualmente. | Menor risco e sem automatizar segredos no começo. Serve para validar se alguém compra. | Não entrega o código sozinho; exige acompanhamento humano. |
| **Integração oficial** | Um servidor cria a cobrança, recebe o Webhook, confirma o pagamento e libera o código automaticamente. | Fluxo profissional, registro de cada etapa e bot interno. | Requer Worker/servidor, D1, segredos protegidos, teste e política de privacidade. |

O primeiro caminho é o mais leve para validar o negócio. O segundo é o caminho adequado quando houver vendas suficientes e condições administrativas para operar pagamentos de forma recorrente. Não há autorização para criar cobrança real, inserir credenciais ou publicar essa integração enquanto o proprietário não confirmar cada passo sensível.

## Dados mínimos guardados

O pedido deve guardar somente o necessário para entregar o serviço: número interno, plano escolhido, nome da loja, contato autorizado, estado do pedido, identificador do pagamento, data, D1 atribuído e situação de ativação. O código de ativação não deve ser guardado em texto simples; o servidor deve guardar uma verificação protegida do código e mostrar o original apenas no momento de geração.

Fotos, vídeos, músicas, cartões, senhas, documentos e tokens não pertencem a essa tabela. Dados de pagamento continuam com o Mercado Pago.

## Teste antes de produção

O primeiro teste deve usar credenciais de teste, sem cobrança real. A própria documentação do Mercado Pago informa que os pagamentos de teste não disparam notificações reais; a recepção de Webhook deve ser conferida pelo simulador de notificações no painel. Só depois do teste de criação, validação, código e aviso interno é que se considera produção. [4]

## Referências

[1] [Cloudflare D1 — Limits](https://developers.cloudflare.com/d1/platform/limits/)  
[2] [Cloudflare D1 — Pricing](https://developers.cloudflare.com/d1/platform/pricing/)  
[3] [Cloudflare D1 — Time Travel and backups](https://developers.cloudflare.com/d1/reference/time-travel/)  
[4] [Mercado Pago — Webhooks](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks)  
[5] [Telegram — Bot API](https://core.telegram.org/bots/api)
