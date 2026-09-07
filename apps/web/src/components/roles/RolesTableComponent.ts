import { Role } from "@web/Models/Roles";

class RolesTableComponent extends HTMLElement {
    private tableBody!: HTMLTableSectionElement;

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.innerHTML = `
            <link rel="stylesheet" href="/assets/css/AdminRoles.css">
            <link rel="stylesheet" href="/assets/css/global.css">
            <table>
                <thead>
                    <tr>
                        <th>Naam</th>
                        <th>Beschrijving</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id="role-table-body">
                </tbody>
            </table>
        `;
        this.tableBody = this.shadowRoot!.getElementById("role-table-body") as HTMLTableSectionElement;
    }

    public render(roles: Role[]): void {
        this.tableBody.innerHTML = "";

        if (roles.length === 0) {
            this.tableBody.innerHTML = "<tr><td colspan=\"3\" style=\"text-align:center; padding:20px; color:#888;\">No roles found</td></tr>";

            return;
        }

        roles.forEach((role: Role) => {
            const tr: HTMLTableRowElement = document.createElement("tr");
            tr.innerHTML = `
                <td>${role.name}</td>
                <td>${role.description}</td>
                <td class="actions">
                    <button class="btn btn-primary btn-sm edit-btn" data-name="${role.name}">Wijzig</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-name="${role.name}">Verwijderen</button>
                </td>
            `;
            this.tableBody.appendChild(tr);
        });

        this.tableBody.querySelectorAll(".edit-btn").forEach(btn =>
            btn.addEventListener("click", (e: Event) => {
                const name: string = (e.currentTarget as HTMLElement).dataset["name"]!;
                this.dispatchEvent(new CustomEvent("role-edit", { detail: name, bubbles: true, composed: true }));
            })
        );

        this.tableBody.querySelectorAll(".delete-btn").forEach(btn =>
            btn.addEventListener("click", (e: Event) => {
                const name: string = (e.currentTarget as HTMLElement).dataset["name"]!;
                this.dispatchEvent(new CustomEvent("role-delete", { detail: name, bubbles: true, composed: true }));
            })
        );
    }
}

customElements.define("roles-table", RolesTableComponent);
