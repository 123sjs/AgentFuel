import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { servicesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.post("/quote", async (req, res) => {
  try {
    const serviceId = req.body?.serviceId ?? "unknown";

    let price = "0.10";
    let stakeRequired = "1000";
    let currency = "USDT";

    if (typeof serviceId === "number" || /^\d+$/.test(String(serviceId))) {
      const [service] = await db
        .select()
        .from(servicesTable)
        .where(eq(servicesTable.id, Number(serviceId)));
      if (service) {
        price = service.price;
        stakeRequired = service.stakeRequired;
        currency = service.currency;
      }
    } else {
      const mockPrices: Record<string, { price: string; stake: string }> = {
        "summarize-agent": { price: "0.10", stake: "1000" },
        "research-agent": { price: "0.25", stake: "2500" },
      };
      const mock = mockPrices[serviceId as string];
      if (mock) {
        price = mock.price;
        stakeRequired = mock.stake;
      }
    }

    res.json({
      ok: true,
      serviceId: String(serviceId),
      price,
      token: currency,
      stakeRequired: `${stakeRequired} FUEL`,
      paymentHeader: "X-PAYMENT",
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get quote");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
