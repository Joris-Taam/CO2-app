import { User } from "@web/Models/Users";

const API_URL: string = "http://localhost:3001/users";

export class UserRepository {
    public async getAll(): Promise<User[]> {
        const response: Response = await fetch(API_URL, { method: "GET" });

        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }

        const data: unknown = await response.json();

        return data as User[];
    }

    public async getByEmail(email: string): Promise<User> {
        const response: Response = await fetch(
            `${API_URL}/${encodeURIComponent(email)}`,
            { method: "GET", credentials: "include" }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch user");
        }

        const data: unknown = await response.json();

        return data as User;
    }

    public async updateProfile(
        email: string,
        data: { schedule: string }
    ): Promise<void> {
        const response: Response = await fetch(
            `${API_URL}/${encodeURIComponent(email)}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(data),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update profile");
        }
    }

    public async updateCredentials(
        email: string,
        data: { currentPassword: string; email?: string; password?: string }
    ): Promise<{ ok: boolean; status: number; message?: string }> {
        const response: Response = await fetch(
            `${API_URL}/${encodeURIComponent(email)}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(data),
            }
        );

        if (response.ok) {
            return { ok: true, status: response.status };
        }

        const raw: unknown = await response.json().catch(() => ({}));

        const body: { message?: string } = raw as { message?: string };

        return { ok: false, status: response.status, message: body.message };
    }

    public async create(user: User): Promise<User> {
        const response: Response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            throw new Error("Failed to create user");
        }

        const data: unknown = await response.json();

        return data as User;
    }

    public async update(email: string, user: Partial<User>): Promise<User> {
        const response: Response = await fetch(
            `${API_URL}/${encodeURIComponent(email)}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(user),
            }
        );

        if (!response.ok) {
            const text: string = await response.text();

            console.error("Update failed:", text);

            throw new Error("Failed to update user");
        }

        const data: unknown = await response.json();

        return data as User;
    }

    public async delete(email: string): Promise<void> {
        const url: string = `${API_URL}/${encodeURIComponent(email)}`;

        const response: Response = await fetch(url, { method: "DELETE" });

        if (!response.ok) {
            throw new Error("Failed to delete user");
        }
    }
}
