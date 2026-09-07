import { Vehicle } from "@web/interfaces/Vehicle";
import { VehicleRepository } from "@web/repositories/VehicleRepository";

export class VehicleService {
    private vehicleRepository: VehicleRepository;

    public constructor() {
        this.vehicleRepository = new VehicleRepository();
    }

    // Get all vehicles
    public async getAll(): Promise<Vehicle[]> {
        return this.vehicleRepository.getAll();
    }

    // Get a single vehicle by number plate
    public async getByNumberPlate(numberPlate: string): Promise<Vehicle> {
        return this.vehicleRepository.getByNumberPlate(numberPlate);
    }

    // Create a new vehicle
    public async create(vehicle: Vehicle): Promise<Vehicle> {
        return this.vehicleRepository.create(vehicle);
    }

    // Update an existing vehicle by number plate
    public async update(numberPlate: string, data: Partial<Vehicle>): Promise<void> {
        return this.vehicleRepository.update(numberPlate, data);
    }

    // Delete a vehicle by number plate
    public async delete(numberPlate: string): Promise<void> {
        return this.vehicleRepository.delete(numberPlate);
    }
}
