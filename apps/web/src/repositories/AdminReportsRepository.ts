import { AdminReports, AdminReportsPeriod } from "../interfaces/AdminReports";

const BASE_URL: string = "http://localhost:3001/adminReports";

interface CsvExportResult {
    blob: Blob;
    filename: string;
}

export class AdminReportsRepository {
    private getHeaders(): HeadersInit {
        const token: string | null = localStorage.getItem("token");

        return {
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    }

    public async getAll(startDate?: string, endDate?: string, department?: string, period?: AdminReportsPeriod): Promise<AdminReports[]> {
        const params: URLSearchParams = new URLSearchParams();

        if (period) {
            params.append("period", period);
        }

        if (startDate) {
            params.append("startDate", startDate);
        }

        if (endDate) {
            params.append("endDate", endDate);
        }

        if (department) {
            params.append("department", department);
        }

        const url: string = params.toString() ? `${BASE_URL}?${params.toString()}` : BASE_URL;
        const response: Response = await fetch(url, {
            method: "GET",
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch admin reports");
        }

        return (await response.json()) as AdminReports[];
    }

    public async exportCsv(startDate?: string, endDate?: string, department?: string, period?: AdminReportsPeriod): Promise<CsvExportResult> {
        const params: URLSearchParams = new URLSearchParams();

        if (period) {
            params.append("period", period);
        }

        if (startDate) {
            params.append("startDate", startDate);
        }

        if (endDate) {
            params.append("endDate", endDate);
        }

        if (department) {
            params.append("department", department);
        }

        const url: string = params.toString() ? `${BASE_URL}/export?${params.toString()}` : `${BASE_URL}/export`;
        const response: Response = await fetch(url, {
            method: "GET",
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error("Failed to export admin reports");
        }

        const disposition: string | null = response.headers.get("Content-Disposition");
        const match: RegExpMatchArray | null = disposition?.match(/filename="(.+)"/) ?? null;
        const filename: string = match ? match[1] : "admin-reports.csv";

        return { blob: await response.blob(), filename };
    }
}
