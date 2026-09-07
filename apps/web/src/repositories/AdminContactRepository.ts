import { Contact } from "@web/Models/Contact";

const API_URL: string = "http://localhost:3001/contact";

export class AdminContactRepository {
    // Get all contacts
    public async getAll(): Promise<Contact[]> {
        const response: Response = await fetch(API_URL, { method: "GET" });

        if (!response.ok) {
            throw new Error("Failed to fetch contacts");
        }

        return (await response.json()) as Contact[];
    }

    // Delete a contact by date
    public async delete(created_at: Date): Promise<void> {
        const url: string = `${API_URL}/${encodeURIComponent(created_at.toISOString())}`;

        const response: Response = await fetch(url, { method: "DELETE" });

        if (!response.ok) {
            throw new Error("Failed to delete user");
        }
    }
}
