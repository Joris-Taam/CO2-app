import { ITripRepository } from "../interfaces/ITripInterface";
import { Repository, UpdateResult, DeleteResult } from "typeorm";
import { ORMService } from "@api/services/ORMService";
import { RitData, TripORM, Brandstof, SoortRit, SoortVoertuig } from "../models/Trip";

/**
 * Repository for performing CRUD operations on trips via TypeORM.
 *
 * @remarks
 * Repository Pattern — Refactoring.Guru
 * @see https://refactoring.guru/design-patterns/catalog
 *
 * Het Repository pattern scheidt de database-logica van de business logica.
 * TripService weet niet hoe data wordt opgeslagen — alleen dát het gebeurt.
 */
export class TripRepository extends ITripRepository {
    private static _instance: TripRepository | undefined;

    private constructor() {
        super();
    }

    public static getInstance(): TripRepository {
        if (!TripRepository._instance) {
            TripRepository._instance = new TripRepository();
        }

        return TripRepository._instance;
    }

    public static resetInstance(): void {
        TripRepository._instance = undefined;
    }

    private get repository(): Repository<TripORM> {
        return ORMService.getInstance().getRepository(TripORM);
    }

    /**
     * Maps a TripORM entity to a plain RitData object.
     */
    private mapToRitData(entity: TripORM): RitData {
        const raw: unknown = entity.trip_datetime;
        let createdAt: string;

        if (raw instanceof Date) {
            // TypeORM geeft datetime terug als Date object — pad elk onderdeel handmatig
            // zodat er geen timezone-verschuiving optreedt via toISOString() (UTC)
            const y: number = raw.getFullYear();
            const mo: string = String(raw.getMonth() + 1).padStart(2, "0");
            const d: string = String(raw.getDate()).padStart(2, "0");
            const h: string = String(raw.getHours()).padStart(2, "0");
            const mi: string = String(raw.getMinutes()).padStart(2, "0");
            const s: string = String(raw.getSeconds()).padStart(2, "0");
            createdAt = `${y}-${mo}-${d} ${h}:${mi}:${s}`;
        }
        else {
            createdAt = String(raw).slice(0, 19).replace("T", " ");
        }

        return {
            userEmail: entity.user_email,
            createdAt,
            adres1: entity.start_location,
            adres2: entity.end_location,
            kilometers: entity.distance_km,
            soortVoertuig: entity.vehicle_name as SoortVoertuig,
            brandstof: entity.fuel_name as Brandstof,
            soortRit: entity.trip_type_name as SoortRit,
        };
    }

    /**
     * Finds a trip by email and datetime using a raw WHERE clause to avoid
     * TypeORM date comparison issues between string and Date types.
     */
    private async findByEmailAndDatetime(email: string, datetime: string): Promise<TripORM | null> {
        return this.repository
            .createQueryBuilder("trip")
            .where("trip.user_email = :email", { email })
            .andWhere("DATE_FORMAT(trip.trip_datetime, '%Y-%m-%d %H:%i:%s') = :datetime", { datetime })
            .getOne();
    }

    public async create(trip: RitData): Promise<void> {
        const entity: TripORM = this.repository.create({
            user_email: trip.userEmail,
            trip_datetime: trip.createdAt,
            start_location: trip.adres1,
            end_location: trip.adres2,
            distance_km: trip.kilometers,
            vehicle_name: trip.soortVoertuig,
            fuel_name: trip.brandstof,
            trip_type_name: trip.soortRit,
        });

        await this.repository.save(entity);
    }

    public async findByEmail(email: string): Promise<RitData[]> {
        const entities: TripORM[] = await this.repository.findBy({ user_email: email });

        return entities.map((entity: TripORM) => this.mapToRitData(entity));
    }

    public async update(email: string, datetime: string, data: Partial<RitData>): Promise<RitData | null> {
        const existing: TripORM | null = await this.findByEmailAndDatetime(email, datetime);

        if (!existing) {
            return null;
        }

        const updated: Partial<TripORM> = {
            start_location: data.adres1 ?? existing.start_location,
            end_location: data.adres2 ?? existing.end_location,
            distance_km: data.kilometers ?? existing.distance_km,
            vehicle_name: data.soortVoertuig ?? existing.vehicle_name,
            fuel_name: data.brandstof ?? existing.fuel_name,
            trip_type_name: data.soortRit ?? existing.trip_type_name,
        };

        const result: UpdateResult = await this.repository
            .createQueryBuilder()
            .update(TripORM)
            .set(updated)
            .where("user_email = :email", { email })
            .andWhere("DATE_FORMAT(trip_datetime, '%Y-%m-%d %H:%i:%s') = :datetime", { datetime })
            .execute();

        return (result.affected ?? 0) > 0
            ? this.mapToRitData({
                user_email: existing.user_email,
                trip_datetime: existing.trip_datetime,
                start_location: updated.start_location ?? existing.start_location,
                end_location: updated.end_location ?? existing.end_location,
                distance_km: updated.distance_km ?? existing.distance_km,
                vehicle_name: updated.vehicle_name ?? existing.vehicle_name,
                fuel_name: updated.fuel_name ?? existing.fuel_name,
                trip_type_name: updated.trip_type_name ?? existing.trip_type_name,
            })
            : null;
    }

    public async delete(email: string, datetime: string): Promise<boolean> {
        const result: DeleteResult = await this.repository
            .createQueryBuilder()
            .delete()
            .from(TripORM)
            .where("user_email = :email", { email })
            .andWhere("DATE_FORMAT(trip_datetime, '%Y-%m-%d %H:%i:%s') = :datetime", { datetime })
            .execute();

        return (result.affected ?? 0) > 0;
    }
}
