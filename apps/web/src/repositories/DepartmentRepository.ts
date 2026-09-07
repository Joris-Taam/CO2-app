import { Department } from "../Models/Department";

const BASE_URL: string = "http://localhost:3001/departments";

export class DepartmentRepository {
    private getHeaders(includeBody: boolean = false): HeadersInit {
        const token: string | null = localStorage.getItem("token");

        return {
            ...(includeBody && { "Content-Type": "application/json" }),
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    }

    public async findAll(): Promise<Department[]> {
        const response: Response = await fetch(BASE_URL, {
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch departments");
        }

        const data: unknown = await response.json();

        return data as Department[];
    }

    public async findByName(name: string): Promise<Department> {
        const response: Response = await fetch(
            `${BASE_URL}/${encodeURIComponent(name)}`,
            {
                headers: this.getHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error(`Department '${name}' not found`);
        }

        const data: unknown = await response.json();

        return data as Department;
    }

    public async create(department: Department): Promise<Department> {
        const response: Response = await fetch(BASE_URL, {
            method: "POST",
            headers: this.getHeaders(true),
            body: JSON.stringify(department),
        });

        if (!response.ok) {
            const data: unknown = await response.json();
            const err: { message?: string } = data as { message?: string };

            throw new Error(err.message ?? "Failed to create department");
        }

        const data: unknown = await response.json();

        return data as Department;
    }

    public async update(name: string, department: Department): Promise<Department> {
        const response: Response = await fetch(
            `${BASE_URL}/${encodeURIComponent(name)}`,
            {
                method: "PUT",
                headers: this.getHeaders(true),
                body: JSON.stringify(department),
            }
        );

        if (!response.ok) {
            const data: unknown = await response.json();
            const err: { message?: string } = data as { message?: string };

            throw new Error(err.message ?? "Failed to update department");
        }

        const data: unknown = await response.json();

        return data as Department;
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

            throw new Error(err.message ?? "Failed to delete department");
        }
    }
}
