import { Repository, DeleteResult } from "typeorm";
import { Contact, ContactORM } from "../models/Contact";
import { ORMService } from "@api/services/ORMService";

/**
 * Repository for performing CRUD operations on contacts via TypeORM.
 */
export class ContactRepository {
    private static _instance: ContactRepository | undefined;

    private constructor() {
    }

    public static getInstance(): ContactRepository {
        if (!ContactRepository._instance) {
            ContactRepository._instance = new ContactRepository();
        }

        return ContactRepository._instance;
    }

    public static resetInstance(): void {
        ContactRepository._instance = undefined;
    }

    private get repository(): Repository<ContactORM> {
        return ORMService.getInstance().getRepository(ContactORM);
    }

    /**
     * Maps a ContactORM entity to a plain Contact object.
     *
     * @param entity - The ContactORM entity to map
     * @returns A plain Contact object without sensitive data
     */
    private mapToContact(entity: ContactORM): Contact {
        return {
            created_at: entity.created_at,
            email: entity.email,
            description: entity.description,
            name: entity.name,
        };
    }

    /**
     * Retrieves all contacts from the database.
     *
     * @returns Array of all contacts
     */
    public async findAll(): Promise<Contact[]> {
        const entities: ContactORM[] = await this.repository.find();

        return entities.map((entity: ContactORM) => this.mapToContact(entity));
    }

    /**
     * Creates a new contact in the database.
     *
     * @param contact - The contact data to persist
     * @throws Error if any required field is missing
     */
    public async create(contact: Contact): Promise<void> {
        if (!contact.email) {
            throw new Error("Email is required");
        }

        await this.repository.save(this.repository.create(contact));
    }

    /**
     * Deletes a contact by their timestamp.
     *
     * @param created_at - The timestamp of the contact to delete
     * @returns True if the contact was deleted, false if not found
     */
    public async delete(created_at: Date): Promise<boolean> {
        const result: DeleteResult = await this.repository.delete({ created_at });

        return (result.affected ?? 0) > 0;
    }
}
