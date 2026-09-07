import { Reservation } from "@web/interfaces/Reservation";
import { ReservationRepository } from "@web/repositories/ReservationRepository";

export class ReservationService {
    private reservationRepository: ReservationRepository;

    public constructor() {
        this.reservationRepository = new ReservationRepository();
    }

    public async getAllReservations(): Promise<Reservation[]> {
        return this.reservationRepository.getAll();
    }

    public async getReservationsByUserEmail(users_email: string): Promise<Reservation[]> {
        return this.reservationRepository.getByUserEmail(users_email);
    }

    public async getReservationsByVehicleNumberPlate(vehicles_number_plate: string): Promise<Reservation[]> {
        return this.reservationRepository.getByVehicleNumberPlate(vehicles_number_plate);
    }

    public async createReservation(reservation: Reservation): Promise<Reservation> {
        return this.reservationRepository.create(reservation);
    }

    public async deleteReservation(users_email: string, vehicles_number_plate: string): Promise<void> {
        await this.reservationRepository.delete(users_email, vehicles_number_plate);
    }
}
