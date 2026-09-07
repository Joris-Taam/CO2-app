import { Rit, RitInput } from "@web/interfaces/TripInterface";
import { RitService } from "@web/services/TripService";
import { RitRepository } from "@web/repositories/TripRepository";
import { Co2CalculatorComponent } from "./Co2CalculatorComponent";
import { ITripEditModalComponent, ITripFilterComponent, ITripRowComponent } from "./ITripComponents";
import "./TripEditModalComponent";
import "./TripRowComponent";
import "./TripFilterComponent";

class TripListComponent extends HTMLElement {
    private tableBody!: HTMLTableSectionElement;
    private tripFilter!: ITripFilterComponent;
    private btnLaadMeer!: HTMLButtonElement;
    private totalCo2Element!: HTMLElement;
    private readonly ritService: RitService = new RitService(new RitRepository());

    private allTrips: Rit[] = [];
    private currentPage: number = 0;
    private readonly pageSize: number = 10;

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.innerHTML = `
            <link rel="stylesheet" href="/assets/css/Trip.css">
            <link rel="stylesheet" href="/assets/css/global.css">
            <section class="co2-summary">
                <section class="co2-content">
                    <h3>Totaal CO2-uitstoot: </h3>
                    <p id="totalCo2">0 kg CO2</p>
                </section>
            </section>
            <trip-filter></trip-filter>
            <section class="faq-table">
                <table>
                    <thead>
                        <tr>
                            <th>Datum</th>
                            <th>Vertrek</th>
                            <th>Bestemming</th>
                            <th>Kilometers</th>
                            <th>Voertuig</th>
                            <th>Brandstof</th>
                            <th>Soort rit</th>
                            <th>CO2</th>
                            <th colspan="2"></th>
                        </tr>
                    </thead>
                    <tbody id="rittenLijst"></tbody>
                </table>
            </section>
            <section class="footer-actions">
                <button id="btnLaadMeer" class="btn btn-secondary">Laad meer</button>
            </section>
            <rit-edit-modal id="globalEditModal"></rit-edit-modal>
        `;

        this.tableBody = this.shadowRoot!.getElementById("rittenLijst") as HTMLTableSectionElement;
        this.btnLaadMeer = this.shadowRoot!.getElementById("btnLaadMeer") as HTMLButtonElement;
        this.totalCo2Element = this.shadowRoot!.getElementById("totalCo2") as HTMLElement;
        this.tripFilter = this.shadowRoot!.querySelector("trip-filter") as ITripFilterComponent;
        this.bindEvents();

        this.btnLaadMeer.addEventListener("click", () => {
            this.currentPage++;
            this.displayTrips(this.allTrips);
        });

        void this.loadTrips();
    }

    public setTrips(trips: Rit[]): void {
        this.allTrips = trips.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.currentPage = 0;
        this.tableBody.innerHTML = "";
        this.displayTrips(this.allTrips);
        this.updateCo2(this.allTrips);
    }

    public renderFiltered(trips: Rit[]): void {
        this.tableBody.innerHTML = "";
        trips.forEach(trip => this.appendRow(trip));
        this.updateCo2(trips);
        this.btnLaadMeer.style.display = "none";
    }

    private displayTrips(trips: Rit[]): void {
        const start: number = this.currentPage * this.pageSize;
        const end: number = start + this.pageSize;

        trips.slice(start, end).forEach(trip => this.appendRow(trip));

        this.btnLaadMeer.style.display = end >= trips.length ? "none" : "block";
    }

    private appendRow(trip: Rit): void {
        const row: ITripRowComponent = document.createElement<"tr">("tr", { is: "trip-row" }) as unknown as ITripRowComponent;
        row.setTrip(trip);
        this.tableBody.appendChild(row);
    }

    private updateCo2(trips: Rit[]): void {
        this.totalCo2Element.textContent = `${Co2CalculatorComponent.calculateTotalCo2(trips).toFixed(2)} kg`;
    }

    private bindEvents(): void {
        document.addEventListener("rit-created", () => {
            this.allTrips = [];
            void this.loadTrips();
        });

        this.addEventListener("open-edit-modal", (e: Event) => {
            const customEvent: CustomEvent<Rit> = e as CustomEvent<Rit>;
            const editModal: ITripEditModalComponent | null = this.shadowRoot!.querySelector<ITripEditModalComponent>("#globalEditModal");
            editModal?.open(customEvent.detail);
        });

        this.addEventListener("rit-edit-submit", async (e: Event) => {
            const customEvent: CustomEvent<RitInput> = e as CustomEvent<RitInput>;
            const editModal: ITripEditModalComponent | null = this.shadowRoot!.querySelector<ITripEditModalComponent>("#globalEditModal");

            try {
                await this.ritService.updateRit(customEvent.detail);
                editModal?.close();
                await this.loadTrips();
            }
            catch {
                editModal?.setError("Kon de rit niet bijwerken.");
            }
        });

        this.addEventListener("rit-delete-request", async (e: Event) => {
            const customEvent: CustomEvent<Rit> = e as CustomEvent<Rit>;

            if (!confirm(`Weet je zeker dat je de rit van ${new Date(customEvent.detail.createdAt).toLocaleDateString("nl-NL")} wil verwijderen?`)) {
                return;
            }

            try {
                await this.ritService.deleteRit(customEvent.detail);
                await this.loadTrips();
            }
            catch {
                console.error("Kon de rit niet verwijderen.");
            }
        });

        this.tripFilter.addEventListener("filter-changed", () => {
            const filtered: Rit[] = this.tripFilter.filterTrips(this.allTrips);
            this.renderFiltered(filtered);
        });
    }

    private async loadTrips(): Promise<void> {
        try {
            const response: { naam: string; ritten: Rit[] } = await this.ritService.getTripByUser();
            this.allTrips = response.ritten;
            this.setTrips(this.allTrips);
        }
        catch (error: unknown) {
            console.error("Failed to load trips:", error);
        }
    }
}

customElements.define("trip-list", TripListComponent);
