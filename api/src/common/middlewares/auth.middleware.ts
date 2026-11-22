import type {
    Request,
    RequestHandler
} from "express"

import { AppError } from "../errors/app-error.js"

import { vertifyAccessToken } from "../../modules/auth/jwt.service.js"
import { authRepository } from "../../modules/auth/auth.repository.js"

export const requireAuth: RequestHandler = async (
    req,
    _res,
    next
) => {
    const authorization = req.get("authorization");

    if(!authorization) {
        throw new AppError("Authentication requied", 401);
    }

    const parts = authorization.split("");

    if(
        parts.length !==2 ||
        parts[0] !== "Bearer" ||
        !parts[1]
    ) {
        throw new AppError("Invalid authorization header", 401);
    }

    // vertify jwt signature and claims
    const userId = await vertifyAccessToken(parts[1])

    // confirm user still exists in the database
    const user = await authRepository.findById(userId);

    if (!user) {
        throw new AppError(
        "Invalid access token",
        401
        );
    }

    // Attach authenticated identity to request
    req.auth = {
        userId: user.id,
    };

    next();
}

// Helper for protected controllers
export function getAuthUserId(req: Request): string {
  if (!req.auth) {
    throw new AppError(
      "Authentication required",
      401
    );
  }

  return req.auth.userId;
}