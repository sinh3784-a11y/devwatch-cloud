import "dotenv/config";
import process from "node:process";

const port = Number(process.env.PORT ?? 4000);
const databaseUrl = process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET;

//check port
if(
    !Number.isInteger(port) || //Number.isInteger use for combine string to integer
    port < 1 ||
    port > 65535
) {
    throw new Error("Invalid PORT configuration")
}
// check databaseUrl
if(!databaseUrl) {
    throw new Error("DATAASE_URL is requied");
}

if(!jwtSecret || Buffer.byteLength(jwtSecret, "utf8") < 32) {
    throw new Error("JWT_SECRET must be at least 32 bytes");
}

export const env = {
    PORT: port,
    NODE_ENV: process.env.NODE_ENV ?? "development",
    DATABASE_URL: databaseUrl,
    JWT_SECRET: jwtSecret,
};