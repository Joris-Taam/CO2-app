import { Contact } from "../models/Contact";

export abstract class IContactInterface {
    public abstract createContact(contact: Contact): Promise<Contact>;
    public abstract getAllContacts(): Promise<Contact[]>;
    public abstract deleteContact(date: string): Promise<boolean>;
}
