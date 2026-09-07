import { afterEach, describe, expect, it, vi, type MockInstance } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { AuthService } from "@web/services/AuthService";
import { RoleService } from "@web/services/RolesService";
import { UserService } from "@web/services/UserService";
import { User } from "@web/Models/Users";

vi.mock("@web/components/AdminSidebarComponent", () => ({}));

const mockUsers: User[] = [
    {
        name: "Jan Jansen",
        email: "jan@example.com",
        password: "secret",
        role_name: "Admin",
        department_name: "IT",
        location_address: "Damrak 1",
        location_city: "Amsterdam",
        schedule: "9-17",
    },
];

// Load HTML BEFORE the module import so DOM refs are valid when captured
document.body.innerHTML = readFileSync(resolve(process.cwd(), "wwwroot/AdminUser.html"), "utf-8");

vi.spyOn(AuthService.prototype, "checkAdminAccess").mockResolvedValue();
vi.spyOn(RoleService.prototype, "getAll").mockResolvedValue([{ name: "Admin", description: "Administrator" }]);
vi.spyOn(UserService.prototype, "getAll").mockResolvedValue(mockUsers);
vi.spyOn(UserService.prototype, "getByEmail").mockResolvedValue(mockUsers[0]);

await import("../../src/pages/AdminUser");

document.dispatchEvent(new Event("DOMContentLoaded"));

await new Promise<void>(resolve => setTimeout(resolve, 0));

describe("AdminUser", () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.spyOn(UserService.prototype, "getAll").mockResolvedValue(mockUsers);
        vi.spyOn(UserService.prototype, "getByEmail").mockResolvedValue(mockUsers[0]);
    });

    describe("handleCreateUser", () => {
        it("calls UserService.create with the filled form values", async () => {
            const createSpy: MockInstance = vi.spyOn(UserService.prototype, "create").mockResolvedValue({} as User);

            const nameInput: HTMLInputElement = document.getElementById("user-name") as HTMLInputElement;
            const emailInput: HTMLInputElement = document.getElementById("user-email") as HTMLInputElement;
            const passwordInput: HTMLInputElement = document.getElementById("user-password") as HTMLInputElement;
            const roleInput: HTMLSelectElement = document.getElementById("user-role") as HTMLSelectElement;
            const departmentInput: HTMLSelectElement = document.getElementById("user-department") as HTMLSelectElement;
            const locationInput: HTMLSelectElement = document.getElementById("user-location") as HTMLSelectElement;

            nameInput.value = "Jan Jansen";
            emailInput.value = "jan@example.com";
            passwordInput.value = "geheim123";
            roleInput.value = "Admin";
            departmentInput.value = "IT";
            locationInput.value = "Damrak 1|Amsterdam";

            const form: HTMLFormElement = document.getElementById("create-user-form") as HTMLFormElement;
            form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

            await new Promise<void>(resolve => setTimeout(resolve, 0));

            expect(createSpy).toHaveBeenCalledWith({
                name: "Jan Jansen",
                email: "jan@example.com",
                password: "geheim123",
                role_name: "Admin",
                department_name: "IT",
                location_address: "Damrak 1",
                location_city: "Amsterdam",
            });
        });

        it("calls UserService.update with changed fields when in edit mode", async () => {
            const updateSpy: MockInstance = vi.spyOn(UserService.prototype, "update").mockResolvedValue({} as User);

            const editBtn: HTMLButtonElement = document.querySelector(".edit-btn") as HTMLButtonElement;
            editBtn.click();

            await new Promise<void>(resolve => setTimeout(resolve, 0));

            const nameInput: HTMLInputElement = document.getElementById("user-name") as HTMLInputElement;
            const roleInput: HTMLSelectElement = document.getElementById("user-role") as HTMLSelectElement;
            const departmentInput: HTMLSelectElement = document.getElementById("user-department") as HTMLSelectElement;
            const locationInput: HTMLSelectElement = document.getElementById("user-location") as HTMLSelectElement;

            nameInput.value = "Piet Pietersen";
            roleInput.value = "Admin";
            departmentInput.value = "IT";
            locationInput.value = "Damrak 1|Amsterdam";

            const form: HTMLFormElement = document.getElementById("create-user-form") as HTMLFormElement;
            form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

            await new Promise<void>(resolve => setTimeout(resolve, 0));

            expect(updateSpy).toHaveBeenCalledWith("jan@example.com", {
                name: "Piet Pietersen",
                role_name: "Admin",
                department_name: "IT",
                location_address: "Damrak 1",
                location_city: "Amsterdam",
            });
        });
    });
});
