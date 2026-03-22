import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { receiptsTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/receipts", async (req, res) => {
  try {
    const conditions = [];

    if (req.query.payer) {
      conditions.push(eq(receiptsTable.payer, String(req.query.payer)));
    }
    if (req.query.provider) {
      conditions.push(eq(receiptsTable.provider, String(req.query.provider)));
    }
    if (req.query.serviceId) {
      conditions.push(eq(receiptsTable.serviceId, Number(req.query.serviceId)));
    }

    const receipts = await db
      .select()
      .from(receiptsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const mapped = receipts.map((r) => ({
      id: r.id,
      serviceId: r.serviceId,
      payer: r.payer,
      provider: r.provider,
      token: r.token,
      amount: r.amount,
      txHash: r.txHash,
      requestHash: r.requestHash,
      responseHash: r.responseHash,
      success: r.success,
      latencyMs: r.latencyMs,
      createdAt: r.createdAt.toISOString(),
    }));
    res.json(mapped);
  } catch (err) {
    req.log.error({ err }, "Failed to list receipts");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
