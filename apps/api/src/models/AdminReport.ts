export interface AdminReports {
    totalKilometers: number;
    totalTrips: number;
    totalCo2: number;
    vehicle_name: string;
}

export type AdminReportsPeriod = "year" | "month" | "week";

export type AdminReportsFilter = {
    startDate?: string;
    endDate?: string;
    department_name?: string;
    department_names?: string[];
    period?: AdminReportsPeriod;
};
