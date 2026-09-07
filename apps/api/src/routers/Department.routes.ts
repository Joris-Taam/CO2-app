import { Router } from "express";
import { DepartmentController } from "@api/controllers/DepartmentController";
import { DepartmentService } from "@api/services/DepartmentService";
import { DepartmentRepository } from "@api/repositories/DepartmentRepository";
import { DatabaseService } from "@api/services/DatabaseService";

const router: Router = Router();

const db: DatabaseService = new DatabaseService();

const departmentRepository: DepartmentRepository = new DepartmentRepository(db);
const departmentService: DepartmentService = new DepartmentService(departmentRepository);
const departmentController: DepartmentController = new DepartmentController(departmentService);

router.get("/", departmentController.getAll);
router.get("/:name", departmentController.getByName);
router.post("/", departmentController.create);
router.put("/:name", departmentController.update);
router.delete("/:name", departmentController.delete);

export default router;
