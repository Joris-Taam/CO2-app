import { Vehicle } from "@web/interfaces/Vehicle";

const API_URL: string = "http://localhost:3001/vehicles";

export class VehicleRepository {
    public async getAll(): Promise<Vehicle[]> {
        const response: Response = await fetch(API_URL, { method: "GET", credentials: "include" });

        if (!response.ok) {
            throw new Error("Failed to fetch vehicles");
        }

        return (await response.json()) as Vehicle[];
    }

    // Get a single vehicle by number plate
    public async getByNumberPlate(numberPlate: string): Promise<Vehicle> {
        const response: Response = await fetch(`${API_URL}/${encodeURIComponent(numberPlate)}`, { method: "GET", credentials: "include" });

        if (!response.ok) {
            throw new Error("Failed to fetch vehicle");
        }

        return (await response.json()) as Vehicle;
    }

    // Create a new vehicle
    public async create(vehicle: Vehicle): Promise<Vehicle> {
        const response: Response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(vehicle),
        });

        if (!response.ok) {
            throw new Error("Failed to create vehicle");
        }

        return (await response.json()) as Vehicle;
    }

    // Update an existing vehicle by number plate
    public async update(numberPlate: string, data: Partial<Vehicle>): Promise<void> {
        const response: Response = await fetch(`${API_URL}/${encodeURIComponent(numberPlate)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to update vehicle");
        }
    }

    // Delete a vehicle by number plate
    public async delete(numberPlate: string): Promise<void> {
        const response: Response = await fetch(`${API_URL}/${encodeURIComponent(numberPlate)}`, { method: "DELETE", credentials: "include" });

        if (!response.ok) {
            throw new Error("Failed to delete vehicle");
        }
    }
}
