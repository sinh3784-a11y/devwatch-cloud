import type { RequestHandler } from "express";

import {
    registerSchema,
    loginSchema
} from "./auth.shema.js"

import { authService } from "./auth.service.js";

export const register: RequestHandler = async (
    req,
    res
) => {
    const parsed = registerSchema.safeParse(req.body);

    if(!parsed.success) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            error : parsed.error.issues.map(issue => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        })
        return;
    }

    const result = await authService.register(parsed.data);

    res.status(201).json({
        success: true,
        message: "Account created",
        data: result,
    });
};

export const login: RequestHandler = async (
    req,
    res
) => {
    const parsed = loginSchema.safeParse(req.body);

    if(!parsed.success) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
        });
        return
    }

    const result = await authService.login(parsed.data);

    res.status(201).json({
        success: true,
        message: "Login successful",
        data: result,
    });
};