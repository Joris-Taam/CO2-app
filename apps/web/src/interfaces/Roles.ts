import { Role } from "@web/Models/Roles";

export interface IRolesPage {
    loadRoles(): Promise<void>;
    handleCreate(role: Role): Promise<void>;
    handleUpdate(oldName: string, role: Role): Promise<void>;
    handleDelete(name: string): Promise<void>;
}
