import { UserService } from "./UserService";
import { User } from "@web/Models/Users";

const AUTH_URL: string = "http://localhost:3001/auth";

export class AuthService {
    private userService: UserService = new UserService();

    public getEmailFromCookie(): string | null {
        const match: RegExpMatchArray | null = document.cookie.match(/(?:^|; )user=([^;]*)/);

        return match ? decodeURIComponent(match[1]) : null;
    }

    // Controleert of de gebruiker is ingelogd, stuurt door naar loginpagina indien niet
    public checkAuth(): void {
        const email: string | null = this.getEmailFromCookie();

        if (!email) {
            window.location.href = "/login.html";
        }
    }

    public async checkAdminAccess(): Promise<void> {
        const email: string | null = this.getEmailFromCookie();

        if (!email) {
            window.location.href = "/login.html";

            return;
        }

        const user: User = await this.userService.getByEmail(email);

        if (user.role_name?.toLowerCase() !== "admin") {
            window.location.href = "/login.html";
        }
    }

    public async login(email: string, password: string): Promise<boolean> {
        const response: Response = await fetch(`${AUTH_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });

        return response.ok;
    }

    public async logout(): Promise<void> {
        await fetch(`${AUTH_URL}/logout`, {
            method: "DELETE",
            credentials: "include",
        });
    }
}
