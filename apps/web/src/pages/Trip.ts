import { RitService } from "@web/services/TripService";
import "@web/components/AdminSidebarComponent";
import "@web/components/trips/TripPageComponent";
import { RitRepository } from "@web/repositories/TripRepository";

document.addEventListener("DOMContentLoaded", () => {
    new RitService(new RitRepository());
});
