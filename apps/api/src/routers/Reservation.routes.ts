import router from "express";
import { ReservationController } from "@api/controllers/ReservationController";
import { ReservationService } from "@api/services/ReservationService";
import { ReservationRepository } from "@api/repositories/ReservationRepository";
import { DatabaseService } from "@api/services/DatabaseService";

const reservationRouter: router.Router = router.Router();

const databaseService: DatabaseService = new DatabaseService();
const reservationRepository: ReservationRepository = new ReservationRepository(databaseService);
const reservationServiceInstance: ReservationService = new ReservationService(reservationRepository);
const reservationController: ReservationController = new ReservationController(reservationServiceInstance);

reservationRouter.get("/", reservationController.getallReservations.bind(reservationController));
reservationRouter.get("/user/:users_email", reservationController.getReservationsByUserEmail.bind(reservationController));
reservationRouter.get("/vehicle/:vehicles_number_plate", reservationController.getReservationsByVehicleNumberPlate.bind(reservationController));
reservationRouter.post("/", reservationController.createReservation.bind(reservationController));
reservationRouter.delete("/:id", reservationController.deleteReservation.bind(reservationController));

export default reservationRouter;
