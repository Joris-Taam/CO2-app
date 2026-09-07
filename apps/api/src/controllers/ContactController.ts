import { Request, Response } from "express";
import { ContactService } from "@api/services/ContactService";
import { Contact } from "@api/models/Contact";

/**
 * Controller for handling contact-related HTTP requests.
 */
export class ContactController {
    private static _instance: ContactController | undefined;

    private constructor(private ContactService: ContactService) {

    }

    public static getInstance(): ContactController {
        if (!ContactController._instance) {
            ContactController._instance = new ContactController(ContactService.getInstance());
        }

        return ContactController._instance;
    }

    /**
     * Retrieves all Contacts.
     *
     * @param _req - The HTTP request object (unused)
     * @param res - The HTTP response object
     */
    public getAllContacts = async (_req: Request, res: Response): Promise<void> => {
        try {
            const Contacts: Awaited<ReturnType<typeof this.ContactService.getAllContacts>> =
                await this.ContactService.getAllContacts();

            res.json(Contacts);
        }
        catch {
            res.status(500).json({ message: "Server error" });
        }
    };

    /**
     * Creates a new Contact.
     *
     * @param req - The HTTP request object containing the Contact data in the body
     * @param res - The HTTP response object
     */
    public createContact = async (req: Request, res: Response): Promise<void> => {
        const Contact: Contact = req.body as Contact;
        const createdContact: Awaited<ReturnType<typeof this.ContactService.createContact>> =
            await this.ContactService.createContact(Contact);

        res.status(201).json(createdContact);
    };

    /**
     * Deletes a Contact by their timestamp.
     *
     * @param req - The HTTP request object containing the timestamp param
     * @param res - The HTTP response object
     */
    public deleteContact = async (
        req: Request<{ created_at: Date }>,
        res: Response
    ): Promise<void> => {
        const created_at: Date = req.params.created_at;
        const deleted: Awaited<ReturnType<typeof this.ContactService.deleteContact>> =
            await this.ContactService.deleteContact(new Date(created_at));

        if (!deleted) {
            res.status(404).json({ message: "Contact not found" });

            return;
        }

        res.json({ message: "Contact deleted successfully" });
    };
};
