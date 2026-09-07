import { AuthService } from "../services/AuthService";
import { UserService } from "../services/UserService";
import { User } from "@web/Models/Users";

const authService: AuthService = new AuthService();
const userService: UserService = new UserService();

document.addEventListener("DOMContentLoaded", () => {
    const form: HTMLFormElement = document.getElementById("login-form") as HTMLFormElement;
    const errorMessage: HTMLParagraphElement = document.getElementById("error-message") as HTMLParagraphElement;

    form.addEventListener("submit", async (event: Event) => {
        event.preventDefault();

        const email: string = (document.getElementById("email") as HTMLInputElement).value;
        const password: string = (document.getElementById("password") as HTMLInputElement).value;

        const success: boolean = await authService.login(email, password);

        if (success) {
            const user: User = await userService.getByEmail(email);

            if (user.role_name?.toLowerCase() === "admin") {
                window.location.href = "/AdminUser.html";
            }
            else {
                window.location.href = "/Trip.html";
            }
        }
        else {
            errorMessage.textContent = "Ongeldig e-mailadres of wachtwoord.";
            errorMessage.hidden = false;
        }
    });
});
