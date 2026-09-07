import { Role } from "@web/Models/Roles";
import { RoleRepository } from "@web/repositories/RolesRepository";

export class RoleService {
    private readonly repository: RoleRepository;

    public constructor() {
        this.repository = new RoleRepository();
    }

    public async getAll(): Promise<Role[]> {
        return this.repository.findAll();
    }

    public async getByName(name: string): Promise<Role> {
        if (!name.trim()) {
            throw new Error("Role name is required");
        }

        return this.repository.findByName(name.trim());
    }

    public async create(name: string, description: string): Promise<Role> {
        if (!name.trim()) {
            throw new Error("Role name is required");
        }

        return this.repository.create(name.trim(), description);
    }

    public async update(oldName: string, newName: string, description: string): Promise<Role> {
        if (!newName.trim()) {
            throw new Error("New role name is required");
        }

        return this.repository.update(oldName, newName.trim(), description);
    }

    public async delete(name: string): Promise<void> {
        return this.repository.delete(name);
    }
}
