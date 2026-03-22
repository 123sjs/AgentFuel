import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { servicesTable, insertServiceSchema } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/services", async (req, res) => {
  try {
    const services = await db.select().from(servicesTable).where(eq(servicesTable.active, true));
    const mapped = services.map((s) => ({
      id: s.id,
      ownerAddress: s.ownerAddress,
      name: s.name,
      description: s.description,
      endpoint: s.endpoint,
      price: s.price,
      currency: s.currency,
      stakeRequired: s.stakeRequired,
      successRate: Number(s.successRate) / 100,
      avgLatency: s.avgLatency,
      totalCalls: s.totalCalls,
      active: s.active,
      createdAt: s.createdAt.toISOString(),
    }));
    res.json(mapped);
  } catch (err) {
    req.log.error({ err }, "Failed to list services");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/services/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid service id" });
      return;
    }
    const [service] = await db.select().from(servicesTable).where(eq(servicesTable.id, id));
    if (!service) {
      res.status(404).json({ error: "Service not found" });
      return;
    }
    res.json({
      id: service.id,
      ownerAddress: service.ownerAddress,
      name: service.name,
      description: service.description,
      endpoint: service.endpoint,
      price: service.price,
      currency: service.currency,
      stakeRequired: service.stakeRequired,
      successRate: Number(service.successRate) / 100,
      avgLatency: service.avgLatency,
      totalCalls: service.totalCalls,
      active: service.active,
      createdAt: service.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get service");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/services", async (req, res) => {
  try {
    const parsed = insertServiceSchema.safeParse({
      ownerAddress: req.body.ownerAddress,
      name: req.body.name,
      description: req.body.description,
      endpoint: req.body.endpoint,
      price: req.body.price,
      currency: req.body.currency,
      stakeRequired: req.body.stakeRequired ?? "0",
    });
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
      return;
    }
    const [service] = await db.insert(servicesTable).values(parsed.data).returning();
    res.status(201).json({
      id: service.id,
      ownerAddress: service.ownerAddress,
      name: service.name,
      description: service.description,
      endpoint: service.endpoint,
      price: service.price,
      currency: service.currency,
      stakeRequired: service.stakeRequired,
      successRate: Number(service.successRate) / 100,
      avgLatency: service.avgLatency,
      totalCalls: service.totalCalls,
      active: service.active,
      createdAt: service.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create service");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
