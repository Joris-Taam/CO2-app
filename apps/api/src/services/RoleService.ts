import { IRoleRepository } from "@api/interfaces/IRoleInterface";
import { Role } from "@api/models/Role";

export class RoleService {
    public constructor(private readonly roleRepository: IRoleRepository) {
    }

    public async getAllRoles(): Promise<Role[]> {
        return this.roleRepository.findAll();
    }

    public async getRoleByName(name: string): Promise<Role> {
        const role: Role | null = await this.roleRepository.findByName(name);

        if (!role) {
            throw new Error(`Role '${name}' not found`);
        }

        return role;
    }

    public async createRole(name: string, description: string | null = null): Promise<Role> {
        if (!name || name.trim() === "") {
            throw new Error("Role name is required");
        }

        const existing: Role | null = await this.roleRepository.findByName(name);

        if (existing) {
            throw new Error(`Role '${name}' already exists`);
        }

        return this.roleRepository.create(name.trim(), description);
    }

    public async updateRole(oldName: string, newName: string, description: string | null = null): Promise<Role> {
        if (!newName || newName.trim() === "") {
            throw new Error("New role name is required");
        }

        const updated: Role | null = await this.roleRepository.update(oldName, newName.trim(), description);

        if (!updated) {
            throw new Error(`Role '${oldName}' not found`);
        }

        return updated;
    }

    public async deleteRole(name: string): Promise<void> {
        const deleted: boolean = await this.roleRepository.delete(name);

        if (!deleted) {
            throw new Error(`Role '${name}' not found`);
        }
    }
}
