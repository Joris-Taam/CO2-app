import { Router } from "express";
import { RoleController } from "@api/controllers/RoleController";
import { RoleService } from "@api/services/RoleService";
import { RoleRepository } from "@api/repositories/RoleRepository";
import { DatabaseService } from "@api/services/DatabaseService";

const router: Router = Router();

const db: DatabaseService = new DatabaseService();
const roleRepository: RoleRepository = new RoleRepository(db);
const roleService: RoleService = new RoleService(roleRepository);
const roleController: RoleController = new RoleController(roleService);

router.get("/", roleController.getAll);
router.get("/:name", roleController.getByName);
router.post("/", roleController.create);
router.put("/:name", roleController.update);
router.delete("/:name", roleController.delete);

export default router;
