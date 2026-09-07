class RoleCreateModalComponent extends HTMLElement {
    private modal!: HTMLElement;
    private nameInput!: HTMLInputElement;
    private descriptionInput!: HTMLInputElement;
    private nameError!: HTMLSpanElement;

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.innerHTML = `
            <link rel="stylesheet" href="/assets/css/AdminRoles.css">
            <link rel="stylesheet" href="/assets/css/global.css">
            <div class="modal" id="create-modal">
                <div class="modal-content">
                    <button class="close-btn" id="close-create">&times;</button>
                    <h2>Toevoegen</h2>
                    <form id="create-role-form">
                        <input type="text" id="role-name" placeholder="Role naam" autocomplete="off" />
                        <span class="field-error" id="name-error"></span>
                        <input type="text" id="role-description" placeholder="Omschrijving" autocomplete="off" />
                        <button type="submit" class="btn btn-primary">Toevoegen</button>
                    </form>
                </div>
            </div>
        `;

        const s: ShadowRoot = this.shadowRoot!;
        this.modal = s.getElementById("create-modal") as HTMLElement;
        this.nameInput = s.getElementById("role-name") as HTMLInputElement;
        this.descriptionInput = s.getElementById("role-description") as HTMLInputElement;
        this.nameError = s.getElementById("name-error") as HTMLSpanElement;

        s.getElementById("close-create")!.addEventListener("click", () => {
            this.close();
        });
        this.modal.addEventListener("click", (e: MouseEvent) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        s.getElementById("create-role-form")!.addEventListener("submit", (e: Event) => {
            e.preventDefault();
            const name: string = this.nameInput.value.trim();
            const description: string = this.descriptionInput.value.trim();

            if (!name) {
                this.nameError.textContent = "Role name is verplicht";

                return;
            }

            this.dispatchEvent(new CustomEvent("role-create-submit", {
                detail: { name, description },
                bubbles: true,
                composed: true,
            }));
        });
    }

    public open(): void {
        this.nameInput.value = "";
        this.descriptionInput.value = "";
        this.nameError.textContent = "";
        this.modal.classList.add("show");
        this.nameInput.focus();
    }

    public close(): void {
        this.modal.classList.remove("show");
    }

    public setError(msg: string): void {
        this.nameError.textContent = msg;
    }
}

customElements.define("role-create-modal", RoleCreateModalComponent);
