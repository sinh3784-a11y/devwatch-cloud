import { z } from "zod";

export const ingestEventSchema = z.strictObject({
    level: z.enum(["WARN","ERROR","FATAL"]),
    source: z.string()
        .trim()
        .min(2)
        .max(80),
    
    message: z.string()
        .trim()
        .min(1)
        .max(2000),

    stack: z.string()
        .max(12000)
        .optional(),

    occurredAt: z.iso.datetime({ // ISO DateTime use for get the Timezone offset
        offset: true,
    }).optional(),
});

export type IngestEventInput = z.infer<typeof ingestEventSchema>;

// {
//   "level": "ERROR",
//   "source": "warehouse-api",
//   "message": "Database connection failed",
//   "stack": "Error: Database connection failed",
//   "occurredAt": "2026-11-23T10:30:00+07:00"
// }