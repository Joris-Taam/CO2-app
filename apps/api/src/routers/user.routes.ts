import { Router } from "express";
import { UserController } from "@api/controllers/UserController";
import { ORMService } from "@api/services/ORMService";
import { authMiddleware } from "../middleware/AuthMiddleware";

const router: Router = Router();
const userController: UserController = UserController.getInstance();

router.get("/", userController.getAllUsers);
router.get("/me", authMiddleware, userController.getCurrentUser);
router.get("/:email", userController.getUserByEmail);
router.post("/", userController.createUser);
router.put("/:email", userController.updateUser);
router.delete("/:email", userController.deleteUser);

/**
 * Initializes the ORM connection for user routes.
 *
 * @returns Promise that resolves when the ORM is ready
 */
export async function initializeUserORM(): Promise<void> {
    await ORMService.getInstance().initialize();
}

export default router;
