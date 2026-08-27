# SiteOne para lanchonetes e pequenos restaurantes

## Decisão de produto

O SiteOne pode começar focado em lanchonetes e pequenos restaurantes. O cliente abre o montador pelo celular, escolhe o pacote, preenche os dados e recebe um microsite que leva o consumidor ao cardápio e ao pedido direto pelo WhatsApp. O objetivo inicial não é substituir um iFood, um PDV ou uma impressora: é dar ao pequeno negócio uma vitrine própria, simples e compreensível.

## Pacote gastronômico essencial

| Módulo | Função |
| --- | --- |
| Capa do restaurante | Nome, foto principal, chamada e botão de pedido |
| Cardápio organizado | Categorias, preço, descrição e observação do item |
| Pedido pelo WhatsApp | Monta uma mensagem e abre o contato oficial da loja |
| Horários e localização | Mostra horário, endereço e link de mapa informado pelo dono |
| Combos e promoções | Espaço para ofertas definidas pelo próprio estabelecimento |
| Galeria e vídeos | Fotos autorizadas e links de YouTube fornecidos pelo dono |

## Fluxo no celular

O montador deve pedir dados em pequenas etapas: identificação do negócio, pacote, módulos, cardápio, mídias, contato e revisão. Cada foto precisa mostrar o aviso de que só será enviada com autorização do dono. O pedido poderá ser copiado ou enviado ao WhatsApp antes de existir banco de dados. Quando o D1 estiver autorizado, o mesmo formulário poderá salvar apenas os dados necessários e o status do pedido.

## Fotos, vídeos e músicas

| Tipo | Primeira versão | Versão futura |
| --- | --- | --- |
| Fotos | Link fornecido ou até três fotos, com autorização explícita | Upload ao R2 por URL temporária, com limite de tamanho e prazo de exclusão |
| Vídeos | Link do YouTube incorporado em modo de privacidade avançada | Arquivo próprio em armazenamento separado, sob orçamento |
| Música | Link fornecido e declaração de direitos | Biblioteca licenciada ou trilha contratada |

O D1 não deve guardar os arquivos; ele guarda apenas os metadados e os links. O proprietário do restaurante declara ter direito de publicar o conteúdo enviado.

## Pedidos e impressão: ordem certa

1. O consumidor escolhe produtos e envia o pedido pelo WhatsApp da loja.
2. A loja confirma o pedido e usa o processo de impressão que já possui.
3. Só após validar esse fluxo será estudada integração com impressora ou PDV.

Uma página no navegador não deve prometer imprimir automaticamente em qualquer impressora térmica. Isso depende do modelo de impressora, navegador, sistema da loja e possível PDV. WebUSB não tem disponibilidade ampla e é experimental; portanto, integração de impressão será um módulo adicional testado por estabelecimento.

## Precificação inicial proposta

| Oferta | Preço sugerido | Limite claro |
| --- | ---: | --- |
| SiteOne Base | R$ 29,00 | Montagem padrão, cliente fornece conteúdo, até 3 fotos, 2 vídeos por link, 1 música por link e uma revisão curta |
| SiteOne Restaurante Essencial | R$ 59,00–R$ 79,00 | Seis módulos, cardápio enxuto preenchido pelo cliente, WhatsApp, horários, localização e revisão limitada |
| Configuração assistida | Sob orçamento | Cadastro manual extenso, QR Code, domínio, hospedagem, mídia por arquivo, impressão, PDV, SEO e suporte recorrente |

O preço de R$ 29,00 não deve incluir trabalho manual extenso. Para o restaurante, o preço especial só faz sentido se o cliente preencher seu próprio cardápio e fornecer todo o material. Se a HDMicro fizer a coleta, organização e revisão de muitos itens, o serviço precisa ser cotado separadamente.

## Mensagem comercial honesta

Evitar: “pare de perder 30% no iFood”.

Preferir: “Tenha um cardápio próprio e um canal de pedido direto. Em alguns planos de entrega e pagamento, as taxas de marketplace podem se aproximar de 26,5% do pedido; consulte seu contrato e mantenha seu canal próprio como complemento.”

Essa frase reconhece que marketplaces também entregam visibilidade, pagamento e logística. O SiteOne não promete substituir esses serviços; ele ajuda o pequeno negócio a ter presença direta, link próprio e contato com seus clientes.

## Antes de ativar D1/R2

É necessário aprovar a conta Cloudflare responsável, o Worker que receberá pedidos, o banco D1, a política de privacidade, o prazo de retenção, os limites de upload e o responsável pelo atendimento. Nenhum segredo ou chave do Cloudflare deve aparecer no navegador.
