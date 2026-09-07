import { Vehicle } from "@api/models/Vehicle";
import { IVehicleInterface } from "@api/interfaces/IVehicleInterface";

export class VehicleService {
    public constructor(private readonly vehicleRepository: IVehicleInterface) {

    }

    public async getAllVehicles(): Promise<Vehicle[]> {
        return this.vehicleRepository.findAll();
    }

    public async getVehicleByNumberPlate(numberPlate: string): Promise<Vehicle | null> {
        return this.vehicleRepository.findByNumberPlate(numberPlate);
    }

    public async createVehicle(vehicle: Vehicle): Promise<Vehicle> {
        return this.vehicleRepository.create(vehicle);
    }

    public async updateVehicle(numberPlate: string, location_adress: string, location_city: string): Promise<boolean> {
        return this.vehicleRepository.update(numberPlate, location_adress, location_city);
    }

    public async deleteVehicle(numberPlate: string): Promise<boolean> {
        return this.vehicleRepository.delete(numberPlate);
    }
}
