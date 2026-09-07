import { AdminReportsRepository } from "../repositories/AdminReportsRepository";
import { AdminReports, AdminReportsPeriod } from "../interfaces/AdminReports";

export class AdminReportsService {
    private readonly repository: AdminReportsRepository;

    public constructor(repository?: AdminReportsRepository) {
        this.repository = repository ?? new AdminReportsRepository();
    }

    public async getAllAdminReports(startDate?: string, endDate?: string, department?: string, period?: AdminReportsPeriod): Promise<AdminReports[]> {
        try {
            return await this.repository.getAll(startDate, endDate, department, period);
        }
        catch (error) {
            throw new Error(`Failed to fetch admin reports: ${(error as Error).message}`);
        }
    }

    public async exportCsv(startDate?: string, endDate?: string, department?: string, period?: AdminReportsPeriod): Promise<void> {
        const result: { blob: Blob; filename: string } = await this.repository.exportCsv(startDate, endDate, department, period);
        const url: string = URL.createObjectURL(result.blob);
        const anchor: HTMLAnchorElement = document.createElement("a");

        anchor.href = url;
        anchor.download = result.filename;
        anchor.click();

        URL.revokeObjectURL(url);
    }
}
