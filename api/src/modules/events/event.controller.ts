import type { RequestHandler } from "express";
import { z } from "zod";

import { getAuthUserId } from "../../common/middlewares/auth.middleware.js";
import { projectService } from "../projects/project.service.js";
import { eventRepository } from "./event.repository.js";

export const getProjectEvents: RequestHandler<{
    id: string
}> = async (req, res) => {

    const parsedId = z.uuid().safeParse(req.params.id);

    // validate for parsedId
    if(!parsedId.success) {
        res.status(400).json({
            success: false,
            message: "Invalid project ID",
        });
        return;
    }

    const ownerId = getAuthUserId(req);
    const projectId = parsedId.data;

    // confirm that this user owns the project
    await projectService.getById(ownerId, projectId);

    const events = await eventRepository.findByProjectId(projectId);

    res.status(200).json({
        success: true,
        data: events,
    });
};