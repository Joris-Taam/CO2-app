import { FavoriteTrip } from "@web/Models/FavoriteTrip";
import { FavoriteTripRepository } from "@web/repositories/FavoriteTripRepository";

export class FavoriteTripService {
    private readonly repository: FavoriteTripRepository;

    public constructor() {
        this.repository = new FavoriteTripRepository();
    }

    public async getAll(): Promise<FavoriteTrip[]> {
        return this.repository.findAll();
    }

    public async save(favoriteTrip: FavoriteTrip): Promise<FavoriteTrip> {
        if (!favoriteTrip.start_location.trim()) {
            throw new Error("start_location is required");
        }

        if (!favoriteTrip.end_location.trim()) {
            throw new Error("end_location is required");
        }

        if (favoriteTrip.distance_km !== null && favoriteTrip.distance_km < 0) {
            throw new Error("distance_km must be a positive number");
        }

        return this.repository.save(favoriteTrip);
    }
}
