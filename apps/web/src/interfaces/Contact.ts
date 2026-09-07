import { Contact } from "@web/Models/Contact";

export interface IContactInterface {
    getAllContacts(): Promise<Contact[]>;
    deleteContact(created_at: Date): Promise<void>;
}
