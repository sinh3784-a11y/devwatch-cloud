import { prisma } from "../../database/prisma.js";

export const authRepository = {
    // findByEmail use email for query data from database
    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: {email},
            select: {
                id: true,
                email: true,
                passwordHash: true
            }
        })
    },
    // findById use id for query data
    async findById(id: string) {
        return prisma.user.findUnique({
            where: {id},
            select: {id:true}
        })
    },

    // create new user
    async create(email: string, passwordHash: string) {
        return prisma.user.create({
            data: {
                email,
                passwordHash
            },
            select: {
                id: true,
                email: true
            }
        })
    }
}