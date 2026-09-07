import { AdminContactRepository } from "../repositories/AdminContactRepository";
import { Contact } from "@web/Models/Contact";

export class AdminContactService {
    private repository: AdminContactRepository;

    public constructor(repository?: AdminContactRepository) {
        this.repository = repository || new AdminContactRepository();
    }

    public async getAll(): Promise<Contact[]> {
        return this.repository.getAll();
    }

    public async delete(created_at: Date): Promise<void> {
        return this.repository.delete(created_at);
    }
}
