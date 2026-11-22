
import express from "express";

import { env } from "./config/env.js";

import { errorMiddleware } from
  "./common/middlewares/error.middleware.js";

import { notFoundMiddleware } from
  "./common/middlewares/not-found.middleware.js";

import { requireAuth } from
  "./common/middlewares/auth.middleware.js";

import authRoutes from "./modules/auth/auth.routes.js";
import projectRoutes from "./modules/projects/project.routes.js";

const app = express();

app.disable("x-powered-by");

app.use(express.json({ limit: "64kb" }));

// Public: Health check
app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "DevWatch Cloud API is running",
  });
});

// Public: Register and Login
app.use("/api/v1/auth", authRoutes);

// Protected: Project Management
app.use(
  "/api/v1/projects",
  requireAuth,
  projectRoutes
);

// Development-only error test
if (env.NODE_ENV !== "production") {
  app.get("/api/v1/test-error", () => {
    throw new Error("Test unexpected server error");
  });
}

// Handle unknown routes
app.use(notFoundMiddleware);

// Global error handling
app.use(errorMiddleware);

export default app;