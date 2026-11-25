import { Router } from "express";
import { rateLimit} from "express-rate-limit";

import { requireProjectApiKey } from "../../common/middlewares/agent-key.middleware.js";

import { ingestEvent } from "./ingestion.controller.js";

const router = Router();

const ingestLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 20,
    standardHeaders: "draft-8",
    legacyHeaders: false,
});

router.post(
    "/events",
    ingestLimiter,
    requireProjectApiKey,
    ingestEvent
);

export default router;