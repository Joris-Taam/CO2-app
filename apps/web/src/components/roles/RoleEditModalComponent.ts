import { Role } from "@web/Models/Roles";

class RoleEditModalComponent extends HTMLElement {
    private modal!: HTMLElement;
    private nameInput!: HTMLInputElement;
    private descriptionInput!: HTMLTextAreaElement;
    private nameError!: HTMLSpanElement;
    private editingName: string | null = null;

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.innerHTML = `
            <link rel="stylesheet" href="/assets/css/AdminRoles.css">
            <link rel="stylesheet" href="/assets/css/global.css">
            <div class="modal" id="edit-modal">
                <div class="modal-content">
                    <button class="close-btn" id="close-edit">&times;</button>
                    <h2>Wijzig rol</h2>
                    <form id="edit-role-form">
                        <input type="text" id="edit-role-name" placeholder="Nieuwe role naam" autocomplete="off" />
                        <span class="field-error" id="edit-name-error"></span>
                        <textarea id="edit-role-description" placeholder="Omschrijving" rows="3"></textarea>
                        <button type="submit" class="btn btn-primary">Opslaan</button>
                    </form>
                </div>
            </div>
        `;

        const s: ShadowRoot = this.shadowRoot!;
        this.modal = s.getElementById("edit-modal") as HTMLElement;
        this.nameInput = s.getElementById("edit-role-name") as HTMLInputElement;
        this.descriptionInput = s.getElementById("edit-role-description") as HTMLTextAreaElement;
        this.nameError = s.getElementById("edit-name-error") as HTMLSpanElement;

        s.getElementById("close-edit")!.addEventListener("click", () => {
            this.close();
        });
        this.modal.addEventListener("click", (e: MouseEvent) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        s.getElementById("edit-role-form")!.addEventListener("submit", (e: Event) => {
            e.preventDefault();
            const newName: string = this.nameInput.value.trim();
            const description: string = this.descriptionInput.value.trim();

            if (!newName) {
                this.nameError.textContent = "Role name is niet geldig";

                return;
            }

            this.dispatchEvent(new CustomEvent("role-edit-submit", {
                detail: { oldName: this.editingName, newName, description },
                bubbles: true,
                composed: true,
            }));
        });
    }

    public open(role: Role): void {
        this.editingName = role.name;
        this.nameInput.value = role.name;
        this.descriptionInput.value = role.description;
        this.nameError.textContent = "";
        this.modal.classList.add("show");
        this.nameInput.focus();
    }

    public close(): void {
        this.modal.classList.remove("show");
        this.editingName = null;
    }

    public setError(msg: string): void {
        this.nameError.textContent = msg;
    }
}

customElements.define("role-edit-modal", RoleEditModalComponent);
