import { ITripService } from "../interfaces/ITripInterface";
import { TripRepository } from "@api/repositories/TripRepository";
import { RitData } from "../models/Trip";

/**
 * Service for handling trip-related business logic.
 *
 * @remarks
 * Singleton Pattern — Refactoring.Guru
 * @see https://refactoring.guru/design-patterns/singleton
 */
export class TripService extends ITripService {
    private static _instance: TripService | undefined;

    private constructor(private readonly tripRepo: TripRepository) {
        super();
    }

    public static getInstance(): TripService {
        if (!TripService._instance) {
            TripService._instance = new TripService(TripRepository.getInstance());
        }

        return TripService._instance;
    }

    public static setInstance(repo: TripRepository): void {
        TripService._instance = new TripService(repo);
    }

    public async createTrip(data: RitData): Promise<RitData> {
        await this.tripRepo.create(data);

        return data;
    }

    public async getTripsByEmail(email: string): Promise<RitData[]> {
        return this.tripRepo.findByEmail(email);
    }

    public async updateTrip(email: string, datetime: string, data: Partial<RitData>): Promise<RitData | null> {
        return this.tripRepo.update(email, datetime, data);
    }

    public async deleteTrip(email: string, datetime: string): Promise<boolean> {
        return this.tripRepo.delete(email, datetime);
    }
}
