import { Request, Response } from "express";
import { FavoriteTrip } from "@api/models/FavoriteTrip";
import { FavoriteTripService } from "@api/services/FavoriteTripService";

/**
 * Handles HTTP requests for the favorite-trip endpoints.
 */
export class FavoriteTripController {
    public constructor(private readonly favoriteTripService: FavoriteTripService) {
    }

    /**
     * POST /favorite-trip
     * Saves a new favorite trip for the authenticated user.
     *
     * @param req - Express request containing the FavoriteTrip body.
     * @param res - Express response with the saved FavoriteTrip or an error message.
     */
    public save = async (req: Request, res: Response): Promise<void> => {
        try {
            const userEmail: string | undefined = (req as Request & { user?: { email: string } }).user?.email;

            if (!userEmail) {
                res.status(401).json({ message: "Unauthorized" });

                return;
            }

            const favoriteTrip: FavoriteTrip = req.body as FavoriteTrip;

            const saved: FavoriteTrip = await this.favoriteTripService.saveFavoriteTrip(userEmail, favoriteTrip);

            res.status(201).json(saved);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });

                return;
            }

            res.status(500).json({ message: "Internal server error" });
        }
    };

    /**
     * GET /favorite-trip
     * Retrieves all favorite trips for the authenticated user.
     *
     * @param req - Express request with the authenticated user.
     * @param res - Express response with a list of FavoriteTrip objects or an error message.
     */
    public getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const userEmail: string | undefined = (req as Request & { user?: { email: string } }).user?.email;

            if (!userEmail) {
                res.status(401).json({ message: "Unauthorized" });

                return;
            }

            const trips: FavoriteTrip[] = await this.favoriteTripService.getFavoriteTripsByUser(userEmail);

            res.status(200).json(trips);
        }
        catch {
            res.status(500).json({ message: "Internal server error" });
        }
    };
}
