import { Role } from "@web/Models/Roles";

const BASE_URL: string = "http://localhost:3001/roles";

export class RoleRepository {
    private getHeaders(includeBody: boolean = false): HeadersInit {
        const token: string | null = localStorage.getItem("token");

        return {
            ...(includeBody && { "Content-Type": "application/json" }),
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    }

    public async findAll(): Promise<Role[]> {
        const response: Response = await fetch(BASE_URL, {
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch roles");
        }

        const data: unknown = await response.json();

        return data as Role[];
    }

    public async findByName(name: string): Promise<Role> {
        const response: Response = await fetch(
            `${BASE_URL}/${encodeURIComponent(name)}`,
            {
                headers: this.getHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error(`Role '${name}' not found`);
        }

        const data: unknown = await response.json();

        return data as Role;
    }

    public async create(name: string, description: string): Promise<Role> {
        const response: Response = await fetch(BASE_URL, {
            method: "POST",
            headers: this.getHeaders(true),
            body: JSON.stringify({ name, description }),
        });

        if (!response.ok) {
            const data: unknown = await response.json();
            const err: { message?: string } = data as { message?: string };

            throw new Error(err.message ?? "Failed to create role");
        }

        const data: unknown = await response.json();

        return data as Role;
    }

    public async update(oldName: string, newName: string, description: string): Promise<Role> {
        const response: Response = await fetch(
            `${BASE_URL}/${encodeURIComponent(oldName)}`,
            {
                method: "PUT",
                headers: this.getHeaders(true),
                body: JSON.stringify({ name: newName, description }),
            }
        );

        if (!response.ok) {
            const data: unknown = await response.json();
            const err: { message?: string } = data as { message?: string };

            throw new Error(err.message ?? "Failed to update role");
        }

        const data: unknown = await response.json();

        return data as Role;
    }

    public async delete(name: string): Promise<void> {
        const response: Response = await fetch(
            `${BASE_URL}/${encodeURIComponent(name)}`,
            {
                method: "DELETE",
                headers: this.getHeaders(),
            }
        );

        if (!response.ok) {
            const data: unknown = await response.json();
            const err: { message?: string } = data as { message?: string };

            throw new Error(err.message ?? "Failed to delete role");
        }
    }
}
