import { createHmac, randomUUID } from "node:crypto";
import { MercadoPagoConfig, Preference } from "mercadopago";

export const SITEONE_TEST_OFFER = {
  code: "onefood-release",
  title: "Liberação OneFood — TESTE",
  amountCents: 10000,
} as const;

export function isMercadoPagoTestConfigured() {
  return Boolean(process.env.MERCADOPAGO_TEST_ACCESS_TOKEN?.trim());
}

export function createTestReference() {
  return `SITEONE-TEST-${randomUUID()}`;
}

export function activationCodeForReference(reference: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Chave interna indisponível para gerar a ativação de teste.");

  const signature = createHmac("sha256", secret).update(reference).digest("hex").slice(0, 8).toUpperCase();
  return `SITE-${signature.slice(0, 4)}-${signature.slice(4)}`;
}

function validatePublicOrigin(origin: string) {
  const url = new URL(origin);
  const allowed = url.protocol === "https:"
    ? url.hostname.endsWith(".manus.space") || url.hostname.endsWith(".manus.computer")
    : url.protocol === "http:" && (url.hostname === "localhost" || url.hostname === "127.0.0.1");

  if (!allowed) throw new Error("Origem não autorizada para o teste de pagamento.");
  return url.origin;
}

export function getSafePublicOrigin(originHeader: string | undefined, hostHeader: string | undefined) {
  const candidate = originHeader || (hostHeader ? `https://${hostHeader}` : "");
  if (!candidate) throw new Error("Não foi possível identificar a origem do teste.");
  return validatePublicOrigin(candidate);
}

export async function createTestPreference(reference: string, publicOrigin: string) {
  const accessToken = process.env.MERCADOPAGO_TEST_ACCESS_TOKEN?.trim();
  if (!accessToken) throw new Error("Credencial de teste do Mercado Pago ainda não foi configurada.");

  const client = new MercadoPagoConfig({ accessToken });
  const preference = new Preference(client);
  const callbackUrl = `${publicOrigin}/api/payments/mercadopago/test`;
  const returnBase = `${publicOrigin}/?payment_test=1&reference=${encodeURIComponent(reference)}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 60 * 1000);

  const response = await preference.create({
    body: {
      items: [{
        id: SITEONE_TEST_OFFER.code,
        title: SITEONE_TEST_OFFER.title,
        quantity: 1,
        unit_price: SITEONE_TEST_OFFER.amountCents / 100,
        currency_id: "BRL",
      }],
      external_reference: reference,
      notification_url: callbackUrl,
      back_urls: {
        success: `${returnBase}&status=approved`,
        pending: `${returnBase}&status=pending`,
        failure: `${returnBase}&status=rejected`,
      },
      auto_return: "approved",
      binary_mode: true,
      expires: true,
      expiration_date_from: now.toISOString(),
      expiration_date_to: expiresAt.toISOString(),
      metadata: {
        environment: "test",
        product: "siteone",
      },
    },
  });

  if (!response.id || !response.sandbox_init_point) {
    throw new Error("O Mercado Pago não retornou um endereço de sandbox para este teste.");
  }

  return { preferenceId: response.id, checkoutUrl: response.sandbox_init_point };
}
