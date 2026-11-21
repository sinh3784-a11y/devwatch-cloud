import type { ErrorRequestHandler } from "express";

import { AppError } from "../errors/app-error.js";

export const errorMiddleware: ErrorRequestHandler = (
    error: unknown,
    _req,
    res,
    next
) => {
    if(res.headersSent) {
        return next(error);
    }

    const isAppError = error instanceof AppError

    const statusCode = isAppError
        ? error.statusCode : 500;

    const message = isAppError 
        ? error.message : "Internal Server Error"

    if(statusCode >= 500) {
        console.error("[SERVER ERROR]", error)
    }

    res.status(statusCode).json({
        success: false,
        message
    })
};