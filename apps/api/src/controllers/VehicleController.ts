import { Request, Response } from "express";
import { VehicleService } from "@api/services/VehicleService";
import { Vehicle } from "@api/models/Vehicle";
import { validateNumberPlate } from "@api/utils/VehicleRegex";

export class VehicleController {
    public constructor(private vehicleService: VehicleService) {

    }

    public async getAllVehicles(_req: Request, res: Response): Promise<void> {
        try {
            const vehicles: Vehicle[] = await this.vehicleService.getAllVehicles();
            res.json(vehicles);
        }
        catch (error) {
            console.error("Error fetching vehicles:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    public async getVehicleByNumberPlate(req: Request, res: Response): Promise<void> {
        const numberPlate: string = req.params.numberPlate as string;

        try {
            const vehicle: Vehicle | null = await this.vehicleService.getVehicleByNumberPlate(numberPlate);

            if (vehicle) {
                res.json(vehicle);
            }
            else {
                res.status(404).json({ message: "Vehicle not found" });
            }
        }
        catch (error) {
            console.error(`Error fetching car park with number plate ${numberPlate}:`, error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    public async createVehicle(req: Request, res: Response): Promise<void> {
        const vehicleData: Vehicle = req.body as Vehicle;

        try {
            if (!validateNumberPlate(vehicleData.numberPlate)) {
                res.status(400).json({ message: "Nummerbord formaat is ongeldig" });

                return;
            }

            const newVehicle: Vehicle = await this.vehicleService.createVehicle(vehicleData);
            res.status(201).json(newVehicle);
        }
        catch (error) {
            console.error("Error creating vehicle:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    public async updateVehicle(req: Request, res: Response): Promise<void> {
        const numberPlate: string = req.params.numberPlate as string;
        const { location_adress, location_city } = req.body as Partial<Vehicle>;

        try {
            if (!validateNumberPlate(numberPlate)) {
                res.status(400).json({ message: "Nummerbord formaat is ongeldig" });

                return;
            }

            if (!location_adress || !location_city) {
                res.status(400).json({ message: "Missing required fields" });

                return;
            }

            const updated: boolean = await this.vehicleService.updateVehicle(numberPlate, location_adress, location_city);

            if (updated) {
                res.json({ message: "Vehicle updated successfully" });
            }
            else {
                res.status(404).json({ message: "Vehicle not found" });
            }
        }
        catch (error) {
            console.error(`Error updating car park with number plate ${numberPlate}:`, error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    public async deleteVehicle(req: Request, res: Response): Promise<void> {
        const numberPlate: string = req.params.numberPlate as string;

        try {
            const deleted: boolean = await this.vehicleService.deleteVehicle(numberPlate);

            if (deleted) {
                res.json({ message: "Vehicle deleted successfully" });
            }
            else {
                res.status(404).json({ message: "Vehicle not found" });
            }
        }
        catch (error) {
            console.error(`Error deleting vehicle with number plate ${numberPlate}:`, error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
