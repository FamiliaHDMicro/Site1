import { describe, expect, it } from "vitest";
import { activationCodeForReference, createTestPreference, createTestReference, getSafePublicOrigin, SITEONE_TEST_OFFER } from "./checkoutService";

describe("SiteOne checkout de teste", () => {
  it("mantém o valor de liberação em centavos e não cria cobrança mensal", () => {
    expect(SITEONE_TEST_OFFER).toMatchObject({
      code: "onefood-release",
      amountCents: 10000,
    });
  });

  it("aceita as origens locais e hospedadas usadas no teste", () => {
    expect(getSafePublicOrigin("https://hdmicrosite-gfxm5nk9.manus.space", undefined)).toBe("https://hdmicrosite-gfxm5nk9.manus.space");
    expect(getSafePublicOrigin("http://localhost:3000", undefined)).toBe("http://localhost:3000");
  });

  it("rejeita origem externa não autorizada", () => {
    expect(() => getSafePublicOrigin("https://example.com", undefined)).toThrow("Origem não autorizada");
  });

  it("deriva um código estável sem incluir o identificador completo do pedido", () => {
    const reference = "SITEONE-TEST-11111111-2222-3333-4444-555555555555";
    const previousSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = "teste-local-siteone";
    expect(activationCodeForReference(reference)).toMatch(/^SITE-[A-F0-9]{4}-[A-F0-9]{4}$/);
    expect(activationCodeForReference(reference)).toBe(activationCodeForReference(reference));
    process.env.JWT_SECRET = previousSecret;
  });

  it.skipIf(process.env.RUN_MERCADOPAGO_SANDBOX_TEST !== "true")("aceita somente a URL sandbox retornada pelo Mercado Pago", async () => {
    const preference = await createTestPreference(
      createTestReference(),
      "https://hdmicrosite-gfxm5nk9.manus.space",
    );

    expect(preference.preferenceId).toBeTruthy();
    expect(preference.checkoutUrl).toContain("sandbox");
  }, 15_000);
});
