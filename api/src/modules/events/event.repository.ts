import { prisma } from "../../database/prisma.js";

import type {
    IngestEventInput
} from "./event.schema.js";

type CreateEventRecord = {
    level: IngestEventInput["level"];
    source: string;
    message: string;
    stack: string | null;
    occurredAt: Date;
};

export const eventRepository = {
    async create(
        projectId: string,
        input: CreateEventRecord
    ) {
        return prisma.errorEvent.create({
            data: {
                project: {
                    connect: { id: projectId},
                },
                level: input.level,
                source: input.source,
                message: input.message,
                stack: input.stack,
                occurredAt: input.occurredAt
            },
        })
    },

    async findByProjectId(
        projectId: string
    ) {
        return prisma.errorEvent.findMany({
            where: { projectId, },
            orderBy: {
                receivedAt: "desc",
            },
            take: 50,
            select: {
                id: true,
                level: true,
                source: true,
                message: true,
                stack: true,
                occurredAt: true,
                receivedAt: true,
            },
        });
    },
}