import { UserService } from "../services/UserService";
import { User } from "@web/Models/Users";
import "@web/components/AdminSidebarComponent";

const userService: UserService = new UserService();

function el(id: string): HTMLElement {
    return document.getElementById(id) as HTMLElement;
}

function inp(id: string): HTMLInputElement {
    return document.getElementById(id) as HTMLInputElement;
}

function getEmailFromCookie(): string | null {
    const match: RegExpMatchArray | null = document.cookie.match(/(?:^|; )user=([^;]*)/);

    return match ? decodeURIComponent(match[1]) : null;
}

const email: string | null = getEmailFromCookie();
const profileInputs: NodeListOf<HTMLInputElement> = document.querySelectorAll<HTMLInputElement>("#profile-form input");

document.addEventListener("DOMContentLoaded", async () => {
    if (!email) {
        return;
    }

    try {
        const fetchedUser: User = await userService.getByEmail(email);
        inp("email").value = fetchedUser.email ?? "";

        const checkboxes: NodeListOf<HTMLInputElement> = document.querySelectorAll<HTMLInputElement>(".schema-container input[type='checkbox']");

        checkboxes.forEach(cb => {
            cb.disabled = true;
        });

        if (fetchedUser.schedule) {
            const activeDays: string[] = fetchedUser.schedule.split(", ");
            checkboxes.forEach(cb => {
                cb.checked = activeDays.includes(cb.value);
                cb.disabled = true;
            });
        }
    }
    catch (err: unknown) {
        console.error(err);
    }
});

el("login-edit-btn").addEventListener("click", () => {
    el("login-form").classList.add("editing");
    inp("current-password").readOnly = false;
});

el("login-form").addEventListener("submit", async e => {
    e.preventDefault();

    if (!email) {
        return;
    }

    const result: { ok: boolean; message?: string } = await userService.updateCredentials(email, {
        currentPassword: inp("current-password").value,
        password: inp("new-password").value || undefined,
    });

    if (result.ok) {
        el("login-form").classList.remove("editing");
        inp("current-password").readOnly = true;
        ["current-password", "new-password"].forEach(id => inp(id).value = "");
        el("login-success").textContent = "Wachtwoord opgeslagen";
        el("login-success").classList.add("visible");
    }
    else {
        el("login-error").textContent = result.message ?? "Er is iets misgegaan";
        el("login-error").classList.add("visible");
    }
});

el("profile-edit-btn").addEventListener("click", () => {
    el("profile-form").classList.add("editing");
    profileInputs.forEach(i => i.readOnly = false);
    const checkboxes: NodeListOf<HTMLInputElement> = document.querySelectorAll<HTMLInputElement>(".schema-container input");
    checkboxes.forEach(cb => cb.disabled = false);
});

el("profile-form").addEventListener("submit", async e => {
    e.preventDefault();

    if (!email) {
        return;
    }

    try {
        const checkboxes: NodeListOf<HTMLInputElement> = document.querySelectorAll<HTMLInputElement>(".schema-container input[type='checkbox']");
        const scheduleToString: string = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value).join(", ");
        await userService.updateProfile(email, {
            schedule: scheduleToString,
        });
        el("profile-form").classList.remove("editing");
        profileInputs.forEach(i => i.readOnly = true);
        el("profile-success").textContent = "Gegevens opgeslagen";
        el("profile-success").classList.add("visible");
    }
    catch (err: unknown) {
        console.error(err);
        el("profile-error").textContent = "Er is iets misgegaan";
        el("profile-error").classList.add("visible");
    }
});
