import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { activationCodeForReference, createTestPreference, createTestReference, getSafePublicOrigin, isMercadoPagoTestConfigured, SITEONE_TEST_OFFER } from "./siteone/checkoutService";
import { attachTestPreference, createTestCheckout, deleteTestCheckout, findTestCheckoutByReference } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";

const testCheckoutInput = z.object({
  businessName: z.string().trim().min(2).max(80),
  menuItemCount: z.number().int().min(12).max(20),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(COOKIE_NAME, { ...getSessionCookieOptions(ctx.req), maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  siteone: router({
    testCheckoutStatus: adminProcedure.query(() => ({
      mode: "test" as const,
      configured: isMercadoPagoTestConfigured(),
      amountCents: SITEONE_TEST_OFFER.amountCents,
    })),
    createTestCheckout: adminProcedure.input(testCheckoutInput).mutation(async ({ ctx, input }) => {
      const origin = getSafePublicOrigin(ctx.req.header("origin"), ctx.req.header("host"));
      const reference = createTestReference();
      await createTestCheckout({
        reference,
        businessName: input.businessName,
        planCode: SITEONE_TEST_OFFER.code,
        menuItemCount: input.menuItemCount,
        amountCents: SITEONE_TEST_OFFER.amountCents,
      });

      try {
        const preference = await createTestPreference(reference, origin);
        await attachTestPreference(reference, preference.preferenceId);
        return { reference, checkoutUrl: preference.checkoutUrl };
      } catch (error) {
        console.error("[SiteOne Test Payment] Não foi possível criar preferência de sandbox.");
        throw error;
      }
    }),
    getTestCheckout: adminProcedure.input(z.object({ reference: z.string().startsWith("SITEONE-TEST-").max(80) })).query(async ({ input }) => {
      const checkout = await findTestCheckoutByReference(input.reference);
      if (!checkout) return { found: false as const };
      return {
        found: true as const,
        status: checkout.status,
        reference: checkout.reference,
        activationCode: checkout.status === "approved" ? activationCodeForReference(checkout.reference) : null,
      };
    }),
    deleteTestCheckout: adminProcedure.input(z.object({ reference: z.string().startsWith("SITEONE-TEST-").max(80) })).mutation(async ({ input }) => {
      await deleteTestCheckout(input.reference);
      return { deleted: true as const };
    }),
  }),
});

export type AppRouter = typeof appRouter;
