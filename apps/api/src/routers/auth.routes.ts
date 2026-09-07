import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { ORMService } from "@api/services/ORMService";

const router: Router = Router();
const authController: AuthController = AuthController.getInstance();

router.post("/login", authController.login);
router.delete("/logout", authController.logout);

export async function initializeAuthORM(): Promise<void> {
    await ORMService.getInstance().initialize();
}

export default router;
