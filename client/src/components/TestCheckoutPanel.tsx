import { useMemo } from "react";
import { CheckCircle2, CreditCard, Loader2, LockKeyhole, Trash2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import "./TestCheckoutPanel.css";

export default function TestCheckoutPanel({ businessName, menuItemCount }: { businessName: string; menuItemCount: number }) {
  const { user, loading, isAuthenticated } = useAuth();
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const referenceFromReturn = params.get("reference");
  const isOwner = user?.role === "admin";
  const config = trpc.siteone.testCheckoutStatus.useQuery(undefined, { enabled: Boolean(isOwner), retry: false });
  const checkout = trpc.siteone.getTestCheckout.useQuery(
    { reference: referenceFromReturn ?? "SITEONE-TEST-UNAVAILABLE" },
    { enabled: Boolean(isOwner && referenceFromReturn), retry: false, refetchInterval: 5_000 },
  );
  const createCheckout = trpc.siteone.createTestCheckout.useMutation({
    onSuccess: ({ checkoutUrl }) => window.location.assign(checkoutUrl),
    onError: () => toast.error("Não foi possível preparar o checkout de teste. Nenhuma cobrança foi criada."),
  });
  const deleteCheckout = trpc.siteone.deleteTestCheckout.useMutation({
    onSuccess: () => {
      toast.success("Registro de teste apagado.");
      void checkout.refetch();
    },
    onError: () => toast.error("Não foi possível apagar este registro de teste."),
  });

  if (loading) return <div className="test-checkout-panel is-loading"><Loader2 size={17} /> Preparando a área de teste...</div>;

  if (!isAuthenticated) {
    return (
      <div className="test-checkout-panel">
        <div><LockKeyhole size={20} /><b>Checkout de teste restrito</b><p>Somente o proprietário entra no sandbox. Clientes não veem esta ferramenta.</p></div>
        <button type="button" onClick={startLogin}>Entrar como proprietário</button>
      </div>
    );
  }

  if (!isOwner) {
    return <div className="test-checkout-panel"><div><LockKeyhole size={20} /><b>Acesso restrito</b><p>Esta área é exclusiva do proprietário do SiteOne e não cria pagamentos reais.</p></div></div>;
  }

  const openSandbox = () => {
    createCheckout.mutate({ businessName: businessName.trim() || "Teste OneFood", menuItemCount });
  };

  return (
    <div className="test-checkout-panel">
      <div className="test-checkout-copy">
        <span>CHECKOUT PRO · SOMENTE SANDBOX</span>
        <b>Teste a liberação OneFood de R$100,00.</b>
        <p>O Mercado Pago abrirá apenas o ambiente de teste. Não há cobrança real, assinatura mensal ou envio para cliente.</p>
      </div>
      {referenceFromReturn && checkout.data?.found && (
        <div className={`test-payment-result status-${checkout.data.status}`}>
          <CheckCircle2 size={18} />
          <span>Retorno do teste: <b>{checkout.data.status}</b>{checkout.data.activationCode ? ` · código ${checkout.data.activationCode}` : ""}</span>
          <button type="button" className="test-delete" onClick={() => deleteCheckout.mutate({ reference: checkout.data.reference ?? referenceFromReturn })} disabled={deleteCheckout.isPending}>
            <Trash2 size={13} /> Apagar teste
          </button>
        </div>
      )}
      {!config.data?.configured ? (
        <p className="test-checkout-warning">A credencial de teste ainda não foi validada pelo servidor. O botão ficará bloqueado.</p>
      ) : (
        <button className="test-checkout-action" type="button" onClick={openSandbox} disabled={createCheckout.isPending}>
          {createCheckout.isPending ? <Loader2 size={18} className="spin" /> : <CreditCard size={18} />} Abrir Checkout Pro de teste
        </button>
      )}
      <p className="test-checkout-foot">O histórico técnico permanece no banco de teste para conferir o retorno do Webhook e será apagado antes do lançamento comercial.</p>
    </div>
  );
}
