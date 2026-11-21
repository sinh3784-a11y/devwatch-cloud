import "dotenv/config";
import process from "node:process";

const port = Number(process.env.PORT ?? 4000);

//check port
if(
    !Number.isInteger(port) || //Number.isInteger use for combine string to integer
    port < 1 ||
    port > 65535
) {
    throw new Error("Invalid PORT configuration")
}

export const env = {
    PORT: port,
    NODE_ENV: process.env.NODE_ENV ?? "development",
};