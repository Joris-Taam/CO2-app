import { Router } from "express";
import { ContactController } from "../controllers/ContactController";
import { ORMService } from "@api/services/ORMService";

const router: Router = Router();
const contactController: ContactController = ContactController.getInstance();

router.post("/", contactController.createContact);
router.get("/", contactController.getAllContacts);
router.delete("/:created_at", contactController.deleteContact);

/**
 * Initializes the ORM connection for contact routes.
 *
 * @returns Promise that resolves when the ORM is ready
 */
export async function initializeContactORM(): Promise<void> {
    await ORMService.getInstance().initialize();
}

export default router;
