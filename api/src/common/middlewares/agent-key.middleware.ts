import type { RequestHandler } from "express";

import { AppError } from "../errors/app-error.js";

import { apiKeyService } from "../../modules/api-keys/api-key.service.js";

export const requireProjectApiKey: RequestHandler = async (
    req,
    _res,
    next
) => {
    try {
        const authorization = req.get("authorization");

        if(!authorization?.startsWith("Bearer ")) {
            throw new AppError(
                "Project API key required",
                401
            );
        }

        const token = authorization.slice(7).trim();

        const projectId = await apiKeyService.verify(token);

        req.ingestion = { //connect to controller
            projectId,
        };

        next();

    } catch (error) {
        next(error);
    }
    
}