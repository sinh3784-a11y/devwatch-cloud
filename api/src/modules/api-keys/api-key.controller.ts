import type { RequestHandler } from "express";
import { success, z } from "zod";

import { getAuthUserId } from "../../common/middlewares/auth.middleware.js";

import { apiKeyService } from "./api-key.service.js";

const createKeySchema = z.strictObject({
    label: z.string().trim().min(2).max(60),
});

export const createProjectKey: RequestHandler<{
    id: string
}> = async (req, res) => {

    const projectId = z.uuid().safeParse(req.params.id);
    const input = createKeySchema.safeParse(req.body);

    if(!projectId.success || !input.success) {
        res.status(400).json({
            success: false,
            message: "Invalid project ID or API key label",
        });
        return;
    }

    const ownerId = getAuthUserId(req);

    const result = await apiKeyService.issue(
        ownerId,
        projectId.data,
        input.data.label
    );
    
    res.status(201).json({
        success: true,
        message: "Project API key created",
        data: result
    });
};