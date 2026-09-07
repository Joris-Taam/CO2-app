import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { FavoriteTrip } from "@api/models/FavoriteTrip";
import { DatabaseService } from "@api/services/DatabaseService";

/**
 * Handles all database operations for the favoritetrip table.
 */
export class FavoriteTripRepository {
    public constructor(private readonly db: DatabaseService) {
    }

    /**
     * Inserts a new favorite trip for the given user.
     *
     * @param userEmail    - The email of the authenticated user.
     * @param favoriteTrip - The favorite trip data to insert.
     * @returns            The saved FavoriteTrip.
     */
    public async save(userEmail: string, favoriteTrip: FavoriteTrip): Promise<FavoriteTrip> {
        const connection: PoolConnection = await this.db.openConnection();

        try {
            await connection.query<ResultSetHeader>(
                `INSERT INTO favoritetrip
                    (user_email, start_location, end_location, distance_km, vehicle_name, fuel_name, trip_type_name)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    userEmail,
                    favoriteTrip.start_location,
                    favoriteTrip.end_location,
                    favoriteTrip.distance_km ?? null,
                    favoriteTrip.vehicle_name ?? null,
                    favoriteTrip.fuel_name ?? null,
                    favoriteTrip.trip_type_name ?? null,
                ]
            );

            return new FavoriteTrip(
                userEmail,
                favoriteTrip.start_location,
                favoriteTrip.end_location,
                favoriteTrip.distance_km,
                favoriteTrip.vehicle_name,
                favoriteTrip.fuel_name,
                favoriteTrip.trip_type_name
            );
        }
        finally {
            connection.release();
        }
    }

    /**
     * Retrieves all favorite trips for the given user, ordered by most recent first.
     *
     * @param userEmail - The email of the authenticated user.
     * @returns         A list of FavoriteTrip objects, or an empty array if none exist.
     */
    public async findAllByUser(userEmail: string): Promise<FavoriteTrip[]> {
        const connection: PoolConnection = await this.db.openConnection();

        try {
            const [rows] = await connection.query(
                `SELECT user_email, start_location, end_location, distance_km,
                        vehicle_name, fuel_name, trip_type_name, created_at
                 FROM favoritetrip
                 WHERE user_email = ?
                 ORDER BY created_at DESC`,
                [userEmail]
            );

            return rows as FavoriteTrip[];
        }
        finally {
            connection.release();
        }
    }
}
