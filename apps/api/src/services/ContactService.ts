import { ContactRepository } from "../repositories/ContactRepository";
import { Contact } from "../models/Contact";

/**
 * Service for handling Contact-related business logic.
 */
export class ContactService {
    private static _instance: ContactService | undefined;

    private constructor(private readonly ContactRepo: ContactRepository) {
    }

    public static getInstance(): ContactService {
        if (!ContactService._instance) {
            ContactService._instance = new ContactService(ContactRepository.getInstance());
        }

        return ContactService._instance;
    }

    public static setInstance(repo: ContactRepository): void {
        ContactService._instance = new ContactService(repo);
    }

    public async createContact(Contact: Contact): Promise<Contact> {
        await this.ContactRepo.create(Contact);

        return {
            created_at: Contact.created_at,
            email: Contact.email,
            description: Contact.description,
            name: Contact.name,
        };
    }

    public async deleteContact(created_at: Date): Promise<boolean> {
        return this.ContactRepo.delete(created_at);
    }

    public async getAllContacts(): Promise<Contact[]> {
        return this.ContactRepo.findAll();
    }
}
