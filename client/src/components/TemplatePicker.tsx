import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, LayoutTemplate, UtensilsCrossed } from "lucide-react";
import "./TemplatePicker.css";

type TemplateFamily = "adolescente" | "business" | "presentes" | "comemoracoes" | "onefood";

export type TemplateChoice = {
  id: string;
  family: TemplateFamily;
  label: string;
  description: string;
  price?: string;
  limit?: string;
};

const families: { id: TemplateFamily; label: string }[] = [
  { id: "adolescente", label: "Adolescente" },
  { id: "business", label: "Business" },
  { id: "presentes", label: "Presentes" },
  { id: "comemoracoes", label: "Namoro & comemorações" },
  { id: "onefood", label: "OneFood" },
];

const templates: TemplateChoice[] = [
  ...["01", "02", "03"].map((n) => ({ id: `teen-${n}`, family: "adolescente" as const, label: `Adolescente ${n}`, description: "Template jovem para links, fotos, vídeo e identidade pessoal." })),
  ...["01", "02", "03"].map((n) => ({ id: `biz-${n}`, family: "business" as const, label: `Business ${n}`, description: "Template comercial para serviço, contato, horário e localização." })),
  ...["01", "02", "03"].map((n) => ({ id: `gift-${n}`, family: "presentes" as const, label: `Presente ${n}`, description: "Template para presentear com texto, fotos, música e vídeo autorizados." })),
  ...["01", "02", "03"].map((n) => ({ id: `celebrate-${n}`, family: "comemoracoes" as const, label: `Celebra ${n}`, description: "Template para namoro, casamento, aniversário e outras comemorações." })),
  { id: "onefood-01", family: "onefood", label: "OneFood 01", description: "Cardápio enxuto com uma imagem por produto.", price: "R$100 liberação + R$29/mês", limit: "Até 12 produtos e 12 imagens" },
  { id: "onefood-02", family: "onefood", label: "OneFood 02", description: "Mais opções de cardápio, com uma imagem por produto.", price: "R$100 liberação + R$49/mês", limit: "Até 20 produtos e 20 imagens" },
  { id: "onefood-03", family: "onefood", label: "OneFood 03", description: "Cardápio maior para lanchonetes com mais variedade.", price: "R$100 liberação + R$69/mês", limit: "Até 30 produtos e 30 imagens" },
];

export default function TemplatePicker({ onChoose }: { onChoose: (template: TemplateChoice) => void }) {
  const [family, setFamily] = useState<TemplateFamily>("adolescente");
  const [index, setIndex] = useState(0);
  const [chosenId, setChosenId] = useState("teen-01");
  const available = useMemo(() => templates.filter((item) => item.family === family), [family]);
  const current = available[index] ?? available[0];

  const changeFamily = (next: TemplateFamily) => {
    setFamily(next);
    setIndex(0);
  };

  const previous = () => setIndex((value) => (value - 1 + available.length) % available.length);
  const next = () => setIndex((value) => (value + 1) % available.length);

  return (
    <section className="template-picker" id="templates" aria-labelledby="templates-title">
      <div className="template-picker-intro">
        <p className="eyebrow"><span /> ETAPA 01 · ESCOLHA O MODELO</p>
        <h2 id="templates-title">Uma tela por vez.<br /><em>Como no banco.</em></h2>
        <p>Escolha a família, passe pelos modelos na horizontal e selecione um template. Não existe lista infinita.</p>
      </div>
      <div className="template-picker-console">
        <div className="template-progress"><span>01 FAMÍLIA</span><i /><span className="is-current">02 MODELO</span><i /><span>03 CONTEÚDO</span></div>
        <div className="template-tabs" role="tablist" aria-label="Famílias de templates">
          {families.map((item) => <button key={item.id} role="tab" type="button" aria-selected={family === item.id} className={family === item.id ? "is-active" : ""} onClick={() => changeFamily(item.id)}>{item.label}</button>)}
        </div>
        <div className="template-frame">
          <button className="template-nav" type="button" onClick={previous} aria-label="Modelo anterior"><ArrowLeft size={20} /></button>
          <article className={`template-screen ${current?.family === "onefood" ? "is-food" : ""}`}>
            <span className="template-count">{String(index + 1).padStart(2, "0")} / {String(available.length).padStart(2, "0")}</span>
            {current?.family === "onefood" ? <UtensilsCrossed size={28} /> : <LayoutTemplate size={28} />}
            <h3>{current?.label}</h3>
            <p>{current?.description}</p>
            {current?.price && <b>{current.price}</b>}
            {current?.limit && <small>{current.limit}</small>}
            <button className={`choose-template ${chosenId === current?.id ? "is-chosen" : ""}`} type="button" onClick={() => {
              if (!current) return;
              setChosenId(current.id);
              onChoose(current);
            }}>
              {chosenId === current?.id ? <><Check size={16} /> Template escolhido</> : "Escolher este template"}
            </button>
          </article>
          <button className="template-nav" type="button" onClick={next} aria-label="Próximo modelo"><ArrowRight size={20} /></button>
        </div>
        <p className="template-selection">Selecionado: <b>{templates.find((item) => item.id === chosenId)?.label}</b>. Na próxima etapa, o cliente preenche somente o conteúdo daquele modelo.</p>
      </div>
    </section>
  );
}
