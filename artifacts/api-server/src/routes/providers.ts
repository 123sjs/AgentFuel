import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { providersTable, insertProviderSchema } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/providers", async (req, res) => {
  try {
    const providers = await db.select().from(providersTable);
    const mapped = providers.map((p) => ({
      id: p.id,
      address: p.address,
      stakedFuel: p.stakedFuel,
      reputationScore: p.reputationScore,
      slashCount: p.slashCount,
      totalEarnings: p.totalEarnings,
      createdAt: p.createdAt.toISOString(),
    }));
    res.json(mapped);
  } catch (err) {
    req.log.error({ err }, "Failed to list providers");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/providers/:address", async (req, res) => {
  try {
    const [provider] = await db
      .select()
      .from(providersTable)
      .where(eq(providersTable.address, req.params.address));
    if (!provider) {
      res.status(404).json({ error: "Provider not found" });
      return;
    }
    res.json({
      id: provider.id,
      address: provider.address,
      stakedFuel: provider.stakedFuel,
      reputationScore: provider.reputationScore,
      slashCount: provider.slashCount,
      totalEarnings: provider.totalEarnings,
      createdAt: provider.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get provider");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/providers", async (req, res) => {
  try {
    const parsed = insertProviderSchema.safeParse({
      address: req.body.address,
    });
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }
    const [provider] = await db.insert(providersTable).values(parsed.data).returning();
    res.status(201).json({
      id: provider.id,
      address: provider.address,
      stakedFuel: provider.stakedFuel,
      reputationScore: provider.reputationScore,
      slashCount: provider.slashCount,
      totalEarnings: provider.totalEarnings,
      createdAt: provider.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create provider");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
