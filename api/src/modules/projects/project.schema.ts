import { z } from "zod";

export const createProjectSchema = z.strictObject({
    name: z.string().trim().min(3,"Project name must have at least 3 characters").max(100, "Project name is too long"),
    description: z.string().trim().max(500, "Description is to long").optional(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>