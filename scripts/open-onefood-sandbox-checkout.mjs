import { createTestCheckout, attachTestPreference } from "../server/db.ts";
import { createTestPreference, createTestReference, SITEONE_TEST_OFFER } from "../server/siteone/checkoutService.ts";

const publicOrigin = "https://hdmicrosite-gfxm5nk9.manus.space";
const reference = createTestReference();

await createTestCheckout({
  reference,
  businessName: "OneFood 01 — teste manual",
  planCode: "onefood-01",
  menuItemCount: 12,
  amountCents: SITEONE_TEST_OFFER.amountCents,
});

try {
  const preference = await createTestPreference(reference, publicOrigin);
  await attachTestPreference(reference, preference.preferenceId);
  console.log(JSON.stringify({ reference, checkoutUrl: preference.checkoutUrl }));
  process.exit(0);
} catch (error) {
  console.error("Não foi possível criar a preferência sandbox.");
  process.exitCode = 1;
}
