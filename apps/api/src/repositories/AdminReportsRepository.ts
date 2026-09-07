import { PoolConnection } from "mysql2/promise";
import { AdminReports, AdminReportsFilter } from "../models/AdminReport";
import { DatabaseService } from "../services/DatabaseService";

type AdminReportsQueryResult = {
    vehicle_name: string;
    totalKilometers: string;
    totalTrips: string;
    totalCo2: string;
};

export class AdminReportsRepository {
    public constructor(private readonly db: DatabaseService) {
    }

    public async findAdminReports(filter?: AdminReportsFilter): Promise<AdminReports[]> {
        const connection: PoolConnection = await this.db.openConnection();

        try {
            const params: string[] = [];
            const conditions: string[] = [];

            if (filter?.period) {
                const now: Date = new Date();
                const from: Date = new Date(now);

                if (filter.period === "year") {
                    from.setFullYear(from.getFullYear() - 1);
                }
                else if (filter.period === "month") {
                    from.setMonth(from.getMonth() - 1);
                }
                else {
                    from.setDate(from.getDate() - 7);
                }

                const toStr: string = now.toISOString().slice(0, 19).replace("T", " ");
                const fromStr: string = from.toISOString().slice(0, 19).replace("T", " ");
                conditions.push("trip.trip_datetime BETWEEN ? AND ?");
                params.push(fromStr, toStr);
            }
            else if (filter?.startDate && filter.endDate) {
                conditions.push("trip.trip_datetime BETWEEN ? AND ?");
                params.push(filter.startDate, filter.endDate);
            }
            else if (filter?.startDate) {
                conditions.push("trip.trip_datetime >= ?");
                params.push(filter.startDate);
            }
            else if (filter?.endDate) {
                conditions.push("trip.trip_datetime <= ?");
                params.push(filter.endDate);
            }

            if (filter?.department_names && filter.department_names.length > 0) {
                const placeholders: string = filter.department_names.map(() => "?").join(", ");
                conditions.push(`users.department_name IN (${placeholders})`);
                params.push(...filter.department_names);
            }
            else if (filter?.department_name) {
                conditions.push("users.department_name = ?");
                params.push(filter.department_name);
            }

            const whereClause: string = conditions.length > 0
                ? `WHERE ${conditions.join(" AND ")}`
                : "";

            const [rows] = await connection.query(
                `SELECT
                    IFNULL(vehicle_name, 'TOTAL') as vehicle_name,
                    SUM(distance_km) AS totalKilometers,
                    COUNT(*) AS totalTrips,
                    SUM(distance_km * emission_factor_kg_per_km) AS totalCo2
                FROM trip
                LEFT JOIN fueltype ON trip.fuel_name = fueltype.name
                LEFT JOIN users ON trip.user_email = users.email
                ${whereClause}
                GROUP BY vehicle_name WITH ROLLUP`,
                params
            );

            return (rows as AdminReportsQueryResult[]).map(row => ({
                vehicle_name: row.vehicle_name,
                totalKilometers: Number(row.totalKilometers) || 0,
                totalTrips: Number(row.totalTrips) || 0,
                totalCo2: Number(row.totalCo2) || 0,
            }));
        }
        finally {
            connection.release();
        }
    }
}
