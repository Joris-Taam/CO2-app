import { VehicleController } from "@api/controllers/VehicleController";
import { VehicleService } from "@api/services/VehicleService";
import { VehicleRepository } from "@api/repositories/VehicleRepository";
import { DatabaseService } from "@api/services/DatabaseService";
import { Router } from "express";

const router: Router = Router();
const db: DatabaseService = new DatabaseService();
const vehicleRepo: VehicleRepository = new VehicleRepository(db);
const vehicleService: VehicleService = new VehicleService(vehicleRepo);
const vehicleController: VehicleController = new VehicleController(vehicleService);

router.get("/", vehicleController.getAllVehicles.bind(vehicleController));
router.get("/:numberPlate", vehicleController.getVehicleByNumberPlate.bind(vehicleController));
router.post("/", vehicleController.createVehicle.bind(vehicleController));
router.put("/:numberPlate", vehicleController.updateVehicle.bind(vehicleController));
router.delete("/:numberPlate", vehicleController.deleteVehicle.bind(vehicleController));

export default router;
