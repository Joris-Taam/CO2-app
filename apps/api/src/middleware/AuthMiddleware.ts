import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

const JWT_SECRET: string = process.env["JWT_SECRET"] ?? "fallback_secret_change_in_production";

export interface AuthRequest extends Request {
    user: {
        email: string;
        name: string;
    };
}

export const authMiddleware: (req: Request, res: Response, next: NextFunction) => void = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader: string | undefined = req.headers.authorization;
    const token: string | undefined = authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : (req.cookies as { token?: string }).token;

    if (!token) {
        res.status(401).json({ error: "Niet geautoriseerd" });

        return;
    }

    try {
        const decoded: unknown = jwt.verify(token, JWT_SECRET);

        if (typeof decoded === "string" || !decoded || typeof decoded !== "object") {
            res.status(401).json({ error: "Ongeldige token payload" });

            return;
        }

        const payload: { email?: unknown; name?: unknown } = decoded;

        if (typeof payload.email !== "string" || typeof payload.name !== "string" || !payload.email || !payload.name) {
            res.status(401).json({ error: "Ongeldige token payload" });

            return;
        }

        (req as AuthRequest).user = {
            email: payload.email,
            name: payload.name,
        };

        next();
    }
    catch (error) {
        console.error("AuthMiddleware Error:", error);
        res.status(401).json({ error: "Ongeldige of verlopen token" });
    }
};
