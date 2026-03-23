import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

router.get("/health", (_req, res) => {
  res.json({
    ok: true,
    app: "AgentFuel API",
    time: new Date().toISOString(),
    note: "Basic API health check for the current product.",
  });
});

export default router;
