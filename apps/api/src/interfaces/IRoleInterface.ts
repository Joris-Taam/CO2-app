import { Role } from "@api/models/Role";

@Interface
export abstract class IRoleRepository {
    public abstract findAll(): Promise<Role[]>;
    public abstract findByName(name: string): Promise<Role | null>;
    public abstract create(name: string, description: string | null): Promise<Role>;
    public abstract update(oldName: string, newName: string, description: string | null): Promise<Role | null>;
    public abstract delete(name: string): Promise<boolean>;
}
