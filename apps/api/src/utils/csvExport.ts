import { AdminReports } from "../models/AdminReport";
import { AdminReportsPeriod } from "../models/AdminReport";
import { CsvExport } from "../models/CsvExport";

export function convertAdminReportsToCsv(reports: AdminReports[], startDate?: string, endDate?: string, period?: AdminReportsPeriod): CsvExport {
    const headers: string[] = ["Vehicle Name", "Total Kilometers", "Total Trips", "Total CO2 (kg)"];

    const rows: string[][] = reports.map(report => [
        report.vehicle_name,
        report.totalKilometers.toFixed(2),
        report.totalTrips.toString(),
        report.totalCo2.toFixed(4),
    ]);

    const dateInfo: string[] = [];

    if (period) {
        dateInfo.push(`Period;${period}`);
    }
    else {
        if (startDate) {
            dateInfo.push(`Start Date;${startDate}`);
        }

        if (endDate) {
            dateInfo.push(`End Date;${endDate}`);
        }
    }

    const dateBlock: string = dateInfo.length > 0 ? `${dateInfo.join("\n")}\n\n` : "";

    const content: string = dateBlock + [headers, ...rows]
        .map(row => row.join(";"))
        .join("\n");

    let filename: string;

    if (period) {
        filename = `admin-reports_${period}.csv`;
    }
    else {
        const startPart: string = startDate ? `_from-${startDate}` : "";
        const endPart: string = endDate ? `_to-${endDate}` : "";
        filename = `admin-reports${startPart}${endPart}.csv`;
    }

    return {
        filename,
        content,
        mimeType: "text/csv",
    };
}
