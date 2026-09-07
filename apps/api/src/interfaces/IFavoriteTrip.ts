import { FavoriteTrip } from "@api/models/FavoriteTrip";

/**
 * Repository interface for managing favorite trips in the database.
 */
@Interface
export abstract class IFavoriteTripRepository {
    /**
     * Saves a new favorite trip for the given user.
     *
     * @param userEmail    - The email of the authenticated user.
     * @param favoriteTrip - The favorite trip data to save.
     * @returns            The saved FavoriteTrip.
     */
    public abstract save(userEmail: string, favoriteTrip: FavoriteTrip): Promise<FavoriteTrip>;

    /**
     * Retrieves all favorite trips belonging to the given user.
     *
     * @param userEmail - The email of the authenticated user.
     * @returns         A list of FavoriteTrip objects, or an empty array if none exist.
     */
    public abstract findAllByUser(userEmail: string): Promise<FavoriteTrip[]>;
}
