# SiteOne — arquitetura móvel e precificação inicial

**Data de referência:** 27 de agosto de 2026.

## Proposta confirmada

O SiteOne é uma loja web: a pessoa abre no celular, escolhe módulos, preenche um briefing e monta o pedido de microsite. Ela não instala aplicativo, não baixa programa e não precisa saber programar. O “terminal” deve ser um formulário guiado e objetivo, não uma inteligência artificial que toma decisões pelo cliente.

## O que o Cloudflare D1 pode e não pode fazer

O Cloudflare D1 pode guardar os dados estruturados do pedido, como nome do negócio, telefone comercial, nicho, módulos escolhidos, URLs de mídia, status do pedido e consentimento. Ele não deve receber diretamente fotos, vídeos ou músicas.

Para o navegador salvar um pedido no D1, é necessário um endpoint de servidor em um Cloudflare Worker ou Pages Function. O navegador não pode receber chave do banco, credencial do Cloudflare ou acesso SQL direto. O endpoint deve validar cada campo, limitar frequência de pedidos e usar consultas preparadas.

## Duas opções viáveis

| Opção | Como o cliente usa | Dados guardados | Custo inicial | Limite |
| --- | --- | --- | --- | --- |
| 1. Montador sem cadastro | Escolhe módulos e copia/envia o resumo pelo WhatsApp | Nenhum dado persistido pelo SiteOne | R$ 0,00 | O pedido não volta automaticamente ao painel |
| 2. Montador com pedido salvo | Escolhe módulos e salva o pedido para acompanhamento | Dados mínimos no D1 por endpoint próprio | Pode começar no plano gratuito do D1 | Exige Worker, binding, autorização e política de privacidade |

Para a primeira versão, a opção 1 é o caminho mais simples. A opção 2 deve ser habilitada somente depois de a conta Cloudflare, o banco, o Worker e as regras de privacidade estarem definidos.

## Dados mínimos sugeridos para um pedido salvo

- Identificador do pedido;
- Nome comercial do cliente e segmento;
- Nome e contato de atendimento fornecidos pelo próprio cliente;
- Módulos escolhidos e pacote selecionado;
- Links de mídias aprovadas pelo cliente;
- Estado do pedido: rascunho, recebido, em revisão, aprovado ou entregue;
- Data/hora de criação e registro de consentimento.

Não salvar senhas, documentos pessoais, cartões, chaves de API, conversas inteiras ou arquivos de mídia no D1.

## Regras de vídeos, fotos e músicas

Na primeira versão, o SiteOne deve aceitar somente **URLs de vídeos do YouTube** ou links de mídias que o próprio dono declara possuir direito de uso. Fotos e vídeos enviados como arquivo exigem armazenamento próprio de objetos, como Cloudflare R2, e regras de tamanho, formatos, prazo de retenção e direitos autorais. Esse é um recurso futuro e não pertence ao D1.

Para vídeos do YouTube, a página deverá usar o modo de privacidade reforçada quando aplicável e carregar o player apenas após interação do visitante. O cliente continua responsável por ter direito de publicar a mídia e por respeitar as regras da plataforma.

## Avaliação de preço

O valor de **R$ 29,00** é defensável somente como preço de entrada para um microsite autoatendido e padronizado: cliente preenche tudo, fornece os links, escolhe módulos já prontos e recebe uma revisão limitada. Nesse preço não entram produção de foto/vídeo/música, cadastro manual extenso de cardápio, domínio, hospedagem externa, SEO avançado, integrações de pagamento, atendimento contínuo ou alterações ilimitadas.

Para restaurante ou lanchonete, o mesmo R$ 29,00 fica baixo se incluir cardápio configurado manualmente, fotos organizadas, QR Code, pedidos por WhatsApp, horários, localização, revisão humana e suporte. Referências comerciais públicas variam muito: um fornecedor de cardápio digital cita R$ 150–R$ 400 para cardápio simples, enquanto outro anuncia sites de restaurante a partir de R$ 850; esses números são anúncios de terceiros, não tabela oficial de mercado.

Uma oferta inicial honesta pode ser:

| Oferta | Faixa recomendada | Inclui |
| --- | ---: | --- |
| SiteOne Base | R$ 29,00 | Montagem autoatendida, módulos prontos, até 3 fotos, 2 vídeos por link e 1 música por link; uma revisão curta |
| SiteOne Restaurante Essencial | R$ 59,00–R$ 79,00 | Seis módulos gastronômicos, cardápio enxuto preenchido pelo cliente, botão de pedido por WhatsApp, localização e horários |
| Configuração assistida | Sob orçamento | Cadastro manual, muitos itens, fotos tratadas, QR Code, mídia por arquivo, domínio, suporte ou integrações adicionais |

Antes de divulgar, a página deve mostrar o que está incluído, o que é extra, prazo de entrega, quantidade de revisões, política de conteúdo e responsável pelo domínio/hospedagem.

## Fontes

1. Cloudflare D1 — Getting started: https://developers.cloudflare.com/d1/get-started/
2. Cloudflare D1 — Workers Binding API: https://developers.cloudflare.com/d1/worker-api/
3. Cloudflare D1 — Pricing: https://developers.cloudflare.com/d1/platform/pricing/
4. Cloudflare D1 — Data security: https://developers.cloudflare.com/d1/reference/data-security/
5. MenuHub — Quanto cobrar por cardápio digital: https://menuhub.site/noticia/quanto-cobrar-para-fazer-um-cardapio-digital-menuhub-pro-
6. Creaun.app — Quanto custa site para restaurantes no Brasil: https://www.creaun.app/pt/blog/quanto-custa-site-para-restaurantes-brasil
7. Goomer — Quanto custa um cardápio digital: https://goomer.com.br/blog/quanto-custa-um-cardapio-digital
