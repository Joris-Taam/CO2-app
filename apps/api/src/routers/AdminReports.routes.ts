import { Router } from "express";
import { AdminReportsController } from "../controllers/AdminReportsController";
import { AdminReportsService } from "../services/AdminReportsService";
import { AdminReportsRepository } from "../repositories/AdminReportsRepository";
import { CsvExportService } from "../services/CsvExportService";
import { DatabaseService } from "../services/DatabaseService";

const router: Router = Router();

const databaseService: DatabaseService = new DatabaseService();
const adminReportsRepository: AdminReportsRepository = new AdminReportsRepository(databaseService);
const adminReportsService: AdminReportsService = new AdminReportsService(adminReportsRepository);
const csvExportService: CsvExportService = new CsvExportService(adminReportsRepository);
const adminReportsController: AdminReportsController = new AdminReportsController(adminReportsService, csvExportService);

router.get("/", adminReportsController.getAdminReports);
router.get("/export", adminReportsController.exportAdminReportsCsv);

export default router;
