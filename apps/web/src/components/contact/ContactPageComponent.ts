import { AdminContactService } from "@web/services/AdminContactService";
import { Contact } from "@web/Models/Contact";
import { IContactTable, IContactModal } from "@web/components/contact/IContactComponents";
import "@web/components/contact/ContactTableComponent";
import "@web/components/contact/ContactViewModalComponent";

class ContactPageComponent extends HTMLElement {
    private contact: Contact[] = [];
    private readonly contactService = new AdminContactService();
    private modal!: IContactModal;
    private table!: IContactTable;

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.innerHTML = `
            <link rel="stylesheet" href="/assets/css/AdminContacts.css">
            <link rel="stylesheet" href="/assets/css/global.css">
            <main>
                <h1>Contact Overzicht</h1>
                <admin-contact-table id="admin-contact-table"></admin-contact-table>
                <admin-contact-modal id="admin-contact-modal"></admin-contact-modal>
            </main>
        `;

        const s: ShadowRoot = this.shadowRoot!;
        this.table = s.getElementById("admin-contact-table") as unknown as IContactTable;
        this.modal = s.getElementById("admin-contact-modal") as unknown as IContactModal;

        this.addEventListener("contact-more-info", (e: Event) => {
            const dateStr: string = (e as CustomEvent<string>).detail;
            const found: Contact | undefined = this.contact.find(c => String(c.created_at) === dateStr);

            if (found) {
                this.modal.open(found);
            }
        });

        this.addEventListener("contact-delete", (e: Event) => {
            const created_at: Date = new Date((e as CustomEvent<string>).detail);
            void this.deleteContact(created_at);
        });

        void this.loadContacts();
    }

    private async loadContacts(): Promise<void> {
        try {
            this.contact = await this.contactService.getAll();
            this.table.render(this.contact);
        }
        catch (err: unknown) {
            console.error(err instanceof Error ? err.message : String(err));
        }
    }

    private async deleteContact(created_at: Date): Promise<void> {
        if (!confirm(`verwijder contact '${created_at}'?`)) {
            return;
        }

        try {
            await this.contactService.delete(created_at);
            await this.loadContacts();
        }
        catch (err: unknown) {
            console.error(err instanceof Error ? err.message : String(err));
        }
    }
}

customElements.define("admin-contact-page", ContactPageComponent);
