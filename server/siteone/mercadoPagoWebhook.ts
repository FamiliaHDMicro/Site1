import type { Express, Request, Response } from "express";
import { InvalidWebhookSignatureError, MercadoPagoConfig, Payment, WebhookSignatureValidator } from "mercadopago";
import { findTestCheckoutByReference, updateTestCheckoutStatus } from "../db";
import type { SiteoneTestCheckoutStatus } from "../../drizzle/schema";

const acceptedStatuses = new Set<SiteoneTestCheckoutStatus>(["approved", "pending", "rejected", "cancelled"]);

function firstValue(value: unknown) {
  return Array.isArray(value) ? value[0] : typeof value === "string" ? value : undefined;
}

export function registerMercadoPagoTestWebhook(app: Express) {
  app.post("/api/payments/mercadopago/test", async (req: Request, res: Response) => {
    const accessToken = process.env.MERCADOPAGO_TEST_ACCESS_TOKEN?.trim();
    const webhookSecret = process.env.MERCADOPAGO_TEST_WEBHOOK_SECRET?.trim();
    const dataId = firstValue(req.query["data.id"]);

    if (!accessToken || !webhookSecret) {
      return res.status(503).json({ received: false, mode: "test", reason: "not_configured" });
    }

    try {
      WebhookSignatureValidator.validate({
        xSignature: req.header("x-signature"),
        xRequestId: req.header("x-request-id"),
        dataId,
        secret: webhookSecret,
        toleranceSeconds: 300,
      });
    } catch (error) {
      if (error instanceof InvalidWebhookSignatureError) {
        console.warn("[SiteOne Test Payment] Webhook rejeitado:", error.reason);
        return res.sendStatus(401);
      }
      console.error("[SiteOne Test Payment] Falha ao validar Webhook.");
      return res.sendStatus(400);
    }

    if (firstValue(req.body?.type) !== "payment" || !dataId) return res.sendStatus(200);

    try {
      const client = new MercadoPagoConfig({ accessToken });
      const payment = await new Payment(client).get({ id: dataId });
      const reference = payment.external_reference;
      const status = payment.status;

      if (!reference?.startsWith("SITEONE-TEST-") || !status || !acceptedStatuses.has(status as SiteoneTestCheckoutStatus)) {
        return res.sendStatus(200);
      }

      const checkout = await findTestCheckoutByReference(reference);
      if (!checkout) return res.sendStatus(200);

      await updateTestCheckoutStatus(reference, status as SiteoneTestCheckoutStatus, payment.id ? String(payment.id) : dataId);
      return res.sendStatus(200);
    } catch (error) {
      console.error("[SiteOne Test Payment] Falha no processamento do pagamento de teste.");
      return res.sendStatus(500);
    }
  });
}
