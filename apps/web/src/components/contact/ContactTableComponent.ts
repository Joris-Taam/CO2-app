import { Contact } from "@web/Models/Contact";
import { IContactTable } from "./IContactComponents";

class ContactTableComponent extends HTMLElement implements IContactTable {
    private tableBody!: HTMLTableSectionElement;

    private formatDate(date: Date): string {
        const d: Date = new Date(date);
        d.setHours(d.getHours() + 2);

        return d.toISOString().substring(0, 16).replace("T", " ");
    }

    private truncate(text: string, maxLength: number = 40): string {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    }

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.innerHTML = `
            <link rel="stylesheet" href="/assets/css/AdminContact.css">
            <link rel="stylesheet" href="/assets/css/global.css">
            <table>
                <thead>
                    <tr>
                        <th>Verstuurd Op</th>
                        <th>Email</th>
                        <th>Naam</th>
                        <th>Bericht</th>
                        <th>Acties</th>
                    </tr>
                </thead>
                <tbody id="contact-table-body">
                </tbody>
            </table>
        `;
        this.tableBody = this.shadowRoot!.getElementById("contact-table-body") as HTMLTableSectionElement;
    }

    public render(contacts: Contact[]): void {
        this.tableBody.innerHTML = "";

        if (contacts.length === 0) {
            this.tableBody.innerHTML = "<tr><td colspan=\"5\" style=\"text-align:center; padding:20px; color:#888;\">No contacts found</td></tr>";

            return;
        }

        contacts.forEach((contact: Contact) => {
            const tr: HTMLTableRowElement = document.createElement("tr");
            tr.innerHTML = `
                <td>${this.formatDate(contact.created_at)}</td>
                <td>${contact.email}</td>
                <td>${contact.name}</td>
                <td title="${contact.description}">${this.truncate(contact.description)}</td>
                <td class="actions">
                    <button class="btn btn-sm more-info-btn" data-name="${contact.created_at}">Bericht Bekijken</button>
                    <button class="btn btn-danger btn-sm" data-name="${contact.created_at}">Verwijderen</button>
                </td>
            `;
            this.tableBody.appendChild(tr);
        });

        this.tableBody.querySelectorAll(".more-info-btn").forEach(btn =>
            btn.addEventListener("click", (e: Event) => {
                const date: string = (e.currentTarget as HTMLElement).dataset["name"]!;
                this.dispatchEvent(new CustomEvent("contact-more-info", { detail: date, bubbles: true, composed: true }));
            })
        );

        this.tableBody.querySelectorAll(".delete-btn").forEach(btn =>
            btn.addEventListener("click", (e: Event) => {
                const date: string = (e.currentTarget as HTMLElement).dataset["name"]!;
                this.dispatchEvent(new CustomEvent("contact-delete", { detail: date, bubbles: true, composed: true }));
            })
        );
    }
}

customElements.define("admin-contact-table", ContactTableComponent);
