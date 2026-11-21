import type { RequestHandler } from "express";

import { AppError } from "../errors/app-error.js";

//custom error when user get the unknown route
export const notFoundMiddleware: RequestHandler = (
    req,
    res,
    next
) => {
    next (
        new AppError(
            `Route ${req.method} ${req.originalUrl} not found`,
            404
        )
    )
}