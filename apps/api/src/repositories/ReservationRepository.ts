import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { DatabaseService } from "@api/services/DatabaseService";
import { Reservation } from "@api/models/Reservation";
import { IReservationInterface } from "@api/interfaces/IReservationInterface";

interface ReservationRow extends RowDataPacket {
    users_email: string;
    vehicles_number_plate: string;
    lease_type: "short-term" | "long-term";
    start_date: Date;
    end_date: Date;
    created_at: Date;
}

export class ReservationRepository implements IReservationInterface {
    public constructor(private readonly db: DatabaseService) {

    }

    public async findAll(): Promise<Reservation[]> {
        const connection: PoolConnection = await this.db.openConnection();

        try {
            const [rows] = await connection.query<ReservationRow[]>(
                "SELECT * FROM reservations"
            );

            return rows.map((row: ReservationRow) => new Reservation(
                row.users_email,
                row.vehicles_number_plate,
                row.lease_type,
                row.start_date,
                row.end_date,
                row.created_at
            ));
        }
        finally {
            connection.release();
        }
    }

    public async findByUserEmail(users_email: string): Promise<Reservation[]> {
        const connection: PoolConnection = await this.db.openConnection();

        try {
            const [rows] = await connection.query<ReservationRow[]>(
                "SELECT * FROM reservations WHERE users_email = ?",
                [users_email]
            );

            return rows.map((row: ReservationRow) => new Reservation(
                row.users_email,
                row.vehicles_number_plate,
                row.lease_type,
                row.start_date,
                row.end_date,
                row.created_at
            ));
        }
        finally {
            connection.release();
        }
    }

    public async findByVehicleNumberPlate(vehicles_number_plate: string): Promise<Reservation[]> {
        const connection: PoolConnection = await this.db.openConnection();

        try {
            const [rows] = await connection.query<ReservationRow[]>(
                "SELECT * FROM reservations WHERE vehicles_number_plate = ?",
                [vehicles_number_plate]
            );

            return rows.map((row: ReservationRow) => new Reservation(
                row.users_email,
                row.vehicles_number_plate,
                row.lease_type,
                row.start_date,
                row.end_date,
                row.created_at
            ));
        }
        finally {
            connection.release();
        }
    }

    public async create(reservation: Reservation): Promise<Reservation> {
        const connection: PoolConnection = await this.db.openConnection();

        try {
            await connection.query<ResultSetHeader>(
                "INSERT INTO reservations (users_email, vehicles_number_plate, lease_type, start_date, end_date, created_at) VALUES (?, ?, ?, ?, ?, ?)",
                [reservation.users_email, reservation.vehicles_number_plate, reservation.lease_type, reservation.start_date, reservation.end_date, reservation.created_at]
            );

            return reservation;
        }
        finally {
            connection.release();
        }
    }

    public async delete(users_email: string, vehicles_number_plate: string): Promise<boolean> {
        const connection: PoolConnection = await this.db.openConnection();

        try {
            const [result] = await connection.query<ResultSetHeader>(
                "DELETE FROM reservations WHERE users_email = ? AND vehicles_number_plate = ?",
                [users_email, vehicles_number_plate]
            );

            return result.affectedRows > 0;
        }
        finally {
            connection.release();
        }
    }

    public async update(users_email: string, vehicles_number_plate: string, reservation: Reservation): Promise<boolean> {
        const connection: PoolConnection = await this.db.openConnection();

        try {
            const [result] = await connection.query<ResultSetHeader>(
                "UPDATE reservations SET lease_type = ?, start_date = ?, end_date = ?, created_at = ? WHERE users_email = ? AND vehicles_number_plate = ?",
                [reservation.lease_type, reservation.start_date, reservation.end_date, reservation.created_at, users_email, vehicles_number_plate]
            );

            return result.affectedRows > 0;
        }

        finally {
            connection.release();
        }
    }
}
