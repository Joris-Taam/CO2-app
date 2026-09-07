import { RitRepository } from "../repositories/TripRepository";
import { Rit, RitInput } from "../interfaces/TripInterface";

export class RitService {
    public constructor(private readonly repository: RitRepository) {
    }

    public async createRit(rit: RitInput): Promise<RitInput> {
        return await this.repository.create(rit);
    }

    public async getTripByUser(): Promise<{ naam: string; ritten: Rit [] }> {
        return await this.repository.getByUser();
    }

    public async updateRit(rit: RitInput): Promise<RitInput> {
        return await this.repository.update(rit);
    }

    public async deleteRit(rit: Rit): Promise<void> {
        await this.repository.delete(rit);
    }
}
