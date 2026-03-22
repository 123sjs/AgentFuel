import { Router, type IRouter } from "express";
import healthRouter from "./health";
import servicesRouter from "./services";
import providersRouter from "./providers";
import quoteRouter from "./quote";
import receiptsRouter from "./receipts";

const router: IRouter = Router();

router.use(healthRouter);
router.use(servicesRouter);
router.use(providersRouter);
router.use(quoteRouter);
router.use(receiptsRouter);

export default router;
