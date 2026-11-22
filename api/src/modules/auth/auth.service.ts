import * as argon2 from "argon2"

import { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../../common/errors/app-error.js";
import { authRepository } from "./auth.repository.js";
import { createAccessToken } from "./jwt.service.js";

import type {
    RegisterInput,
    LoginInput
} from "./auth.shema.js"; 

export const authService = {
    // register layer
    async register(input: RegisterInput) {
        // step 1: Hash the password with library argon2
        const passwordHash = await argon2.hash(
            input.password,
            {type: argon2.argon2id}
        )

        // step 2: save user into postgreSQL
        let user;

        try {
            // create new user
            user = await authRepository.create(
                input.email,
                passwordHash
            )
        } catch (error: unknown) {
            // Unqiue email conflict
            if(
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2002"
            ) {
                throw new AppError("Account connot be created with these details", 409);
            }
            throw error;
        }

        // step 3: generate access token
        const accessToken = await createAccessToken(user.id);

        return {
            user,
            accessToken,
            tokenType: "Bearer" as const,
            expiresIn: 7200
        };
    },

    // login layer
    async login(input: LoginInput) {
        // step 1: find user by email
        const user = await authRepository.findByEmail(
            input.email
        );

        if(!user) {
            throw new AppError("Invaid email or password", 401);
        }

        // step 2: vertify password
        const isValid = await argon2.verify(
            user.passwordHash,
            input.password
        )

        if(!isValid) {
            throw new AppError("Invalid email or password", 401);
        }

        // step 3: generate access token
        const accessToken = await createAccessToken(user.id);

        return {
            // return only id and email not send the password or passwordHash
            user: {
                id: user.id,
                email: user.email
            },
            accessToken,
            tokenType: "Bearer" as const,
            expiresIn: 7200
        };
    }
}