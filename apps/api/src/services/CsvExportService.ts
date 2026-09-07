import { AdminReportsRepository } from "../repositories/AdminReportsRepository";
import { AdminReportsFilter } from "../models/AdminReport";
import { AdminReports } from "../models/AdminReport";

/**
 * Service responsible for retrieving data needed for CSV exports.
 */
export class CsvExportService {
    /**
     * @param adminReportsRepository - The repository used to fetch admin report data.
     */
    public constructor(private readonly adminReportsRepository: AdminReportsRepository) {
    }

    /**
     * Retrieves admin reports to be used for a CSV export.
     *
     * @param filter - Optional filter containing `startDate` and/or `endDate`.
     * @returns A promise that resolves to an array of {@link AdminReports}.
     */
    public async getAdminReportsForExport(filter?: AdminReportsFilter): Promise<AdminReports[]> {
        return this.adminReportsRepository.findAdminReports(filter);
    }
}
