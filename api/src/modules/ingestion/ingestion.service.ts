import { redactText } from "../../common/utils/redact.js";

import { eventRepository } from "../events/event.repository.js";

import type {
    IngestEventInput
} from "../events/event.schema.js"

export const ingestionService = {
    async ingest(
        projectId: string,
        input: IngestEventInput
    ) {
        const safeMassage = redactText(input.message);

        const safeStack = input.stack
            ? redactText(input.stack) : null;

        const occurredAt = input.occurredAt
            ? new Date(input.occurredAt) : new Date();

        return eventRepository.create(projectId, {
            level: input.level,
            source: input.source,
            message: safeMassage,
            stack: safeStack,
            occurredAt,
        });
    }
}