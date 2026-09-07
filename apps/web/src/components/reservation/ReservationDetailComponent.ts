import { Reservation } from "@web/interfaces/Reservation";

class ReservationDetailComponent extends HTMLElement {
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.innerHTML = `
            <link rel="stylesheet" href="/assets/css/global.css">
            <link rel="stylesheet" href="/assets/css/ReservationOverview.css">
            <div class="modal" id="detail-modal">
                <div class="modal-content">
                    <button class="close-btn" id="close-detail">&times;</button>
                    <h2>Reservering details</h2>
                    <div id="detail-content" class="detail-grid"></div>
                </div>
            </div>
        `;

        this.shadowRoot!.getElementById("close-detail")!.addEventListener("click", () => this.close());
        this.shadowRoot!.getElementById("detail-modal")!.addEventListener("click", (e: Event) => {
            if (e.target === this.shadowRoot!.getElementById("detail-modal")) {
                this.close();
            }
        });
    }

    public open(reservation: Reservation): void {
        const content: HTMLElement = this.shadowRoot!.getElementById("detail-content")!;
        content.innerHTML = `
            <div class="detail-item"><label>Kenteken</label><span>${reservation.vehicles_number_plate}</span></div>
            <div class="detail-item"><label>E-mail gebruiker</label><span>${reservation.users_email}</span></div>
            <div class="detail-item"><label>Type lease</label><span>${reservation.lease_type}</span></div>
            <div class="detail-item"><label>Startdatum</label><span>${new Date(reservation.start_date).toLocaleDateString("nl-NL")}</span></div>
            <div class="detail-item"><label>Einddatum</label><span>${new Date(reservation.end_date).toLocaleDateString("nl-NL")}</span></div>
            <div class="detail-item"><label>Aangemaakt op</label><span>${new Date(reservation.created_at).toLocaleDateString("nl-NL")}</span></div>
        `;
        this.shadowRoot!.getElementById("detail-modal")!.classList.add("show");
    }

    public close(): void {
        this.shadowRoot!.getElementById("detail-modal")!.classList.remove("show");
    }
}

customElements.define("reservation-detail", ReservationDetailComponent);
