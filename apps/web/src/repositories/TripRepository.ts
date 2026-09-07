import { Rit, RitInput } from "../interfaces/TripInterface";

const API_URL: string = "http://localhost:3001/api";

export class RitRepository {
    public async getByUser(): Promise<{ naam: string; ritten: Rit[] }> {
        const response: Response = await fetch(`${API_URL}/me`, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return (await response.json()) as { naam: string; ritten: Rit[] };
    }

    public async create(rit: RitInput): Promise<RitInput> {
        const response: Response = await fetch(`${API_URL}/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(rit),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return (await response.json()) as RitInput;
    }

    public async update(rit: RitInput): Promise<RitInput> {
        const datetime: string = encodeURIComponent(rit.createdAt);
        const response: Response = await fetch(`${API_URL}/${datetime}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(rit),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return (await response.json()) as RitInput;
    }

    public async delete(rit: Rit): Promise<void> {
        const datetime: string = encodeURIComponent(rit.createdAt);
        const response: Response = await fetch(`${API_URL}/${datetime}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    }
}
