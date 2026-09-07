import { Reservation } from "@web/interfaces/Reservation";

declare const VITE_API_URL: string | undefined;

const API_URL: string = `${(typeof VITE_API_URL !== "undefined" ? VITE_API_URL : "http://localhost:3001/").replace(/\/?$/, "/")}reservations`;

export class ReservationRepository {
    public async getAll(): Promise<Reservation[]> {
        const response: Response = await fetch(API_URL, { method: "GET" });

        if (!response.ok) {
            throw new Error("Failed to fetch reservations");
        }

        return (await response.json()) as Reservation[];
    }

    public async getByUserEmail(users_email: string): Promise<Reservation[]> {
        const response: Response = await fetch(
            `${API_URL}/user/${encodeURIComponent(users_email)}`,
            { method: "GET" }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch reservations for user");
        }

        return (await response.json()) as Reservation[];
    }

    public async getByVehicleNumberPlate(vehicles_number_plate: string): Promise<Reservation[]> {
        const response: Response = await fetch(
            `${API_URL}/vehicle/${encodeURIComponent(vehicles_number_plate)}`,
            { method: "GET" }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch reservations for vehicle");
        }

        return (await response.json()) as Reservation[];
    }

    public async create(reservation: Reservation): Promise<Reservation> {
        const response: Response = await fetch(API_URL, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reservation),
        });

        if (!response.ok) {
            throw new Error("Failed to create reservation");
        }

        return (await response.json()) as Reservation;
    }

    public async delete(users_email: string, vehicles_number_plate: string): Promise<void> {
        const response: Response = await fetch(
            `${API_URL}/${encodeURIComponent(users_email)}/${encodeURIComponent(vehicles_number_plate)}`,
            { method: "DELETE" }
        );

        if (!response.ok) {
            throw new Error("Failed to delete reservation");
        }
    }
}
