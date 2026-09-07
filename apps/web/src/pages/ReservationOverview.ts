import { ReservationService } from "@web/services/ReservationService";
import { Reservation } from "@web/interfaces/Reservation";
import "@web/components/reservation/ReservationTableComponent";
import "@web/components/reservation/ReservationDetailComponent";
import "@web/components/reservation/ReservationFormComponent";
import "@web/components/AdminSidebarComponent";

interface IReservationTable extends HTMLElement {
    render(reservations: Reservation[]): void;
}

interface IReservationDetail extends HTMLElement {
    open(reservation: Reservation): void;
    close(): void;
}

interface IReservationForm extends HTMLElement {
    open(): void;
    close(): void;
    setError(message: string): void;
}

class ReservationOverviewPage {
    private readonly reservationService: ReservationService = new ReservationService();

    private readonly table: IReservationTable;
    private readonly detailModal: IReservationDetail;
    private readonly formModal: IReservationForm;

    public constructor() {
        this.table = document.getElementById("reservation-table") as unknown as IReservationTable;
        this.detailModal = document.getElementById("reservation-detail") as unknown as IReservationDetail;
        this.formModal = document.getElementById("reservation-form") as unknown as IReservationForm;

        document.getElementById("open-create")!.addEventListener("click", () => this.formModal.open());

        document.addEventListener("reservation-detail", (e: Event) => {
            this.detailModal.open((e as CustomEvent<Reservation>).detail);
        });

        document.addEventListener("reservation-submit", (e: Event) => {
            void this.handleCreate((e as CustomEvent<Omit<Reservation, "users_email" | "created_at">>).detail);
        });

        void this.loadReservations();
    }

    private async loadReservations(): Promise<void> {
        try {
            const reservations: Reservation[] = await this.reservationService.getAllReservations();
            this.table.render(reservations);
        }
        catch (err) {
            console.error("Fout bij laden reserveringen:", err);
        }
    }

    private async handleCreate(data: Omit<Reservation, "users_email" | "created_at">): Promise<void> {
        try {
            const reservation: Reservation = { ...data, users_email: "", created_at: new Date() };
            await this.reservationService.createReservation(reservation);
            this.formModal.close();
            await this.loadReservations();
        }
        catch (err) {
            this.formModal.setError(err instanceof Error ? err.message : "Onbekende fout");
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new ReservationOverviewPage();
});
