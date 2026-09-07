export type AdminReportsPeriod = "year" | "month" | "week";

export interface AdminReports {
    totalKilometers: number;
    totalTrips: number;
    totalCo2: number;
    vehicle_name: string;
}

export interface chartSettings {
    label: string;
    yAxis: string;
    title: string;
    unit: string;
    chartType: keyof AdminReports;
}
