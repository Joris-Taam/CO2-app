import { Reservation } from "@web/interfaces/Reservation";

class ReservationTableComponent extends HTMLElement {
    private tableBody!: HTMLTableSectionElement;

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.innerHTML = `
            <link rel="stylesheet" href="/assets/css/global.css">
            <link rel="stylesheet" href="/assets/css/ReservationOverview.css">
            <table>
                <thead>
                    <tr>
                        <th>Kenteken</th>
                        <th>E-mail</th>
                        <th>Type</th>
                        <th>Startdatum</th>
                        <th>Einddatum</th>
                    </tr>
                </thead>
                <tbody id="reservation-table-body"></tbody>
            </table>
        `;
        this.tableBody = this.shadowRoot!.getElementById("reservation-table-body") as HTMLTableSectionElement;
    }

    public render(reservations: Reservation[]): void {
        this.tableBody.innerHTML = "";

        if (reservations.length === 0) {
            this.tableBody.innerHTML = "<tr><td colspan=\"5\" style=\"text-align:center; padding:20px; color:#888;\">Geen reserveringen gevonden</td></tr>";

            return;
        }

        reservations.forEach((reservation: Reservation) => {
            const tr: HTMLTableRowElement = document.createElement("tr");
            tr.style.cursor = "pointer";
            tr.innerHTML = `
                <td>${reservation.vehicles_number_plate}</td>
                <td>${reservation.users_email}</td>
                <td><span class="badge badge-info">${reservation.lease_type}</span></td>
                <td>${new Date(reservation.start_date).toLocaleDateString("nl-NL")}</td>
                <td>${new Date(reservation.end_date).toLocaleDateString("nl-NL")}</td>
            `;

            tr.addEventListener("click", () => {
                this.dispatchEvent(new CustomEvent("reservation-detail", {
                    detail: reservation,
                    bubbles: true,
                    composed: true,
                }));
            });

            this.tableBody.appendChild(tr);
        });
    }
}

customElements.define("reservation-table", ReservationTableComponent);
