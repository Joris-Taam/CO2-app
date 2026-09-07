import { Request, Response } from "express";
import { Reservation } from "@api/models/Reservation";
import { ReservationService } from "@api/services/ReservationService";

interface ReservationBody {
    users_email: string;
    vehicles_number_plate: string;
    lease_type: "short-term" | "long-term";
    start_date: string;
    end_date: string;
}

export class ReservationController {
    public constructor(private readonly reservationService: ReservationService) {

    }

    public async getallReservations(_req: Request, res: Response): Promise<void> {
        try {
            const reservations: Reservation[] = await this.reservationService.getAllReservations();
            res.json(reservations);
        }
        catch (error) {
            console.error("Error fetching reservations:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    public async getReservationsByUserEmail(req: Request, res: Response): Promise<void> {
        const users_email: string = req.params.users_email as string;

        try {
            const reservations: Reservation[] = await this.reservationService.getReservationsByUserEmail(users_email);
            res.json(reservations);
        }
        catch (error) {
            console.error("Error fetching reservations:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    public async getReservationsByVehicleNumberPlate(req: Request, res: Response): Promise<void> {
        const vehicles_number_plate: string = req.params.vehicles_number_plate as string;

        try {
            const reservations: Reservation[] = await this.reservationService.getReservationsByVehicleNumberPlate(vehicles_number_plate);
            res.json(reservations);
        }
        catch (error) {
            console.error("Error fetching reservations:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    public async createReservation(req: Request, res: Response): Promise<void> {
        const reservationData: ReservationBody = req.body as ReservationBody;
        const userEmail: string = req.cookies.user as string;

        try {
            const newReservation: Reservation = await this.reservationService.createReservation(new Reservation(
                userEmail,
                reservationData.vehicles_number_plate,
                reservationData.lease_type,
                new Date(reservationData.start_date),
                new Date(reservationData.end_date),
                new Date()
            ));
            res.status(201).json(newReservation);
        }
        catch (error) {
            console.error("Error creating reservation:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    public async deleteReservation(req: Request, res: Response): Promise<void> {
        const users_email: string = req.params.users_email as string;
        const vehicles_number_plate: string = req.params.vehicles_number_plate as string;

        try {
            const result: boolean = await this.reservationService.deleteReservation(users_email, vehicles_number_plate);

            if (result) {
                res.status(204).end();
            }
            else {
                res.status(404).json({ message: "Reservation not found" });
            }
        }
        catch (error) {
            console.error("Error deleting reservation:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
