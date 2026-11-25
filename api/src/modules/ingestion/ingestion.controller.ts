import type { RequestHandler } from "express";

import { AppError } from "../../common/errors/app-error.js";

import { ingestEventSchema } from "../events/event.schema.js";

import { ingestionService } from "./ingestion.service.js";

export const ingestEvent: RequestHandler = async (
    req,
    res
) => {
    // set by API key middleware
    const projectId = req.ingestion?.projectId;

    if(!projectId) {
        throw new AppError(
            "Project authentication required",
            401
        );
    }

    // validate request body
    const parsed = ingestEventSchema.safeParse(req.body);

    if(!parsed.success) {
        res.status(400).json({
            success: false,
            message: "Invalid event data",
            errors: parsed.error.issues.map(issue => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });

        return;
    }

    // save validated value
    const event = await ingestionService.ingest(
        projectId,
        parsed.data,
    )

    res.status(201).json({
        success: true,
        message: "Event received successfully",
        data: {
            id: event.id,
            received: event.receivedAt.toISOString()
        }
    })

   
}