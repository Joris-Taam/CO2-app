import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { AuthService } from "../services/AuthService";
import { UserService } from "../services/UserService";

const JWT_SECRET: string = process.env["JWT_SECRET"] ?? "fallback_secret_change_in_production";

export class AuthController {
    private static _instance: AuthController | undefined;

    private constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {
    }

    public static getInstance(): AuthController {
        if (!AuthController._instance) {
            AuthController._instance = new AuthController(
                AuthService.getInstance(),
                UserService.getInstance()
            );
        }

        return AuthController._instance;
    }

    public login = async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body as { email: string; password: string };

        if (!email || !password) {
            res.status(400).json({ message: "Email en wachtwoord zijn verplicht" });

            return;
        }

        const loggedInEmail: string | null = await this.authService.login(email, password);

        if (!loggedInEmail) {
            res.status(401).json({ message: "Ongeldig e-mailadres of wachtwoord" });

            return;
        }

        const user: { email: string | null; name: string } | null =
            await this.userService.getUserByEmail(email);

        if (!user || !user.email) {
            res.status(500).json({ message: "Fout bij ophalen gebruikersgegevens" });

            return;
        }

        const token: string = jwt.sign(
            { email: user.email, name: user.name },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.cookie("user", loggedInEmail, { sameSite: "lax" })
            .cookie("token", token, { httpOnly: true, sameSite: "lax" })
            .json({ token, email: loggedInEmail, name: user.name });
    };

    public logout = (_req: Request, res: Response): void => {
        res.clearCookie("user")
            .clearCookie("token")
            .status(204)
            .end();
    };
}
