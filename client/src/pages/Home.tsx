/**
 * SiteOne — Oficina Editorial Azul: uma bancada de montagem de microsites
 * clara, técnica e acolhedora. A estação de ativação é um fluxo local de demonstração,
 * com azul HDMicro, papel quente e laranja gastronômico — sem pagamento ou dados externos.
 */
import { useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeCheck,
  ClipboardCheck,
  Copy,
  KeyRound,
  MapPin,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import GastronomyStudio from "@/components/GastronomyStudio";
import TemplatePicker, { type TemplateChoice } from "@/components/TemplatePicker";
import TestCheckoutPanel from "@/components/TestCheckoutPanel";

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

const plans = [
  {
    id: "base",
    label: "Template essencial",
    price: "R$ 29,00",
    extra: "Entrada",
    total: "3 fotos · 2 vídeos · 1 música",
    detail: "Conteúdo inicial para preencher o template escolhido.",
  },
  {
    id: "up1",
    label: "Conteúdo extra 01",
    price: "+ R$ 9,00",
    extra: "Amplie imagens",
    total: "5 fotos · 2 vídeos · 2 músicas",
    detail: "Acrescenta 2 fotos e 1 música ao plano-base.",
  },
  {
    id: "up2",
    label: "Conteúdo extra 02",
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
  const [projectName, setProjectName] = useState("");
  const [videoSource, setVideoSource] = useState("Link do YouTube");
  const [activationStage, setActivationStage] = useState<ActivationStage>("idle");
  const [simulationReference, setSimulationReference] = useState("");
  const [simulationCode, setSimulationCode] = useState("");

  const activePlan = plans.find((plan) => plan.id === selectedPlan) ?? plans[0];
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
              <p className="eyebrow light"><span /> SITEONE / TEMPLATES PRONTOS</p>
              <h1 id="hero-title">O site certo para a <em>próxima venda.</em></h1>
              <p className="hero-text">
                Em vez de montar tudo do zero, você escolhe um template pronto para seu objetivo.
                A HDMicro organiza seu microsite com regras claras e conteúdo fácil de preencher.
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
                  <div className="blueprint-piece piece-copy"><span>T01</span><b>MODELO</b><small>objetivo</small></div>
                  <div className="blueprint-piece piece-media"><span>T02</span><b>FOTO</b><small>imagem</small></div>
                  <div className="blueprint-piece piece-contact"><span>T03</span><b>CONTATO</b><small>conexão</small></div>
                  <div className="blueprint-piece piece-map"><span>T04</span><b>MAPA</b><small>chegada</small></div>
                  <span className="blueprint-arrow arrow-a">→</span>
                  <span className="blueprint-arrow arrow-b">→</span>
                  <span className="blueprint-arrow arrow-c">↓</span>
                  <div className="blueprint-pin"><MapPin size={26} /></div>
                  <div className="blueprint-note note-a">templates que<br />viram página</div>
                  <div className="blueprint-note note-b">escolha o<br />seu modelo</div>
                </div>
                <div className="blueprint-footer"><span>ESCOLHA</span><i /> <span>PREENCHA</span><i /> <span>PUBLIQUE</span></div>
              </div>
            </div>
          </div>
          <div className="hero-ruler" aria-label="Etapas do processo">
            <span>01 <b>Escolha</b></span>
            <span>02 <b>Preencha</b></span>
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
              <h3>Escolha o template</h3>
              <p>Selecione um modelo pronto para seu público. O resumo mostra exatamente o template escolhido.</p>
            </article>
            <article>
              <span className="step-number">03</span>
              <h3>Preencha e envie</h3>
              <p>Organize o conteúdo e copie o briefing pelo canal combinado. Nada é enviado sem você saber.</p>
            </article>
          </div>
        </section>

        <TemplatePicker onChoose={setChosenTemplate} />

        <section className="pricing-section" id="planos" aria-labelledby="pricing-title">
          <div className="pricing-sidebar">
            <p className="eyebrow"><span /> REGRA CLARA</p>
            <h2 id="pricing-title">Conteúdo contado.<br /><em>Valor visível.</em></h2>
            <p>Para os templates gerais, você escolhe o conteúdo de partida e amplia a mídia quando precisar, sempre com o total visível.</p>
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
                <small>{chosenTemplate?.limit || "Escolha um template"} · {videoSource}</small>
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
              <summary><span>01</span> O que entra no template essencial de R$ 29,00? <ArrowDownRight size={18} /></summary>
              <p>Um template geral SiteOne preenchido com até 3 fotos, 2 vídeos e 1 música fornecidos para o projeto.</p>
            </details>
            <details>
              <summary><span>02</span> O que os conteúdos extras acrescentam? <ArrowDownRight size={18} /></summary>
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
        <p>Templates de microsites para negócios locais. Tecnologia com escolha clara.</p>
        <button type="button" onClick={() => jumpTo("inicio")}>Voltar ao início <ArrowUpRight size={16} /></button>
      </footer>
    </div>
  );
}
