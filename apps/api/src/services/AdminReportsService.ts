import { AdminReportsRepository } from "../repositories/AdminReportsRepository";
import { AdminReports, AdminReportsFilter } from "../models/AdminReport";

/**
 * Service responsible for handling admin report business logic.
 */
export class AdminReportsService {
    /**
     * @param adminReportsRepository - The repository used to fetch admin report data.
     */
    public constructor(private readonly adminReportsRepository: AdminReportsRepository) {
    }

    /**
     * Retrieves all admin reports, optionally filtered by date range.
     *
     * @param filter - Optional filter containing `startDate` and/or `endDate`.
     * @returns A promise that resolves to an array of {@link AdminReports}.
     */
    public async getAdminReports(filter?: AdminReportsFilter): Promise<AdminReports[]> {
        return this.adminReportsRepository.findAdminReports(filter);
    }
}
