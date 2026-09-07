import { IReservationInterface } from "@api/interfaces/IReservationInterface";
import { Reservation } from "@api/models/Reservation";

export class ReservationService {
    public constructor(private readonly reservationRepository: IReservationInterface) {

    }

    public async getAllReservations(): Promise<Reservation[]> {
        return this.reservationRepository.findAll();
    }

    public async getReservationsByUserEmail(users_email: string): Promise<Reservation[]> {
        return this.reservationRepository.findByUserEmail(users_email);
    }

    public async getReservationsByVehicleNumberPlate(vehicles_number_plate: string): Promise<Reservation[]> {
        return this.reservationRepository.findByVehicleNumberPlate(vehicles_number_plate);
    }

    public async createReservation(reservation: Reservation): Promise<Reservation> {
        return this.reservationRepository.create(reservation);
    }

    public async deleteReservation(users_email: string, vehicles_number_plate: string): Promise<boolean> {
        return this.reservationRepository.delete(users_email, vehicles_number_plate);
    }
}
