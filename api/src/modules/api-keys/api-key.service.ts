import {
    randomBytes,
    createHash,
    timingSafeEqual,
    verify
} from "node:crypto";

import { z } from "zod";

import { projectService } from "../projects/project.service.js";
import { apiKeyRepository } from "./api-key.repository.js";

import { AppError } from "../../common/errors/app-error.js";

const KEY_LIFETIME = 90;

function hashSecret(secret: string): Buffer {
    return createHash("sha256")
            .update(secret, "utf-8")
            .digest()
}

export const apiKeyService = {
    async issue(
        ownerId: string,
        projectId: string,
        label: string
    ) {
        // confirm that the user owns this project
        await projectService.getById(ownerId, projectId);

        // generate a cryptographically secure secret
        const secret = randomBytes(32).toString("base64url");

        // store only secret hash
        const keyHash = hashSecret(secret).toString("hex");

        const expiresAt = new Date(
            Date.now() + KEY_LIFETIME * 24 * 60 * 1000
        );

        const key = await apiKeyRepository.create(
            projectId,
            label,
            keyHash,
            expiresAt
        )

        return {
           id: key.id,
           label: key.label,
           expiresAt: key.expiresAt.toISOString(),

            // display only once
            apiKey: `dw_${key.id}.${secret}`,
        }
    },

    async verify(token: string): Promise<string> {
        const match = /^dw_([0-9a-f-]{36})\.([A-Za-z0-9_-]{43})$/.exec(token);

        if(!match) {
            throw new AppError("Invalid project API key", 401);
        }

        const parsedId = z.uuid().safeParse(match[1]);

        if(!parsedId.success) {
            throw new AppError("Invalid project API key", 401);
        }

        const record = await apiKeyRepository.findById(
            parsedId.data
        );

        if(
            !record ||
            record.revokedAt !== null ||
            record.expiresAt <= new Date()
        ) {
            throw new AppError("Invalid or expired API key", 401);
        }

        const expected = Buffer.from(record.keyHash, "hex");
        const actual = hashSecret(match[2]);

        if(
            expected.length !== actual.length ||
            !timingSafeEqual(expected, actual)
        ) {
            throw new AppError("Invalid project API key", 401);
        }

        return record.projectId;
    }
}