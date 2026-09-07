/**
 * Represents a favorite trip saved by a user.
 */
export class FavoriteTrip {
    public user_email: string;
    public start_location: string;
    public end_location: string;
    public distance_km: number | null;
    public vehicle_name: string | null;
    public fuel_name: string | null;
    public trip_type_name: string | null;

    /**
     * @param user_email      - The email of the user who owns this favorite trip.
     * @param start_location  - The starting location of the trip.
     * @param end_location    - The destination of the trip.
     * @param distance_km     - The distance of the trip in kilometers, or null if unknown.
     * @param vehicle_name    - The name of the vehicle used, or null if not specified.
     * @param fuel_name       - The fuel type used, or null if not specified.
     * @param trip_type_name  - The type of trip, or null if not specified.
     */
    public constructor(
        user_email: string,
        start_location: string,
        end_location: string,
        distance_km: number | null,
        vehicle_name: string | null,
        fuel_name: string | null,
        trip_type_name: string | null
    ) {
        this.user_email = user_email;
        this.start_location = start_location;
        this.end_location = end_location;
        this.distance_km = distance_km;
        this.vehicle_name = vehicle_name;
        this.fuel_name = fuel_name;
        this.trip_type_name = trip_type_name;
    }
}
