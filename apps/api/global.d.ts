declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string;
            DB_HOST: string;
            DB_PORT: string;
            DB_DATABASE: string;
            DB_USER: string;
            DB_PASSWORD: string;
            DB_CONNECTION_LIMIT: string;
        }
    }

    namespace Express {
        export interface Request {
            sessionId?: string;
            userId?: number;
        }
    }
}

export { };
