export interface FavoriteTrip {
    user_email: string;
    start_location: string;
    end_location: string;
    distance_km: number | null;
    vehicle_name: string | null;
    fuel_name: string | null;
    trip_type_name: string | null;
}
