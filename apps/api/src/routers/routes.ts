import { Router } from "express";
import { WelcomeController } from "./../controllers/WelcomeController";
import { requireValidSessionMiddleware, sessionMiddleware } from "./../middleware/sessionMiddleware";

export const router: Router = Router();

router.get("/", (_, res) => {
    res.send("Welcome to the API!");
});

const welcomeController: WelcomeController = new WelcomeController();

router.use(sessionMiddleware);

router.get("/session", (req, res) => welcomeController.getSession(req, res));
router.delete("/session", (req, res) => welcomeController.deleteSession(req, res));
router.delete("/session/expired", (req, res) => welcomeController.deleteExpiredSessions(req, res));
router.get("/welcome", (req, res) => welcomeController.getWelcome(req, res));

router.get("/secret", (req, res) => welcomeController.getSecret(req, res));

// TODO: The following endpoints have to be implemented in their own respective controller
router.get("/products", (_req, _res) => {
    throw new Error("Return a list of products");
});
// NOTE: After this line, all endpoints will require a valid session.
router.use(requireValidSessionMiddleware);
