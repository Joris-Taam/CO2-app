import { Vehicle } from "@api/models/Vehicle";

@Interface
export abstract class IVehicleInterface {
    public abstract findAll(): Promise<Vehicle[]>;
    public abstract findByNumberPlate(numberPlate: string): Promise<Vehicle | null>;
    public abstract create(vehicle: Vehicle): Promise<Vehicle>;
    public abstract update(numberPlate: string, location_adress: string, location_city: string): Promise<boolean>;
    public abstract delete(numberPlate: string): Promise<boolean>;
}
