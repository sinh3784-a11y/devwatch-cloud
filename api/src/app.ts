import express from "express";

import { env } from "node:process";

import { errorMiddleware } from "./common/middlewares/error.middleware.js";

import { notFoundMiddleware } from "./common/middlewares/not-found.middleware.js";

const app = express();

// Security: hide Express identifier header
app.disable("x-powered-by");

//Middleware: pare JSON request bodies
app.use(express.json({ limit: "64kb"}))

// Health check route
app.get("/api/v1/health", (_req, res) => {
    res.status(200).json({
        sucess: true,
        message: "Devwatch Cloud API is running",
        timestamp: new Date().toISOString(),
    })
})

// example 
app.get("/api/v1/info", (_req, res) => {
    res.status(200).json({
        sucess: true,
        project: "DevWatch Cloud",
        version: "1.0.0",
        developerMode: true
    })
})

// Test error route for development only
if(env.NODE_ENV !== "production") {
    app.get("/api/v1/test-error", () => {
        throw new Error("Test unexpected server error")
    });
}

// Handle unmatched routes
app.use(notFoundMiddleware);

// Handle application errors
app.use(errorMiddleware);

export default app;