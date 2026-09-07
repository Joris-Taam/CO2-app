import { Reservation } from "@api/models/Reservation";

@Interface
export abstract class IReservationInterface {
    public abstract findAll(): Promise<Reservation[]>;
    public abstract findByUserEmail(users_email: string): Promise<Reservation[]>;
    public abstract findByVehicleNumberPlate(vehicles_number_plate: string): Promise<Reservation[]>;
    public abstract create(reservation: Reservation): Promise<Reservation>;
    public abstract delete(users_email: string, vehicles_number_plate: string): Promise<boolean>;
}
