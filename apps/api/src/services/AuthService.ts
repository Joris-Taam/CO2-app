import { UserService } from "./UserService";

/**
 * Service for handling authentication logic.
 */
export class AuthService {
    private static _instance: AuthService | undefined;

    private constructor(private readonly userService: UserService) {

    }

    public static getInstance(): AuthService {
        if (!AuthService._instance) {
            AuthService._instance = new AuthService(UserService.getInstance());
        }

        return AuthService._instance;
    }

    /**
     * Validates user credentials and returns the email if successful.
     *
     * @param email - The email address of the user
     * @param password - The plain text password to verify
     * @returns The email if login is successful, otherwise null
     */
    public async login(email: string, password: string): Promise<string | null> {
        const user: Awaited<ReturnType<typeof this.userService.getUserByEmail>> =
            await this.userService.getUserByEmail(email);

        if (!user) {
            return null;
        }

        const passwordMatch: boolean = await this.userService.verifyPassword(email, password);

        if (!passwordMatch) {
            return null;
        }

        return email;
    }

    /**
     * Logs out the current user.
     *
     * @remarks The cookie is removed by the controller
     */
    public async logout(): Promise<void> {
        // cookie wordt verwijderd door de controller
    }
}
