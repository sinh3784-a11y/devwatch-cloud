import { z } from "zod";

//validate of register
export const registerSchema = z.strictObject({
    email: z.email().trim().toLowerCase(),
    password: z.string().trim()
                .min(8, "Password must have at 8 characters")
                .max(128, "Password is too long")
});

// validate of login
export const loginSchema = z.strictObject({
    email: z.email().trim().toLowerCase(),
    password: z.string().min(1)
})

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>