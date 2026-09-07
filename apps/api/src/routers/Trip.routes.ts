import { Router } from "express";
import { TripController } from "../controllers/TripController";
import { ORMService } from "../services/ORMService";
import { authMiddleware } from "../middleware/AuthMiddleware";

/**
 * Chain of Responsibility Pattern — Refactoring.Guru
 * @see https://refactoring.guru/design-patterns/chain-of-responsibility
 *
 * Elke route gebruikt een keten van handlers:
 * 1. authMiddleware — controleert het JWT token en stopt de keten bij een ongeldige token (401)
 * 2. tripController — verwerkt het request als de vorige schakel next() heeft aangeroepen
 *
 * Dit patroon zorgt ervoor dat autorisatie-logica gescheiden blijft van
 * de business logica in de controller.
 */

const router: Router = Router();

const tripController: TripController = TripController.getInstance();

router.get("/me", authMiddleware, tripController.getTripsByEmail);
router.post("/create", authMiddleware, tripController.createRit);
router.get("/:email", authMiddleware, tripController.getTripsByEmail);
router.put("/:datetime", authMiddleware, tripController.updateRit);
router.delete("/:datetime", authMiddleware, tripController.deleteRit);

/**
 * Initializes the ORM connection for trip routes.
 *
 * @returns Promise that resolves when the ORM is ready
 */
export async function initializeTripORM(): Promise<void> {
    await ORMService.getInstance().initialize();
}

export default router;
