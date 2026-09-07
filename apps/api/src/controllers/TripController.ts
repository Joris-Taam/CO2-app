import { Request, Response } from "express";
import { TripService } from "@api/services/TripService";
import { RitData } from "@api/models/Trip";
import { AuthRequest } from "@api/middleware/AuthMiddleware";

/**
 * Controller for handling trip-related (rit) HTTP requests.
 *
 * @remarks
 * Singleton Pattern — Refactoring.Guru
 * @see https://refactoring.guru/design-patterns/singleton
 *
 * De instantie wordt hergebruikt zodat er maar één TripController
 * actief is in de applicatie.
 */

export class TripController {
    private static _instance: TripController | undefined;

    private constructor(private tripService: TripService) {
    }

    /**
     * Returns the singleton instance of TripController.
     *
     * @returns The singleton TripController instance
     */

    public static getInstance(): TripController {
        if (!TripController._instance) {
            TripController._instance = new TripController(TripService.getInstance());
        }

        return TripController._instance;
    }

    /**
     * Creates a new trip.
     *
     * @param req - The HTTP request object containing trip data and user auth
     * @param res - The HTTP response object
     */

    public createRit = async (req: Request, res: Response): Promise<void> => {
        try {
            const authReq: AuthRequest = req as AuthRequest;
            const bodyData: Partial<RitData> = authReq.body as Partial<RitData>;
            const userEmail: string = authReq.user.email;

            if (!bodyData.adres1 || !bodyData.adres2 || !bodyData.kilometers || !bodyData.soortRit || !bodyData.soortVoertuig || !bodyData.brandstof) {
                res.status(400).json({ error: "Alle velden zijn verplicht." });

                return;
            }

            const now: Date = new Date();
            const mysqlTimestamp: string = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

            const nieuweRit: RitData = {
                userEmail,
                createdAt: mysqlTimestamp,
                adres1: bodyData.adres1,
                adres2: bodyData.adres2,
                kilometers: bodyData.kilometers,
                soortVoertuig: bodyData.soortVoertuig,
                brandstof: bodyData.brandstof,
                soortRit: bodyData.soortRit,
            };

            await this.tripService.createTrip(nieuweRit);

            res.status(201).json({ message: "Rit succesvol opgeslagen in database" });
        }
        catch (error: unknown) {
            console.error("Controller Error:", error);
            res.status(500).json({ error: "Fout bij opslaan in database. Check console." });
        }
    };

    /**
     * Retrieves all trips associated with the authenticated user's email.
     *
     * @param req - The HTTP request object containing user auth
     * @param res - The HTTP response object
     */

    public getTripsByEmail = async (req: Request, res: Response): Promise<void> => {
        try {
            const authReq: AuthRequest = req as AuthRequest;
            const email: string = authReq.user.email;
            const naam: string = authReq.user.name;

            const trips: Awaited<ReturnType<typeof this.tripService.getTripsByEmail>> =
                await this.tripService.getTripsByEmail(email);

            res.json({ naam, ritten: trips });
        }
        catch (error: unknown) {
            console.error("Controller Error:", error);
            res.status(500).json({ error: "Fout bij ophalen ritten." });
        }
    };

    /**
     * Updates an existing trip by user email and datetime.
     *
     * @param req - The HTTP request object containing the datetime param and updated data
     * @param res - The HTTP response object
     */

    public updateRit = async (
        req: Request<{ datetime: string }>,
        res: Response
    ): Promise<void> => {
        try {
            const authReq: AuthRequest = req as unknown as AuthRequest;
            const bodyData: Partial<RitData> = authReq.body as Partial<RitData>;
            const userEmail: string = authReq.user.email;
            const rawDatetime: string = req.params.datetime;

            if (!rawDatetime) {
                res.status(400).json({ error: "Datum/tijd is verplicht." });

                return;
            }

            const datetime: string = decodeURIComponent(rawDatetime).slice(0, 19).replace("T", " ");

            if (!bodyData.adres1 || !bodyData.adres2 || !bodyData.kilometers || !bodyData.soortRit || !bodyData.soortVoertuig || !bodyData.brandstof) {
                res.status(400).json({ error: "Alle velden zijn verplicht." });

                return;
            }

            await this.tripService.updateTrip(userEmail, datetime, bodyData);

            res.status(200).json({ message: "Rit succesvol geüpdatet in database" });
        }
        catch (error: unknown) {
            console.error("Controller Error:", error);
            res.status(500).json({ error: "Fout bij opslaan in database. Check console." });
        }
    };

    /**
     * Deletes a trip by user email and datetime.
     *
     * @param req - The HTTP request object containing the datetime param
     * @param res - The HTTP response object
     */

    public deleteRit = async (
        req: Request<{ datetime: string }>,
        res: Response
    ): Promise<void> => {
        try {
            const authReq: AuthRequest = req as unknown as AuthRequest;
            const userEmail: string = authReq.user.email;
            const rawDatetime: string = req.params.datetime;

            if (!rawDatetime) {
                res.status(400).json({ error: "Datum/tijd is verplicht." });

                return;
            }

            const datetime: string = decodeURIComponent(rawDatetime).slice(0, 19).replace("T", " ");

            await this.tripService.deleteTrip(userEmail, datetime);

            res.status(200).json({ message: "Rit succesvol verwijderd uit database" });
        }
        catch (error: unknown) {
            console.error("Controller Error:", error);
            res.status(500).json({ error: "Fout bij verwijderen uit database. Check console." });
        }
    };
}
