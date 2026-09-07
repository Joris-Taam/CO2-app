import { type FavoriteTrip } from "@web/Models/FavoriteTrip";

const BASE_URL: string = "http://localhost:3001/favorite-trip";

export class FavoriteTripRepository {
    private getHeaders(includeBody: boolean = false): HeadersInit {
        return {
            ...(includeBody && { "Content-Type": "application/json" }),
        };
    }

    public async findAll(): Promise<FavoriteTrip[]> {
        const response: Response = await fetch(BASE_URL, {
            credentials: "include",
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch favorite trips");
        }

        const data: unknown = await response.json();

        return data as FavoriteTrip[];
    }

    public async save(favoriteTrip: FavoriteTrip): Promise<FavoriteTrip> {
        const response: Response = await fetch(BASE_URL, {
            method: "POST",
            credentials: "include",
            headers: this.getHeaders(true),
            body: JSON.stringify(favoriteTrip),
        });

        if (!response.ok) {
            const data: unknown = await response.json();
            const err: { message?: string } = data as { message?: string };

            throw new Error(err.message ?? "Failed to save favorite trip");
        }

        const data: unknown = await response.json();

        return data as FavoriteTrip;
    }
}
