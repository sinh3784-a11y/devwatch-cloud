import { prisma } from "../../database/prisma.js";

export const apiKeyRepository = {
    async create(
        projectId: string,
        label: string,
        keyHash: string,
        expiresAt: Date
    ) {
        return prisma.projectApiKey.create({
            data: {
                project: {
                    connect: {id: projectId},
                },
                label,
                keyHash,
                expiresAt
            },
            select: {
                id: true,
                label: true,
                expiresAt: true
            },
        });
    },

    async findById(id: string) {
        return prisma.projectApiKey.findUnique({
            where: {id},
            select: {
                id: true,
                projectId: true,
                keyHash: true,
                expiresAt: true,
                revokedAt: true
            },
        });
    },
};