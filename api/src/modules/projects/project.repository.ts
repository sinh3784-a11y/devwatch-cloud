
import { prisma } from "../../database/prisma.js";

import type {
  ProjectModel
} from "../../generated/prisma/models.js";

import type { Project } from "./project.model.js";
import type { CreateProjectInput } from "./project.schema.js";

type CreateProjectRecord = CreateProjectInput & {
  nameKey: string;
  ownerId: string;
};

function toProject(record: ProjectModel): Project {
  return {
    id: record.id,
    name: record.name,
    description: record.description,
    status: record.status,
    createdAt: record.createdAt.toISOString(),
  };
}

export const projectRepository = {

  async findAll(ownerId: string): Promise<Project[]> {

    const records = await prisma.project.findMany({
      where: {
        ownerId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return records.map(toProject);
  },

  async findById(
    id: string,
    ownerId: string
  ): Promise<Project | null> {

    const record = await prisma.project.findFirst({
      where: {
        id,
        ownerId,
      },
    });

    return record ? toProject(record) : null;
  },

  async findByNameKey(
    ownerId: string,
    nameKey: string
  ): Promise<Project | null> {

    const record = await prisma.project.findUnique({
      where: {
        ownerId_nameKey: {
          ownerId,
          nameKey,
        },
      },
    });

    return record ? toProject(record) : null;
  },

  async create(
    input: CreateProjectRecord
  ): Promise<Project> {

    const record = await prisma.project.create({
      data: {
        name: input.name,
        nameKey: input.nameKey,
        description: input.description ?? null,

        owner: {
          connect: {
            id: input.ownerId,
          },
        },
      },
    });

    return toProject(record);
  },
};
