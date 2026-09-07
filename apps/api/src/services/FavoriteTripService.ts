import { IFavoriteTripRepository } from "@api/interfaces/IFavoriteTrip";
import { FavoriteTrip } from "@api/models/FavoriteTrip";

/**
 * Handles business logic for favorite trips.
 */
export class FavoriteTripService {
    public constructor(private readonly favoriteTripRepository: IFavoriteTripRepository) {
    }

    /**
     * Validates and saves a favorite trip for the given user.
     *
     * @param userEmail    - The email of the authenticated user.
     * @param favoriteTrip - The favorite trip data to save.
     * @returns            The saved FavoriteTrip.
     * @throws             Error if start_location or end_location is missing, or distance_km is negative.
     */
    public async saveFavoriteTrip(userEmail: string, favoriteTrip: FavoriteTrip): Promise<FavoriteTrip> {
        if (!favoriteTrip.start_location || favoriteTrip.start_location.trim() === "") {
            throw new Error("start_location is required");
        }

        if (!favoriteTrip.end_location || favoriteTrip.end_location.trim() === "") {
            throw new Error("end_location is required");
        }

        if (favoriteTrip.distance_km !== null && favoriteTrip.distance_km < 0) {
            throw new Error("distance_km must be a positive number");
        }

        return this.favoriteTripRepository.save(userEmail, favoriteTrip);
    }

    /**
     * Retrieves all favorite trips belonging to the given user.
     *
     * @param userEmail - The email of the authenticated user.
     * @returns         A list of FavoriteTrip objects, or an empty array if none exist.
     */
    public async getFavoriteTripsByUser(userEmail: string): Promise<FavoriteTrip[]> {
        return this.favoriteTripRepository.findAllByUser(userEmail);
    }
}
