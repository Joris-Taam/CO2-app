import { RitData } from "@api/models/Trip";

export abstract class ITripService {
    public abstract createTrip(ritData: RitData): Promise<RitData>;
    public abstract getTripsByEmail(email: string): Promise<RitData[]>;
    public abstract updateTrip(email: string, datetime: string, data: Partial<RitData>): Promise<RitData | null>;
    public abstract deleteTrip(email: string, datetime: string): Promise<boolean>;
}

export abstract class ITripRepository {
    public abstract create(ritData: RitData): Promise<void>;
    public abstract findByEmail(email: string): Promise<RitData[]>;
    public abstract update(email: string, datetime: string, data: Partial<RitData>): Promise<RitData | null>;
    public abstract delete(email: string, datetime: string): Promise<boolean>;
}
