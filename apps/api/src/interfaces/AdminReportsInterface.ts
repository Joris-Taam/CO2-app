import { AdminReports, AdminReportsFilter } from "../models/AdminReport";

export interface IAdminReportsInterface {
    getAdminReports(filter?: AdminReportsFilter): Promise<AdminReports[]>;
}
