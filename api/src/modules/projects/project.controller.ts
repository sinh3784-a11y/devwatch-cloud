
import type { RequestHandler } from "express";
import { z } from "zod";

import { getAuthUserId } from
  "../../common/middlewares/auth.middleware.js";

import { createProjectSchema } from "./project.schema.js";
import { projectService } from "./project.service.js";

export const createProject: RequestHandler = async (
  req,
  res
) => {

  const ownerId = getAuthUserId(req);

  const parsed = createProjectSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parsed.error.issues.map(issue => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  const project = await projectService.create(
    ownerId,
    parsed.data
  );

  res.status(201).json({
    success: true,
    data: project,
  });
};

export const getAllProjects: RequestHandler = async (
  req,
  res
) => {

  const ownerId = getAuthUserId(req);

  const projects = await projectService.findAll(ownerId);

  res.status(200).json({
    success: true,
    data: projects,
  });
};

export const getProjectById: RequestHandler<{
  id: string;
}> = async (req, res) => {

  const ownerId = getAuthUserId(req);

  const parsedId = z.uuid().safeParse(req.params.id);

  if (!parsedId.success) {
    res.status(400).json({
      success: false,
      message: "Invalid project ID",
    });
    return;
  }

  const project = await projectService.getById(
    ownerId,
    parsedId.data
  );

  res.status(200).json({
    success: true,
    data: project,
  });
};
