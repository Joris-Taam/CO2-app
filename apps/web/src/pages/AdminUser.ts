import { UserService } from "@web/services/UserService";
import "@web/components/AdminSidebarComponent";
import { RoleService } from "@web/services/RolesService";
import { User } from "@web/Models/Users";
import { Role } from "@web/Models/Roles";
import { AuthService } from "../services/AuthService";

void new AuthService().checkAdminAccess();

const roleService: RoleService = new RoleService();
const userService: UserService = new UserService();

const container: HTMLElement = document.getElementById("user-container") as HTMLElement;

const modal: HTMLDivElement = document.getElementById("user-modal") as HTMLDivElement;
const openBtn: HTMLButtonElement = document.getElementById("open-create") as HTMLButtonElement;
const closeBtn: HTMLButtonElement = document.getElementById("close-modal") as HTMLButtonElement;

const form: HTMLFormElement = document.getElementById("create-user-form") as HTMLFormElement;

const nameInput: HTMLInputElement = document.getElementById("user-name") as HTMLInputElement;
const emailInput: HTMLInputElement = document.getElementById("user-email") as HTMLInputElement;
const passwordInput: HTMLInputElement = document.getElementById("user-password") as HTMLInputElement;
const roleInput: HTMLSelectElement = document.getElementById("user-role") as HTMLSelectElement;
const departmentInput: HTMLSelectElement = document.getElementById("user-department") as HTMLSelectElement;
const locationInput: HTMLSelectElement = document.getElementById("user-location") as HTMLSelectElement;

let editMode: boolean = false;
let currentEmail: string = "";

/**
 * Updates the modal title and submit button text.
 *
 * @param title - The title to display in the modal header
 * @param buttonText - The text to display on the submit button
 */
function setModalState(title: string, buttonText: string): void {
    (modal.querySelector("h2") as HTMLHeadingElement).textContent = title;
    (form.querySelector("button[type='submit']") as HTMLButtonElement).textContent = buttonText;
}

/**
 * Displays validation errors beneath each corresponding input field.
 *
 * @param errors - A record mapping field keys to their error messages
 */
function showFieldErrors(errors: Record<string, string>): void {
    const fields: { input: HTMLElement; key: string }[] = [
        { input: nameInput, key: "name" },
        { input: emailInput, key: "email" },
        { input: passwordInput, key: "password" },
        { input: roleInput, key: "role" },
        { input: departmentInput, key: "department" },
        { input: locationInput, key: "location" },
    ];

    fields.forEach(({ input, key }: { input: HTMLElement; key: string }) => {
        const errorEl: Element | null = input.nextElementSibling;

        if (errorEl?.classList.contains("field-error")) {
            errorEl.remove();
        }

        if (errors[key]) {
            const div: HTMLDivElement = document.createElement("div");
            div.className = "field-error";
            div.style.color = "red";
            div.textContent = errors[key];
            input.insertAdjacentElement("afterend", div);
        }
    });
}

/**
 * Validates the user form and returns a record of field errors.
 *
 * @param isEditMode - Whether the form is in edit mode; skips email and password validation if true
 * @returns A record mapping field keys to their error messages
 */
function validateUserForm(isEditMode: boolean): Record<string, string> {
    const errors: Record<string, string> = {};

    const name: string = nameInput.value.trim();
    const email: string = emailInput.value.trim();
    const password: string = passwordInput.value.trim();
    const role: string = roleInput.value;
    const department: string = departmentInput.value;
    const location: string = locationInput.value;

    switch (true) {
        case !name:
            errors["name"] = "Naam is verplicht";
            break;
        case name.length < 2:
            errors["name"] = "Naam moet minimaal 2 tekens bevatten";
            break;
    }

    if (!isEditMode) {
        switch (true) {
            case !email:
                errors["email"] = "Email is verplicht";
                break;
            case !/^\S+@\S+\.\S+$/.test(email):
                errors["email"] = "Email is ongeldig";
                break;
        }

        switch (true) {
            case !password:
                errors["password"] = "Wachtwoord is verplicht";
                break;
            case password.length < 8:
                errors["password"] = "Wachtwoord moet minimaal 8 tekens bevatten";
                break;
        }
    }

    switch (true) {
        case !role:
            errors["role"] = "Rol is verplicht";
            break;
    }

    switch (true) {
        case !department:
            errors["department"] = "Afdeling is verplicht";
            break;
    }

    switch (true) {
        case !location:
            errors["location"] = "Locatie is verplicht";
            break;
    }

    return errors;
}

/**
 * Loads all roles from the API and populates the role dropdown.
 */
async function loadRoles(): Promise<void> {
    try {
        const roles: Role[] = await roleService.getAll();
        roleInput.innerHTML = "<option value=\"\">Select role</option>";
        roles.forEach((role: Role) => {
            const option: HTMLOptionElement = document.createElement("option");
            option.value = role.name;
            option.textContent = role.name;
            roleInput.appendChild(option);
        });
    }
    catch (error) {
        console.error("Failed to load roles:", error);
    }
}

/**
 * Loads all users from the API and renders them as table rows.
 */
async function loadUsers(): Promise<void> {
    try {
        const users: User[] = await userService.getAll();

        if (users.length === 0) {
            container.innerHTML = "<tr><td colspan=\"8\">No users found</td></tr>";

            return;
        }

        container.innerHTML = "";

        users.forEach((user: User) => {
            const row: HTMLTableRowElement = document.createElement("tr");
            row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email ?? ""}</td>
        <td>${user.role_name ?? ""}</td>
        <td>${user.department_name ?? ""}</td>
        <td>${user.location_address} - ${user.location_city}</td>
        <td>
        <button class="btn btn-primary btn-sm edit-btn" data-email="${user.email}">Wijzig</button>
        </td>
        <td>
            <button class="btn btn-danger btn-sm delete-btn" data-email="${user.email}">Verwijder</button>
        </td>
      `;
            container.appendChild(row);
        });

        attachEditListeners();
        attachDeleteListeners();
    }
    catch (error) {
        console.error("Error loading users:", error);
        container.innerHTML = "<tr><td colspan=\"8\" style=\"color:red;\">Error loading users</td></tr>";
    }
}

/**
 * Opens the modal by toggling CSS classes.
 */
function openModal(): void {
    modal.classList.add("show");
    modal.classList.remove("hidden");
}

/**
 * Closes the modal with a short delay to allow the hide animation to complete.
 */
function closeModal(): void {
    modal.classList.remove("show");
    setTimeout(() => modal.classList.add("hidden"), 300);
}

/**
 * Handles the create/update form submission.
 * Validates the form, builds the user object, and calls the appropriate service method.
 *
 * @param event - The form submit event
 */
async function handleCreateUser(event: Event): Promise<void> {
    event.preventDefault();

    const fieldErrors: Record<string, string> = validateUserForm(editMode);
    showFieldErrors(fieldErrors);

    if (Object.keys(fieldErrors).length > 0) {
        return;
    }

    const [address, city] = locationInput.value.split("|");

    const user: Partial<User> = {
        name: nameInput.value.trim(),
        role_name: roleInput.value || null,
        department_name: departmentInput.value || null,
        location_address: address,
        location_city: city,
    };

    if (!editMode) {
        (user as User).email = emailInput.value.trim();
        (user as User & { password: string }).password = passwordInput.value.trim();
    }

    try {
        if (editMode) {
            await userService.update(currentEmail, user);
        }
        else {
            await userService.create(user as User);
        }

        resetForm();
        closeModal();
        void loadUsers();
    }
    catch (error) {
        console.error("Failed to save user:", error);
    }
}

/**
 * Resets the form to its default create state and clears all input values.
 */
function resetForm(): void {
    form.reset();
    editMode = false;
    currentEmail = "";

    emailInput.disabled = false;
    passwordInput.value = "";

    locationInput.value = "";

    setModalState("Gebruiker toevoegen", "Opslaan");
}

/**
 * Attaches click listeners to all edit buttons in the user table.
 * Loads the selected user's data into the form and opens the modal in edit mode.
 */
function attachEditListeners(): void {
    const editButtons: NodeListOf<Element> = document.querySelectorAll(".edit-btn");

    editButtons.forEach((btn: Element) => {
        btn.addEventListener("click", async () => {
            try {
                const email: string | undefined = (btn as HTMLButtonElement).dataset["email"];

                if (!email) {
                    return;
                }

                currentEmail = email;
                editMode = true;

                const user: User = await userService.getByEmail(email);

                nameInput.value = user.name;
                emailInput.value = user.email ?? "";
                passwordInput.value = "";
                passwordInput.placeholder = "wachtwoord";
                roleInput.value = user.role_name ?? "";
                departmentInput.value = user.department_name ?? "";
                locationInput.value = `${user.location_address}|${user.location_city}`;

                emailInput.disabled = true;

                setModalState("Gebruiker aanpassen", "Bijwerken");

                openModal();
            }
            catch (error) {
                console.error("Failed to load user:", error);
            }
        });
    });
}

/**
 * Attaches click listeners to all delete buttons in the user table.
 * Prompts the user for confirmation before deleting.
 */
function attachDeleteListeners(): void {
    const deleteButtons: NodeListOf<Element> = document.querySelectorAll(".delete-btn");

    deleteButtons.forEach((btn: Element) => {
        btn.addEventListener("click", async () => {
            const email: string | undefined = (btn as HTMLButtonElement).dataset["email"];

            if (!email) {
                return;
            }

            const confirmed: boolean = window.confirm(`Weet je zeker dat je "${email}" wilt verwijderen?`);

            if (!confirmed) {
                return;
            }

            try {
                await userService.delete(email);
                void loadUsers();
            }
            catch (error) {
                console.error("Failed to delete user:", error);
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    void loadUsers();
    void loadRoles();

    openBtn.addEventListener("click", () => {
        resetForm();
        openModal();
    });

    closeBtn.addEventListener("click", closeModal);
    form.addEventListener("submit", handleCreateUser);
});
