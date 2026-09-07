import { Router } from "express";
import { FaqController } from "@api/controllers/faqController";
import { FaqService } from "@api/services/faqService";
import { FaqRepository } from "@api/repositories/FaqRepository";
import { DatabaseService } from "@api/services/DatabaseService";

const router: Router = Router();

const databaseService: DatabaseService = new DatabaseService();
const faqRepository: FaqRepository = new FaqRepository(databaseService);
const faqService: FaqService = new FaqService(faqRepository);
const faqController: FaqController = new FaqController(faqService);

// Routes
router.get("/", faqController.getAll);
router.get("/:question", faqController.getByQuestion);
router.post("/", faqController.create);
router.put("/:question", faqController.update);
router.delete("/:question", faqController.delete);

export default router;
