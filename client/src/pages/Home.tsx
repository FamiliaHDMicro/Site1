/**
 * SiteOne — Oficina Editorial Azul: uma bancada de montagem de microsites
 * clara, técnica e acolhedora. A estação de ativação é um fluxo local de demonstração,
 * com azul HDMicro, papel quente e laranja gastronômico — sem pagamento ou dados externos.
 */
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  CalendarDays,
  Camera,
  Check,
  ClipboardCheck,
  CircleHelp,
  Clock3,
  Copy,
  FileText,
  Image as ImageIcon,
  KeyRound,
  MapPin,
  MessageCircle,
  Music2,
  PhoneCall,
  Play,
  RotateCcw,
  Share2,
  ShieldCheck,
  Sparkles,
  Store,
  UtensilsCrossed,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import GastronomyStudio from "@/components/GastronomyStudio";
import TemplatePicker, { type TemplateChoice } from "@/components/TemplatePicker";
import TestCheckoutPanel from "@/components/TestCheckoutPanel";

type Module = {
  code: string;
  name: string;
  description: string;
  Icon: LucideIcon;
};

type ActivationStage = "idle" | "waiting" | "active";

type RestaurantPlan = {
  id: string;
  label: string;
  implementation: string;
  monthly: string;
  itemLimit: number;
  changes: string;
  detail: string;
};

type MenuItem = {
  id: string;
  category: string;
  name: string;
  description: string;
  price: string;
  available: boolean;
};

const generalModules: Module[] = [
  { code: "M01", name: "Capa de impacto", description: "Apresentação direta do negócio", Icon: Sparkles },
  { code: "M02", name: "Contato rápido", description: "Botões e caminhos de contato", Icon: MessageCircle },
  { code: "M03", name: "Localização", description: "Mapa, endereço e como chegar", Icon: MapPin },
  { code: "M04", name: "Galeria de fotos", description: "Espaço para fotos do negócio", Icon: Camera },
  { code: "M05", name: "Vídeo de apresentação", description: "Vídeo fornecido pelo cliente", Icon: Video },
  { code: "M06", name: "Trilha ou música", description: "Música licenciada pelo cliente", Icon: Music2 },
  { code: "M07", name: "Serviços e ofertas", description: "O que o negócio faz e vende", Icon: Store },
  { code: "M08", name: "Sobre o negócio", description: "História, propósito e diferenciais", Icon: FileText },
  { code: "M09", name: "Horários", description: "Rotina de atendimento atualizada", Icon: Clock3 },
  { code: "M10", name: "Agendamento", description: "Link ou orientação de reserva", Icon: CalendarDays },
  { code: "M11", name: "Redes sociais", description: "Atalhos para os canais do cliente", Icon: Share2 },
  { code: "M12", name: "Dúvidas frequentes", description: "Respostas para as perguntas comuns", Icon: CircleHelp },
];

const foodModules: Module[] = [
  { code: "F01", name: "Cardápio digital", description: "Pratos, lanches e categorias", Icon: UtensilsCrossed },
  { code: "F02", name: "Pedido por mensagem", description: "Caminho para o contato informado", Icon: MessageCircle },
  { code: "F03", name: "Combos e novidades", description: "Área para promoções do dia", Icon: Sparkles },
  { code: "F04", name: "Retirada ou entrega", description: "Como pedir e receber", Icon: Store },
  { code: "F05", name: "Reservas", description: "Orientação para mesas e eventos", Icon: CalendarDays },
  { code: "F06", name: "Horário e mapa", description: "Endereço, mapa e funcionamento", Icon: MapPin },
];

const plans = [
  {
    id: "base",
    label: "Plano-base",
    price: "R$ 29,00",
    extra: "Entrada",
    total: "3 fotos · 2 vídeos · 1 música",
    detail: "A base para colocar seu negócio no ar com uma página objetiva.",
  },
  {
    id: "up1",
    label: "Upgrade 01",
    price: "+ R$ 9,00",
    extra: "Amplie imagens",
    total: "5 fotos · 2 vídeos · 2 músicas",
    detail: "Acrescenta 2 fotos e 1 música ao plano-base.",
  },
  {
    id: "up2",
    label: "Upgrade 02",
    price: "+ R$ 15,00",
    extra: "Amplie conteúdo",
    total: "6 fotos · 3 vídeos · 2 músicas",
    detail: "Acrescenta 3 fotos, 1 vídeo e 1 música ao plano-base.",
  },
];

function jumpTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState("base");
  const [chosenTemplate, setChosenTemplate] = useState<TemplateChoice | null>(null);
  const [selectedModules, setSelectedModules] = useState<string[]>([
    "Capa de impacto",
    "Contato rápido",
    "Localização",
  ]);
  const [projectName, setProjectName] = useState("");
  const [menuRange, setMenuRange] = useState("Até 12 itens");
  const [videoSource, setVideoSource] = useState("Link do YouTube");
  const [activationStage, setActivationStage] = useState<ActivationStage>("idle");
  const [simulationReference, setSimulationReference] = useState("");
  const [simulationCode, setSimulationCode] = useState("");

  const activePlan = plans.find((plan) => plan.id === selectedPlan) ?? plans[0];
  const allModules = useMemo(() => [...generalModules, ...foodModules], []);
  const chosenModules = allModules.filter((module) => selectedModules.includes(module.name));

  const toggleModule = (name: string) => {
    setSelectedModules((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name],
    );
  };

  const copyBriefing = async () => {
    const brief = [
      "BRIEFING SITEONE — HDMICRO",
      `Negócio: ${projectName.trim() || "a definir"}`,
      `Template: ${chosenTemplate?.label || "a definir"}`,
      `Família: ${chosenTemplate?.family || "a definir"}`,
      chosenTemplate?.price ? `Valor OneFood: ${chosenTemplate.price}` : "Valor: a definir conforme o template escolhido",
      chosenTemplate?.limit ? `Limites OneFood: ${chosenTemplate.limit}` : "Conteúdo: preencher conforme o template escolhido",
      `Vídeo informado: ${videoSource}`,
      "Observação: este texto é um pedido de orçamento. Nenhum envio automático foi realizado.",
    ].join("\n");

    try {
      await navigator.clipboard.writeText(brief);
      toast.success("Briefing copiado. Nenhum pedido foi enviado automaticamente.");
    } catch {
      toast.error("Não foi possível copiar agora. Tente novamente.");
    }
  };

  const createSimulation = () => {
    if (!projectName.trim()) {
      toast.error("Informe o nome do negócio antes de criar a simulação.");
      jumpTo("montagem");
      return;
    }

    const reference = `S1-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    setSimulationReference(reference);
    setSimulationCode("");
    setActivationStage("waiting");
    toast.success("Pedido de demonstração criado apenas neste navegador.");
  };

  const confirmSimulation = () => {
    const code = `SITE-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    setSimulationCode(code);
    setActivationStage("active");
    toast.success("Ativação simulada concluída. Nenhum pagamento foi consultado.");
  };

  const copySimulationCode = async () => {
    if (!simulationCode) return;
    try {
      await navigator.clipboard.writeText(simulationCode);
      toast.success("Código de demonstração copiado.");
    } catch {
      toast.error("Não foi possível copiar agora. Tente novamente.");
    }
  };

  const resetSimulation = () => {
    setActivationStage("idle");
    setSimulationReference("");
    setSimulationCode("");
    toast.message("A simulação foi limpa deste navegador.");
  };

  return (
    <div className="siteone-page">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="SiteOne por HDMicro">
          <img src="/manus-storage/hdmicro-mark_1af1da9e.png" alt="" className="brand-mark" />
          <span className="brand-word"><b>HD</b>Micro</span>
          <span className="brand-product">SiteOne <i>microsites</i></span>
        </a>
        <nav className="topnav" aria-label="Navegação principal">
          <a href="#templates">Templates</a>
          <a href="#templates">OneFood</a>
          <a href="#ativacao">Simulação</a>
          <a href="#regras">Regras</a>
        </nav>
        <button className="nav-cta" type="button" onClick={() => jumpTo("templates")}>
          Escolher template <ArrowDownRight size={17} />
        </button>
      </header>

      <main id="inicio">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow light"><span /> SITEONE / MICROSITES MODULARES</p>
              <h1 id="hero-title">O site certo para a <em>próxima venda.</em></h1>
              <p className="hero-text">
                Em vez de um pacote genérico, você escolhe as peças que fazem sentido para o seu negócio.
                A HDMicro organiza a montagem do seu microsite com regras claras.
              </p>
              <div className="hero-actions">
                <button className="primary-btn" type="button" onClick={() => jumpTo("templates")}>
                  Escolher template <ArrowDownRight size={19} />
                </button>
                <button className="text-btn" type="button" onClick={() => jumpTo("templates")}>
                  Tenho restaurante <ArrowUpRight size={17} />
                </button>
              </div>
              <div className="hero-notes">
                <span><BadgeCheck size={16} /> Sem promessa escondida</span>
                <span><BadgeCheck size={16} /> Briefing copiável</span>
                <span><BadgeCheck size={16} /> Conteúdo contado</span>
              </div>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="hero-blueprint">
                <div className="blueprint-topline"><span>MAPA DE MONTAGEM / 01</span><span>HDM · BR</span></div>
                <div className="blueprint-canvas">
                  <div className="blueprint-piece piece-copy"><span>M01</span><b>CAPA</b><small>mensagem</small></div>
                  <div className="blueprint-piece piece-media"><span>M04</span><b>FOTO</b><small>imagem</small></div>
                  <div className="blueprint-piece piece-contact"><span>M02</span><b>CONTATO</b><small>conexão</small></div>
                  <div className="blueprint-piece piece-map"><span>M03</span><b>MAPA</b><small>chegada</small></div>
                  <span className="blueprint-arrow arrow-a">→</span>
                  <span className="blueprint-arrow arrow-b">→</span>
                  <span className="blueprint-arrow arrow-c">↓</span>
                  <div className="blueprint-pin"><MapPin size={26} /></div>
                  <div className="blueprint-note note-a">peças que<br />viram caminho</div>
                  <div className="blueprint-note note-b">selecione<br />o necessário</div>
                </div>
                <div className="blueprint-footer"><span>ESCOLHA</span><i /> <span>COMBINE</span><i /> <span>PUBLIQUE</span></div>
              </div>
            </div>
          </div>
          <div className="hero-ruler" aria-label="Etapas do processo">
            <span>01 <b>Escolha</b></span>
            <span>02 <b>Combine</b></span>
            <span>03 <b>Publique</b></span>
            <span className="ruler-caption">PÁGINA DIRETA. ESCOLHAS CLARAS.</span>
          </div>
        </section>

        <section className="process-section" aria-labelledby="process-title">
          <div className="section-intro process-intro">
            <p className="eyebrow"><span /> COMO FUNCIONA</p>
            <h2 id="process-title">Menos enrolação.<br /><em>Mais decisão.</em></h2>
          </div>
          <div className="process-steps">
            <article>
              <span className="step-number">01</span>
              <h3>Mostre o objetivo</h3>
              <p>Você diz o que precisa: apresentar, vender, receber pedidos ou facilitar o contato.</p>
            </article>
            <article>
              <span className="step-number">02</span>
              <h3>Escolha as peças</h3>
              <p>Monte a página com módulos prontos. O resumo mostra exatamente o que foi escolhido.</p>
            </article>
            <article>
              <span className="step-number">03</span>
              <h3>Envie o briefing</h3>
              <p>Copie o pedido e envie pelo canal combinado. Nada é enviado sem você saber.</p>
            </article>
          </div>
        </section>

        <TemplatePicker onChoose={setChosenTemplate} />

        <section className="modules-section" id="modulos" aria-labelledby="modules-title">
          <div className="modules-heading">
            <div>
              <p className="eyebrow"><span /> BANCADA SITEONE</p>
              <h2 id="modules-title">12 módulos para montar<br /><em>do seu jeito.</em></h2>
            </div>
            <p className="section-copy">Clique nos módulos que fazem sentido. Cada seleção entra no seu briefing de proposta.</p>
          </div>
          <div className="modules-layout">
            <div className="module-workbench-visual">
              <div className="workbench-sheet" aria-hidden="true">
                <div className="workbench-top"><span>FOLHA DE MONTAGEM</span><span>SELEÇÃO ATUAL</span></div>
                <div className="workbench-count"><strong>{String(chosenModules.length).padStart(2, "0")}</strong><span>módulos<br />no briefing</span></div>
                <div className="workbench-path"><span>M01</span><i>→</i><span>M02</span><i>→</i><span>M03</span></div>
                <div className="workbench-sketch">
                  <div className="sketch-browser"><span /><span /><span /></div>
                  <div className="sketch-mobile"><span /><span /><span /></div>
                  <div className="sketch-lines"><i /><i /><i /><i /></div>
                </div>
                <p>Não é pacote fechado.<br /><b>É página montada por decisão.</b></p>
              </div>
              <div className="visual-stamp"><span>12</span> PEÇAS<br />PRONTAS</div>
            </div>
            <div className="module-grid" aria-label="Módulos gerais disponíveis">
              {generalModules.map((module) => {
                const isChosen = selectedModules.includes(module.name);
                const Icon = module.Icon;
                return (
                  <button
                    className={`module-tile ${isChosen ? "is-chosen" : ""}`}
                    key={module.code}
                    type="button"
                    onClick={() => toggleModule(module.name)}
                    aria-pressed={isChosen}
                  >
                    <span className="module-code">{module.code}</span>
                    <Icon size={21} strokeWidth={1.8} />
                    <span className="module-name">{module.name}</span>
                    <span className="module-detail">{module.description}</span>
                    <span className="module-check"><Check size={13} /></span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="pricing-section" id="planos" aria-labelledby="pricing-title">
          <div className="pricing-sidebar">
            <p className="eyebrow"><span /> REGRA CLARA</p>
            <h2 id="pricing-title">Conteúdo contado.<br /><em>Valor visível.</em></h2>
            <p>O plano-base define a quantidade de mídia. Upgrades ampliam o conteúdo e mostram o novo total, sem letra pequena.</p>
            <div className="pricing-side-note"><span>IMPORTANTE</span> Fotos, vídeos e músicas são fornecidos pelo cliente ou contratados à parte.</div>
          </div>
          <div className="pricing-plans" aria-label="Planos SiteOne">
            {plans.map((plan, index) => (
              <button
                type="button"
                className={`price-plan ${selectedPlan === plan.id ? "is-active" : ""} ${index === 0 ? "featured" : ""}`}
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                aria-pressed={selectedPlan === plan.id}
              >
                <span className="plan-kicker">{plan.extra}</span>
                <span className="plan-name">{plan.label}</span>
                <strong>{plan.price}</strong>
                <span className="plan-total">{plan.total}</span>
                <span className="plan-detail">{plan.detail}</span>
                <span className="plan-select">{selectedPlan === plan.id ? "Selecionado" : "Selecionar"} <ArrowDownRight size={16} /></span>
              </button>
            ))}
          </div>
        </section>

        <section className="food-section" id="gastronomia" aria-labelledby="food-title">
          <div className="food-copy">
            <p className="eyebrow light orange"><span /> NICHO ESPECIAL</p>
            <h2 id="food-title">Restaurante não vende<br />como qualquer <em>negócio.</em></h2>
            <p>Para restaurantes e lanchonetes, a SiteOne traz seis módulos pensados para abrir apetite, orientar o pedido e facilitar a chegada.</p>
            <div className="food-promise"><UtensilsCrossed size={20} /> Selecione os que entram no briefing junto com seus módulos gerais.</div>
          </div>
          <div className="food-stage">
            <div className="food-menu-board" aria-hidden="true">
              <div className="menu-board-top"><span>FOOD / 01</span><span>PRONTO PARA PEDIR</span></div>
              <div className="menu-board-title">cardápio<br /><b>que abre caminho.</b></div>
              <div className="menu-board-list"><span>LANCHES <i>→</i></span><span>COMBOS <i>→</i></span><span>ENTREGA <i>→</i></span></div>
              <div className="menu-board-order"><UtensilsCrossed size={17} /><span>MENU + PEDIDO + MAPA</span></div>
            </div>
          </div>
          <div className="food-list" aria-label="Módulos para restaurante e lanchonete">
            {foodModules.map((module) => {
              const isChosen = selectedModules.includes(module.name);
              const Icon = module.Icon;
              return (
                <button
                  className={`food-module ${isChosen ? "is-chosen" : ""}`}
                  key={module.code}
                  type="button"
                  onClick={() => toggleModule(module.name)}
                  aria-pressed={isChosen}
                >
                  <span>{module.code}</span>
                  <Icon size={18} />
                  <b>{module.name}</b>
                  <small>{module.description}</small>
                  {isChosen && <Check size={16} className="food-check" />}
                </button>
              );
            })}
          </div>
        </section>

        {chosenTemplate?.family === "onefood" && (
          <GastronomyStudio key={chosenTemplate.id} businessName={projectName} initialPlanId={chosenTemplate.id} />
        )}

        <section className="brief-section" id="montagem" aria-labelledby="brief-title">
          <div className="brief-heading">
            <p className="eyebrow"><span /> SEU BRIEFING</p>
            <h2 id="brief-title">Sua página começa<br />por uma <em>escolha.</em></h2>
              <p>Preencha o nome do negócio, revise as escolhas e copie o briefing. O botão não envia dados para ninguém.</p>
          </div>
          <div className="brief-console">
            <label className="project-input">
              <span>NOME DO NEGÓCIO</span>
              <input
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="Ex.: Lanches da Praça"
                maxLength={70}
              />
            </label>
            <div className="brief-local-options" aria-label="Opções locais para a demonstração">
              <div className="local-option-group">
                <span>TEMPLATE ESCOLHIDO</span>
                <div><button type="button" className="is-selected" onClick={() => jumpTo("templates")}>{chosenTemplate?.label || "Escolher template"}</button></div>
              </div>
              <div className="local-option-group">
                <span>VÍDEO NA PRIMEIRA VERSÃO</span>
                <div>
                  {["Link do YouTube", "Mídia do dono depois"].map((source) => (
                    <button
                      key={source}
                      type="button"
                      className={videoSource === source ? "is-selected" : ""}
                      onClick={() => setVideoSource(source)}
                      aria-pressed={videoSource === source}
                    >
                      {source}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="brief-summary">
              <div className="summary-topline"><span>RESUMO DE MONTAGEM</span><span>{chosenTemplate ? "1 TEMPLATE" : "AGUARDA ESCOLHA"}</span></div>
              <div className="summary-plan"><span>{chosenTemplate?.label || "Escolha um template"}</span><strong>{chosenTemplate?.price || "—"}</strong><small>{chosenTemplate?.limit || "Comece pela etapa 01: escolha o modelo."}</small></div>
              <div className="summary-tags">
                {chosenTemplate ? <span>TEMPLATE {chosenTemplate.label} · {chosenTemplate.family}</span> : <p>Escolha um template acima para montar seu briefing.</p>}
              </div>
            </div>
            <button className="copy-brief" type="button" onClick={copyBriefing}>
              <Copy size={19} /> Copiar meu briefing
            </button>
            <p className="brief-disclaimer">Ao copiar, você decide por qual canal deseja falar. A SiteOne não envia pedido, foto, vídeo ou contato automaticamente.</p>
          </div>
        </section>

        <section className="activation-section" id="ativacao" aria-labelledby="activation-title">
          <div className="activation-intro">
            <p className="eyebrow"><span /> ESTAÇÃO · ATIVAÇÃO</p>
            <h2 id="activation-title">Veja o caminho antes<br />de existir uma <em>cobrança.</em></h2>
            <p>A demonstração local cria um número e um código apenas para visualização. Abaixo dela, o proprietário pode abrir separadamente um Checkout Pro de sandbox, nunca uma cobrança real.</p>
            <div className="activation-assurance">
              <ShieldCheck size={20} />
              <span><b>SEM DADOS EXTERNOS</b> Tudo fica nesta tela até ela ser fechada ou recarregada.</span>
            </div>
          </div>

          <div className="activation-console" aria-live="polite">
            <div className="activation-console-top">
              <span>FLUXO DE TESTE / SITEONE</span>
              <span>{activationStage === "active" ? "ATIVO" : activationStage === "waiting" ? "AGUARDANDO" : "PRONTO"}</span>
            </div>

            <div className="activation-track" aria-label="Etapas da ativação simulada">
              <div className={`activation-step ${activationStage !== "idle" ? "is-complete" : ""}`}>
                <span>01</span><b>Pedido local</b><small>{activationStage === "idle" ? "a criar" : "criado"}</small>
              </div>
              <i aria-hidden="true" />
              <div className={`activation-step ${activationStage === "active" ? "is-complete" : ""} ${activationStage === "waiting" ? "is-current" : ""}`}>
                <span>02</span><b>Confirmação</b><small>{activationStage === "active" ? "simulada" : "aguarda teste"}</small>
              </div>
              <i aria-hidden="true" />
              <div className={`activation-step ${activationStage === "active" ? "is-complete" : ""}`}>
                <span>03</span><b>Ativação</b><small>{activationStage === "active" ? "código criado" : "a liberar"}</small>
              </div>
            </div>

            <div className="activation-details">
              <div>
                <span>NEGÓCIO DE TESTE</span>
                <b>{projectName.trim() || "Informe o nome acima"}</b>
                <small>{menuRange} · {videoSource}</small>
              </div>
              <div>
                <span>NÚMERO INTERNO</span>
                <b>{simulationReference || "—"}</b>
                <small>não foi enviado a ninguém</small>
              </div>
            </div>

            {activationStage === "idle" && (
              <button className="activation-action" type="button" onClick={createSimulation}>
                <ClipboardCheck size={19} /> Criar pedido de demonstração
              </button>
            )}

            {activationStage === "waiting" && (
              <div className="activation-waiting">
                <div><span>SIMULAÇÃO PRONTA</span><b>Agora teste a confirmação segura.</b><small>Na versão real, esta etapa só acontecerá após confirmação oficial do pagamento.</small></div>
                <button className="activation-action orange-action" type="button" onClick={confirmSimulation}>
                  <BadgeCheck size={19} /> Simular confirmação
                </button>
              </div>
            )}

            {activationStage === "active" && (
              <div className="activation-result">
                <div className="activation-code-block">
                  <span>CÓDIGO DE DEMONSTRAÇÃO</span>
                  <b>{simulationCode}</b>
                  <small>Não é código real e não libera serviço.</small>
                </div>
                <div className="activation-result-actions">
                  <button className="code-copy" type="button" onClick={copySimulationCode}><Copy size={17} /> Copiar código</button>
                  <button className="code-reset" type="button" onClick={resetSimulation}><RotateCcw size={16} /> Nova simulação</button>
                </div>
              </div>
            )}

            <TestCheckoutPanel businessName={projectName} menuItemCount={chosenTemplate?.id === "onefood-03" ? 30 : chosenTemplate?.id === "onefood-02" ? 20 : 12} />
            <p className="activation-disclaimer"><KeyRound size={15} /> A simulação local não envia dados. O Checkout Pro separado é restrito ao proprietário, usa somente sandbox e confirma o retorno pelo servidor protegido.</p>
          </div>
        </section>

        <section className="rules-section" id="regras" aria-labelledby="rules-title">
          <div>
            <p className="eyebrow"><span /> SEM SURPRESA</p>
            <h2 id="rules-title">Regras antes<br />do orçamento.</h2>
          </div>
          <div className="rules-list">
            <details open>
              <summary><span>01</span> O que entra no plano de R$ 29,00? <ArrowDownRight size={18} /></summary>
              <p>Uma página SiteOne com os módulos escolhidos e até 3 fotos, 2 vídeos e 1 música fornecidos para o projeto.</p>
            </details>
            <details>
              <summary><span>02</span> O que os upgrades acrescentam? <ArrowDownRight size={18} /></summary>
              <p>O Upgrade 01 acrescenta 2 fotos e 1 música por R$ 9,00. O Upgrade 02 acrescenta 3 fotos, 1 vídeo e 1 música por R$ 15,00.</p>
            </details>
            <details>
              <summary><span>03</span> O que precisa de proposta separada? <ArrowDownRight size={18} /></summary>
              <p>Domínio, hospedagem, produção de fotos, filmagem, composição musical, textos extensos, alterações fora do combinado e integrações especiais precisam de avaliação própria.</p>
            </details>
            <details>
              <summary><span>04</span> O botão já contrata alguma coisa? <ArrowDownRight size={18} /></summary>
              <p>Não. Nesta página, o botão somente copia seu briefing para que você envie pelo canal que preferir.</p>
            </details>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand"><img src="/manus-storage/hdmicro-mark_1af1da9e.png" alt="" /><span><b>HD</b>Micro</span><small>SiteOne / microsites</small></div>
        <p>Microsites modulares para negócios locais. Tecnologia com escolha clara.</p>
        <button type="button" onClick={() => jumpTo("inicio")}>Voltar ao início <ArrowUpRight size={16} /></button>
      </footer>
    </div>
  );
}
