declare global {
    namespace Express {
        interface Request {
            auth?: {
                userId: string;
            };

            ingestion?: {
                projectId: string;
            };
        }
    }
}

export {}