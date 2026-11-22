import { z } from "zod";
import { SignJWT, jwtVerify } from "jose";

import { env } from "../../config/env.js";
import { AppError } from "../../common/errors/app-error.js";

const secret = new TextEncoder().encode(env.JWT_SECRET);

const ISSUER = "devwatch-cloud";
const AUDIENCE = "devwatch-dashboard";

export async function createAccessToken(
    userId: string
): Promise<string> {
    return new SignJWT({})
            .setProtectedHeader({
                alg: "HS256",
                typ: "JWT"
            })
            .setSubject(userId)
            .setIssuer(ISSUER)
            .setIssuedAt()
            .setAudience(AUDIENCE)
            .setExpirationTime("15m")
            .sign(secret);
}

export async function vertifyAccessToken(
    token: string
): Promise<string> {
    try {
        const { payload } = await jwtVerify(token, secret, {
            algorithms: ["HS256"],
            issuer: ISSUER,
            audience: AUDIENCE
        });

        const result = z.uuid().safeParse(payload.sub);

        if(!result.success) {
            throw new Error("Invalid token subject")
        }
        // return with token
        return result.data;
    } catch (error) {
        throw new AppError("Invalid or expired access token", 401)
    }
}
