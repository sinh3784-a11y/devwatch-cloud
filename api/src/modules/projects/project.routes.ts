import { Router } from "express";

import {
    createProject,
    getAllProjects,
    getProjectById
} from "./project.controller.js";

import { createProjectKey } from "../api-keys/api-key.controller.js";

import { getProjectEvents } from "../events/event.controller.js";

const router = Router();

router.post("/", createProject);

router.get("/", getAllProjects);

router.post("/:id/keys", createProjectKey);

router.get("/:id/events", getProjectEvents);

router.get("/:id", getProjectById);

export default router;