
import { AppError } from
  "../../common/errors/app-error.js";

import { Prisma } from
  "../../generated/prisma/client.js";

import { projectRepository } from "./project.repository.js";

import type { Project } from "./project.model.js";
import type { CreateProjectInput } from "./project.schema.js";

export const projectService = {

  async create(
    ownerId: string,
    input: CreateProjectInput
  ): Promise<Project> {

    const name = input.name.trim();
    const nameKey = name.toLowerCase();

    const existing = await projectRepository.findByNameKey(
      ownerId,
      nameKey
    );

    if (existing) {
      throw new AppError(
        "Project name already exists",
        409
      );
    }

    try {
      return await projectRepository.create({
        ...input,
        name,
        nameKey,
        ownerId,
      });

    } catch (error: unknown) {

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError(
          "Project name already exists",
          409
        );
      }

      throw error;
    }
  },

  async findAll(ownerId: string): Promise<Project[]> {
    return projectRepository.findAll(ownerId);
  },

  async getById(
    ownerId: string,
    projectId: string
  ): Promise<Project> {

    const project = await projectRepository.findById(
      projectId,
      ownerId
    );

    if (!project) {
      throw new AppError(
        "Project not found",
        404
      );
    }

    return project;
  },
};
