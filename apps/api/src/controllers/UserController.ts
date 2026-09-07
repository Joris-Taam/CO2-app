import { Request, Response } from "express";
import { UserService } from "@api/services/UserService";
import { User } from "@api/models/User";
import { AuthRequest } from "@api/middleware/AuthMiddleware";

/**
 * Controller for handling user-related HTTP requests.
 */
export class UserController {
    private static _instance: UserController | undefined;

    private constructor(private userService: UserService) {

    }

    public static getInstance(): UserController {
        if (!UserController._instance) {
            UserController._instance = new UserController(UserService.getInstance());
        }

        return UserController._instance;
    }

    /**
     * Retrieves all users.
     *
     * @param _req - The HTTP request object (unused)
     * @param res - The HTTP response object
     */
    public getAllUsers = async (_req: Request, res: Response): Promise<void> => {
        try {
            const users: Awaited<ReturnType<typeof this.userService.getAllUsers>> =
                await this.userService.getAllUsers();

            res.json(users);
        }
        catch {
            res.status(500).json({ message: "Server error" });
        }
    };

    /**
     * Retrieves a user by their email address.
     *
     * @param req - The HTTP request object containing the email param
     * @param res - The HTTP response object
     */
    public getUserByEmail = async (
        req: Request<{ email: string }>,
        res: Response
    ): Promise<void> => {
        const email: string = req.params.email;
        const user: Awaited<ReturnType<typeof this.userService.getUserByEmail>> =
            await this.userService.getUserByEmail(email);

        if (!user) {
            res.status(404).json({ message: "User not found" });

            return;
        }

        res.json(user);
    };

    /**
     * Creates a new user.
     *
     * @param req - The HTTP request object containing the user data in the body
     * @param res - The HTTP response object
     */
    public createUser = async (req: Request, res: Response): Promise<void> => {
        const user: User = req.body as User;
        const createdUser: Awaited<ReturnType<typeof this.userService.createUser>> =
            await this.userService.createUser(user);

        res.status(201).json(createdUser);
    };

    /**
     * Updates an existing user by email.
     *
     * @param req - The HTTP request object containing the email param and updated data
     * @param res - The HTTP response object
     */
    public updateUser = async (
        req: Request<{ email: string }>,
        res: Response
    ): Promise<void> => {
        const email: string = req.params.email;
        const { currentPassword, ...user }: Partial<User> & { currentPassword?: string } =
            req.body as Partial<User> & { currentPassword?: string };

        if (user.password !== undefined && user.password.trim() !== "") {
            if (!currentPassword) {
                res.status(400).json({ message: "Huidig wachtwoord is verplicht" });

                return;
            }

            const valid: Awaited<ReturnType<typeof this.userService.verifyPassword>> =
                await this.userService.verifyPassword(email, currentPassword);

            if (!valid) {
                res.status(401).json({ message: "Huidig wachtwoord is onjuist" });

                return;
            }
        }

        const updatedUser: Awaited<ReturnType<typeof this.userService.updateUser>> =
            await this.userService.updateUser(email, user);

        if (!updatedUser) {
            res.status(404).json({ message: "User not found" });

            return;
        }

        res.json(updatedUser);
    };

    /**
     * Deletes a user by their email address.
     *
     * @param req - The HTTP request object containing the email param
     * @param res - The HTTP response object
     */
    public deleteUser = async (
        req: Request<{ email: string }>,
        res: Response
    ): Promise<void> => {
        const email: string = req.params.email;
        const deleted: Awaited<ReturnType<typeof this.userService.deleteUser>> =
            await this.userService.deleteUser(email);

        if (!deleted) {
            res.status(404).json({ message: "User not found" });

            return;
        }

        res.json({ message: "User deleted successfully" });
    };

    /**
     * Retrieves the currently authenticated user.
     *
     * @param req - The HTTP request object containing the authenticated user
     * @param res - The HTTP response object
     */
    public getCurrentUser = async (req: Request, res: Response): Promise<void> => {
        const authReq: AuthRequest = req as AuthRequest;
        const email: string = authReq.user.email;

        const user: Awaited<ReturnType<typeof this.userService.getUserByEmail>> =
            await this.userService.getUserByEmail(email);

        if (!user) {
            res.status(404).json({ message: "User not found" });

            return;
        }

        res.json(user);
    };
}
