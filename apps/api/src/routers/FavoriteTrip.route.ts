import { Router } from "express";
import { FavoriteTripController } from "@api/controllers/FavoriteTripController";
import { FavoriteTripService } from "@api/services/FavoriteTripService";
import { FavoriteTripRepository } from "@api/repositories/FavoriteTripRepository";
import { DatabaseService } from "@api/services/DatabaseService";
import { authMiddleware } from "../middleware/AuthMiddleware";

const router: Router = Router();

const db: DatabaseService = new DatabaseService();
const favoriteTripRepository: FavoriteTripRepository = new FavoriteTripRepository(db);
const favoriteTripService: FavoriteTripService = new FavoriteTripService(favoriteTripRepository);
const favoriteTripController: FavoriteTripController = new FavoriteTripController(favoriteTripService);

router.post("/", authMiddleware, favoriteTripController.save);
router.get("/", authMiddleware, favoriteTripController.getAll);

export default router;
