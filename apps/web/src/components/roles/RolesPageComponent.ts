import { RoleService } from "@web/services/RolesService";
import { Role } from "@web/Models/Roles";
import { IRolesTable, IRoleCreateModal, IRoleEditModal } from "@web/components/roles/IRoleComponents";
import "@web/components/roles/RolesTableComponent";
import "@web/components/roles/RoleCreateModalComponent";
import "@web/components/roles/RoleEditModalComponent";

class RolesPageComponent extends HTMLElement {
    private roles: Role[] = [];
    private readonly roleService = new RoleService();

    private table!: IRolesTable;
    private createModal!: IRoleCreateModal;
    private editModal!: IRoleEditModal;

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.innerHTML = `
            <link rel="stylesheet" href="/assets/css/AdminRoles.css">
            <link rel="stylesheet" href="/assets/css/global.css">
            <main>
                <h1>Rollen Management</h1>
                <button class="btn btn-add mb-2" id="open-create">+ Toevoegen</button>
                <roles-table id="roles-table"></roles-table>
            </main>
            <role-create-modal id="create-modal"></role-create-modal>
            <role-edit-modal id="edit-modal"></role-edit-modal>
        `;

        const s: ShadowRoot = this.shadowRoot!;
        this.table = s.getElementById("roles-table") as unknown as IRolesTable;
        this.createModal = s.getElementById("create-modal") as unknown as IRoleCreateModal;
        this.editModal = s.getElementById("edit-modal") as unknown as IRoleEditModal;

        s.getElementById("open-create")!.addEventListener("click", () => {
            this.createModal.open();
        });

        this.addEventListener("role-create-submit", (e: Event) => {
            const { name, description } = (e as CustomEvent<{ name: string; description: string }>).detail;
            void this.handleCreate(name, description);
        });

        this.addEventListener("role-edit", (e: Event) => {
            const name: string = (e as CustomEvent<string>).detail;
            const role: Role = this.roles.find(r => r.name === name)!;
            this.editModal.open(role);
        });

        this.addEventListener("role-edit-submit", (e: Event) => {
            const { oldName, newName, description } = (e as CustomEvent<{ oldName: string; newName: string; description: string }>).detail;
            void this.handleUpdate(oldName, newName, description);
        });

        this.addEventListener("role-delete", (e: Event) => {
            const name: string = (e as CustomEvent<string>).detail;
            void this.handleDelete(name);
        });

        void this.loadRoles();
    }

    private async loadRoles(): Promise<void> {
        try {
            this.roles = await this.roleService.getAll();
            this.table.render(this.roles);
        }
        catch (err: unknown) {
            console.error(err instanceof Error ? err.message : String(err));
        }
    }

    private async handleCreate(name: string, description: string): Promise<void> {
        try {
            await this.roleService.create(name, description);
            this.createModal.close();
            await this.loadRoles();
        }
        catch (err: unknown) {
            this.createModal.setError(err instanceof Error ? err.message : String(err));
        }
    }

    private async handleUpdate(oldName: string, newName: string, description: string): Promise<void> {
        try {
            await this.roleService.update(oldName, newName, description);
            this.editModal.close();
            await this.loadRoles();
        }
        catch (err: unknown) {
            this.editModal.setError(err instanceof Error ? err.message : String(err));
        }
    }

    private async handleDelete(name: string): Promise<void> {
        if (!confirm(`verwijder role '${name}'?`)) {
            return;
        }

        try {
            await this.roleService.delete(name);
            await this.loadRoles();
        }
        catch (err: unknown) {
            console.error(err instanceof Error ? err.message : String(err));
        }
    }
}

customElements.define("roles-page", RolesPageComponent);
