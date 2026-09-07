/**
 * This is a generated file, all changes will be overwritten!
 */
import { WelcomeService } from "./services/WelcomeService";
import { IWelcomeService } from "./interfaces/IWelcomeService";
import { SessionService } from "./services/SessionService";
import { ISessionService } from "./interfaces/ISessionService";
import { VehicleRepository } from "./repositories/VehicleRepository";
import { IVehicleInterface } from "./interfaces/IVehicleInterface";
import { RoleRepository } from "./repositories/RoleRepository";
import { IRoleRepository } from "./interfaces/IRoleInterface";
import { ReservationRepository } from "./repositories/ReservationRepository";
import { IReservationInterface } from "./interfaces/IReservationInterface";
import { FaqRepository } from "./repositories/FaqRepository";
import { IFaqInterface } from "./interfaces/IFaqInterface";
defineMetadata("inherits", [IWelcomeService.prototype], WelcomeService.prototype);
defineMetadata("inherits", [ISessionService.prototype], SessionService.prototype);
defineMetadata("inherits", [IVehicleInterface.prototype], VehicleRepository.prototype);
defineMetadata("inherits", [IRoleRepository.prototype], RoleRepository.prototype);
defineMetadata("inherits", [IReservationInterface.prototype], ReservationRepository.prototype);
defineMetadata("inherits", [IFaqInterface.prototype], FaqRepository.prototype);
