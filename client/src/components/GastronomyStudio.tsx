import { useMemo, useState } from "react";
import { ArrowDownRight, Copy, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import "./GastronomyStudio.css";

type RestaurantPlan = {
  id: string;
  label: string;
  release: string;
  monthly: string;
  itemLimit: number;
  imageLimit: number;
  detail: string;
};

type MenuItem = {
  id: string;
  category: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  available: boolean;
};

const restaurantPlans: RestaurantPlan[] = [
  {
    id: "onefood-01",
    label: "OneFood 01",
    release: "R$ 100 liberação única",
    monthly: "R$ 29 / mês",
    itemLimit: 12,
    imageLimit: 12,
    detail: "Cardápio enxuto com uma imagem para cada produto.",
  },
  {
    id: "onefood-02",
    label: "OneFood 02",
    release: "R$ 100 liberação única",
    monthly: "R$ 49 / mês",
    itemLimit: 20,
    imageLimit: 20,
    detail: "Para lanchonetes com mais opções e uma imagem por produto.",
  },
  {
    id: "onefood-03",
    label: "OneFood 03",
    release: "R$ 100 liberação única",
    monthly: "R$ 69 / mês",
    itemLimit: 30,
    imageLimit: 30,
    detail: "Para cardápios maiores, com até 30 produtos e 30 imagens.",
  },
];

const menuCategories = ["Lanches", "Combos", "Porções", "Bebidas", "Sobremesas", "Outros"];

function makeMenuItems(count: number, current: MenuItem[] = []): MenuItem[] {
  return Array.from({ length: count }, (_, index) => current[index] ?? {
    id: `menu-${index + 1}`,
    category: index < 8 ? "Lanches" : "Bebidas",
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    available: true,
  });
}

export default function GastronomyStudio({ businessName, initialPlanId }: { businessName: string; initialPlanId: string }) {
  const initialPlan = restaurantPlans.find((plan) => plan.id === initialPlanId) ?? restaurantPlans[0];
  const [restaurantPlanId, setRestaurantPlanId] = useState(initialPlan.id);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => makeMenuItems(initialPlan.itemLimit));
  const activePlan = restaurantPlans.find((plan) => plan.id === restaurantPlanId) ?? restaurantPlans[0];
  const filledItems = useMemo(
    () => menuItems.filter((item) => item.name.trim() && item.price.trim() && item.imageUrl.trim()).length,
    [menuItems],
  );

  const setMenuItemCount = (count: number) => {
    setMenuItems((current) => makeMenuItems(count, current));
    setRestaurantPlanId(count === 12 ? "onefood-01" : count === 20 ? "onefood-02" : "onefood-03");
  };

  const selectPlan = (plan: RestaurantPlan) => {
    setRestaurantPlanId(plan.id);
    setMenuItemCount(plan.itemLimit);
  };

  const updateMenuItem = <K extends keyof MenuItem>(index: number, key: K, value: MenuItem[K]) => {
    setMenuItems((current) => current.map((item, itemIndex) => (
      itemIndex === index ? { ...item, [key]: value } : item
    )));
  };

  const copyMenuDraft = async () => {
    const text = [
      "CARDÁPIO SITEONE — HDMICRO",
      `Negócio: ${businessName.trim() || "a definir"}`,
      `Plano: ${activePlan.label}`,
      `Liberação única: ${activePlan.release}`,
      `Manutenção: ${activePlan.monthly}`,
      `Limite selecionado: ${menuItems.length} itens`,
      `Itens preenchidos: ${filledItems}`,
      "",
      ...menuItems.map((item, index) => (
        `${String(index + 1).padStart(2, "0")}. [${item.category}] ${item.name.trim() || "item sem nome"} — ${item.price.trim() || "preço a definir"} — imagem: ${item.imageUrl.trim() || "link a definir"} (${item.available ? "disponível" : "pausado"})${item.description.trim() ? `: ${item.description.trim()}` : ""}`
      )),
      "",
      "Rascunho local: nenhum item foi publicado, enviado ou cobrado.",
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      toast.success("Rascunho do cardápio copiado. Nada foi enviado.");
    } catch {
      toast.error("Não foi possível copiar agora. Tente novamente.");
    }
  };

  return (
    <>
      <section className="restaurant-plans-section" aria-labelledby="restaurant-plans-title">
        <div className="restaurant-plan-intro">
          <p className="eyebrow"><span /> GASTRONOMIA · IMPLANTAÇÃO + MENSALIDADE</p>
          <h2 id="restaurant-plans-title">Cardápio organizado<br />com manutenção <em>clara.</em></h2>
          <p>Cada OneFood tem liberação única de R$100,00 e uma mensalidade conforme o tamanho do cardápio. Nenhuma cobrança é criada nesta página.</p>
        </div>
        <div className="restaurant-plan-grid" aria-label="Planos gastronômicos">
          {restaurantPlans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              className={`restaurant-plan ${restaurantPlanId === plan.id ? "is-active" : ""}`}
              onClick={() => selectPlan(plan)}
              aria-pressed={restaurantPlanId === plan.id}
            >
              <span className="restaurant-plan-label">{plan.label}</span>
              <strong>{plan.release}</strong>
              <b>{plan.monthly}</b>
              <span className="restaurant-plan-limit">Até {plan.itemLimit} produtos · até {plan.imageLimit} imagens</span>
              <small>{plan.detail}</small>
              <span className="restaurant-plan-action">{restaurantPlanId === plan.id ? "Plano selecionado" : "Selecionar plano"} <ArrowDownRight size={16} /></span>
            </button>
          ))}
        </div>
        <p className="restaurant-plan-note">Cada produto tem uma imagem própria. Acima de 30 produtos/imagens, domínio, vídeos, impressora, PDV e integrações especiais são avaliados separadamente.</p>
      </section>

      <section className="menu-wizard-section" id="cardapio" aria-labelledby="menu-wizard-title">
        <div className="menu-wizard-intro">
          <p className="eyebrow"><span /> WIZARD · CARDÁPIO GASTRONÔMICO</p>
          <h2 id="menu-wizard-title">Monte de 12 a 30 itens<br />com foto em cada <em>produto.</em></h2>
          <p>Preencha por etapas, confira a quantidade e copie o rascunho. Nesta fase, tudo fica apenas neste navegador.</p>
        </div>

        <div className="menu-wizard-console">
          <div className="menu-wizard-topline"><span>FICHA DE CARDÁPIO / RASCUNHO LOCAL</span><span>{filledItems} / {menuItems.length} COMPLETOS</span></div>
          <div className="menu-capacity-row">
            <div>
              <span>01 · ESCOLHA A CAPACIDADE</span>
              <p>O plano selecionado inclui até <b>{activePlan.itemLimit} produtos e {activePlan.imageLimit} imagens</b>.</p>
            </div>
            <div className="menu-capacity-actions">
              <button type="button" className={menuItems.length === 12 ? "is-active" : ""} onClick={() => setMenuItemCount(12)}>12 itens</button>
              <button type="button" className={menuItems.length === 20 ? "is-active" : ""} onClick={() => setMenuItemCount(20)}>20 itens</button>
              <button type="button" className={menuItems.length === 30 ? "is-active" : ""} onClick={() => setMenuItemCount(30)}>30 itens</button>
            </div>
          </div>

          <div className="menu-editor-heading"><span>02 · PREENCHA OS PRODUTOS</span><small>Nome, preço e link da imagem formam o item completo.</small></div>
          <div className="menu-editor" aria-label="Editor de itens do cardápio">
            {menuItems.map((item, index) => (
              <div className="menu-item-row" key={item.id}>
                <span className="menu-item-number">{String(index + 1).padStart(2, "0")}</span>
                <select aria-label={`Categoria do item ${index + 1}`} value={item.category} onChange={(event) => updateMenuItem(index, "category", event.target.value)}>
                  {menuCategories.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
                <input aria-label={`Nome do item ${index + 1}`} value={item.name} onChange={(event) => updateMenuItem(index, "name", event.target.value)} maxLength={60} placeholder="Ex.: X-salada" />
                <input aria-label={`Descrição do item ${index + 1}`} value={item.description} onChange={(event) => updateMenuItem(index, "description", event.target.value)} maxLength={100} placeholder="Descrição curta" />
                <input aria-label={`Preço do item ${index + 1}`} value={item.price} onChange={(event) => updateMenuItem(index, "price", event.target.value)} inputMode="decimal" maxLength={12} placeholder="R$ 0,00" />
                <input aria-label={`Imagem do item ${index + 1}`} value={item.imageUrl} onChange={(event) => updateMenuItem(index, "imageUrl", event.target.value)} inputMode="url" maxLength={400} placeholder="Link da imagem" />
                <button type="button" className={`availability-toggle ${item.available ? "is-available" : ""}`} onClick={() => updateMenuItem(index, "available", !item.available)} aria-pressed={item.available}>
                  {item.available ? "Disponível" : "Pausado"}
                </button>
              </div>
            ))}
          </div>
          <div className="menu-wizard-footer">
            <p><b>03 · REVISE.</b> {filledItems} de {menuItems.length} produtos têm nome, preço e imagem preenchidos. Você pode terminar depois.</p>
            <button type="button" className="copy-menu" onClick={copyMenuDraft}><Copy size={18} /> Copiar rascunho do cardápio</button>
          </div>
        </div>
      </section>
    </>
  );
}
