import { Contact } from "@web/Models/Contact";

export interface IContactTable extends HTMLElement {
    render(contacts: Contact[]): void;
}

export interface IContactModal extends HTMLElement {
    open(contact: Contact): void;
    close(): void;
}
