import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { servicesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.post("/quote", async (req, res) => {
  try {
    const rawId = req.body?.serviceId;

    if (rawId === undefined || rawId === null || rawId === "") {
      res.status(400).json({
        ok: false,
        reason: "invalid_request",
        message: "serviceId is required and must be a numeric service ID",
      });
      return;
    }

    if (!/^\d+$/.test(String(rawId))) {
      res.status(400).json({
        ok: false,
        reason: "invalid_request",
        message: "serviceId is required and must be a numeric service ID",
      });
      return;
    }

    const numericId = Number(rawId);

    const [service] = await db
      .select()
      .from(servicesTable)
      .where(eq(servicesTable.id, numericId));

    if (!service) {
      res.status(404).json({
        ok: false,
        reason: "not_found",
        message: "Service not found",
      });
      return;
    }

    if (!service.active) {
      res.status(422).json({
        ok: false,
        reason: "inactive",
        message: "Service is not currently accepting quotes",
      });
      return;
    }

    const price = service.price;
    const token = service.currency;
    const stakeRequired = service.stakeRequired;
    const ts = Date.now();
    const paymentHeader = `af-quote:sid=${service.id};price=${price};token=${token};ts=${ts}`;

    res.json({
      ok: true,
      serviceId: String(service.id),
      price,
      token,
      stakeRequired: `${stakeRequired} FUEL`,
      paymentHeader,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get quote");
    res.status(500).json({ ok: false, reason: "server_error", error: "Internal server error" });
  }
});

export default router;
