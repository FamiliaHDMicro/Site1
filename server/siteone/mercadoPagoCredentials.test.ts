import { describe, expect, it } from "vitest";

describe("credencial Mercado Pago de teste", () => {
  it("valida o Access Token de teste em uma consulta leve e autenticada", async () => {
    const accessToken = process.env.MERCADOPAGO_TEST_ACCESS_TOKEN;
    expect(accessToken?.trim()).toBeTruthy();

    const response = await fetch("https://api.mercadopago.com/users/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    expect(response.status).toBe(200);
    const profile = await response.json() as { id?: number };
    expect(profile.id).toEqual(expect.any(Number));
  }, 15_000);
});
