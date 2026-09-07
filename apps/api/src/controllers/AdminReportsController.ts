import { Request, Response } from "express";
import { AdminReportsService } from "../services/AdminReportsService";
import { AdminReports, AdminReportsFilter, AdminReportsPeriod } from "@api/models/AdminReport";
import { CsvExportService } from "../services/CsvExportService";
import { convertAdminReportsToCsv } from "../utils/csvExport";
import { CsvExport } from "../models/CsvExport";

export class AdminReportsController {
    public constructor(
        private readonly adminReportsService: AdminReportsService,
        private readonly csvExportService: CsvExportService
    ) {
    }

    public getAdminReports = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { startDate, endDate, department, period } = req.query as {
                startDate?: string;
                endDate?: string;
                department?: string;
                period?: AdminReportsPeriod;
            };

            const department_names: string[] | undefined = department
                ? department.split(",").map(d => d.trim()).filter(Boolean)
                : undefined;

            const filter: AdminReportsFilter = { startDate, endDate, department_names, period };

            const adminReports: AdminReports[] = await this.adminReportsService.getAdminReports(filter);

            return res.json(adminReports);
        }
        catch (error) {
            return res.status(500).json({ message: "Server error", error });
        }
    };

    public exportAdminReportsCsv = async (req: Request, res: Response): Promise<void> => {
        try {
            const { startDate, endDate, department, period } = req.query as {
                startDate?: string;
                endDate?: string;
                department?: string;
                period?: AdminReportsPeriod;
            };

            const department_names: string[] | undefined = department
                ? department.split(",").map(d => d.trim()).filter(Boolean)
                : undefined;

            const filter: AdminReportsFilter = { startDate, endDate, department_names, period };

            const reports: AdminReports[] = await this.csvExportService.getAdminReportsForExport(filter);
            const csv: CsvExport = convertAdminReportsToCsv(reports, startDate, endDate);

            res.setHeader("Content-Type", csv.mimeType);
            res.setHeader("Content-Disposition", `attachment; filename="${csv.filename}"`);
            res.send(csv.content);
        }
        catch (error) {
            res.status(500).json({ message: "Server error", error: (error as Error).message });
        }
    };
}
