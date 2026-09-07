import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { DatabaseService } from "@api/services/DatabaseService";
import { Vehicle } from "@api/models/Vehicle";
import { IVehicleInterface } from "@api/interfaces/IVehicleInterface";

interface VehicleRow extends RowDataPacket {
    number_plate: string;
    brand: string;
    model: string;
    model_year: number;
    fueltype_name: string | null;
    location_adress: string | null;
    location_city: string | null;
}

export class VehicleRepository implements IVehicleInterface {
    public constructor(private readonly db: DatabaseService) {
    }

    public async findAll(): Promise<Vehicle[]> {
        const connection: PoolConnection = await this.db.openConnection();

        try {
            const [rows] = await connection.query<VehicleRow[]>(
                "SELECT * FROM vehicles"
            );

            return rows.map((row: VehicleRow) => ({
                numberPlate: row.number_plate,
                brand: row.brand,
                model: row.model,
                modelYear: row.model_year,
                fuelType: row.fueltype_name as string || undefined,
                location_adress: row.location_adress as string || undefined,
                location_city: row.location_city as string || undefined,
            }));
        }
        finally {
            connection.release();
        }
    }

    public async findByNumberPlate(numberPlate: string): Promise<Vehicle | null> {
        const connection: PoolConnection = await this.db.openConnection();

        try {
            const [rows] = await connection.query<VehicleRow[]>(
                "SELECT * FROM vehicles WHERE number_plate = ?",
                [numberPlate]
            );

            if (rows.length === 0) {
                return null;
            }

            const row: VehicleRow = rows[0];

            return {
                numberPlate: row.number_plate,
                brand: row.brand,
                model: row.model,
                modelYear: row.model_year,
                fuelType: row.fueltype_name as string || undefined,
                location_adress: row.location_adress as string || undefined,
                location_city: row.location_city as string || undefined,
            };
        }
        finally {
            connection.release();
        }
    }

    public async create(vehicle: Vehicle): Promise<Vehicle> {
        const connection: PoolConnection = await this.db.openConnection();

        try {
            await connection.query<ResultSetHeader>(
                "INSERT INTO vehicles (number_plate, brand, model, model_year, fueltype_name, location_adress, location_city) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [vehicle.numberPlate, vehicle.brand, vehicle.model, vehicle.modelYear, vehicle.fuelType ?? null, vehicle.location_adress ?? null, vehicle.location_city ?? null]
            );

            return vehicle;
        }
        finally {
            connection.release();
        }
    }

    public async update(numberPlate: string, location_adress: string, location_city: string): Promise<boolean> {
        const connection: PoolConnection = await this.db.openConnection();

        try {
            const [result] = await connection.query<ResultSetHeader>(
                "UPDATE vehicles SET location_adress = ?, location_city = ? WHERE number_plate = ?",
                [location_adress, location_city, numberPlate]
            );

            return result.affectedRows > 0;
        }
        finally {
            connection.release();
        }
    }

    public async delete(numberPlate: string): Promise<boolean> {
        const connection: PoolConnection = await this.db.openConnection();

        try {
            const [result] = await connection.query<ResultSetHeader>(
                "DELETE FROM vehicles WHERE number_plate = ?",
                [numberPlate]
            );

            return result.affectedRows > 0;
        }
        finally {
            connection.release();
        }
    }
}
